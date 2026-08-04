import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { PhoneRepository } from '../database/repositories/phone.repository';
import { Phone } from '../database/types';

export interface CartItem {
  phoneId: string;
  quantity: number;
}

export interface PayFastPayment {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  name_last: string;
  email_address: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description: string;
  signature: string;
  custom_int1?: number;
  custom_str1?: string;
  sandbox?: boolean;
}

export interface CheckoutRequest {
  items: CartItem[];
  name: string;
  email: string;
  phone?: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
  sandbox?: boolean;
}

@Injectable()
export class CheckoutService {
  private orders: { id: string; status: string; amount: number; items: CartItem[]; paymentStatus?: string }[] = [];

  constructor(private readonly phoneRepository: PhoneRepository) {}

  getPayFastConfig(): { merchantId: string; merchantKey: string; passphrase?: string; sandbox: boolean } {
    return {
      merchantId: process.env.PAYFAST_MERCHANT_ID || '',
      merchantKey: process.env.PAYFAST_MERCHANT_KEY || '',
      passphrase: process.env.PAYFAST_PASSPHRASE,
      sandbox: process.env.PAYFAST_SANDBOX === 'true' || false,
    };
  }

  buildPaymentRequest(dto: CheckoutRequest): { payment: PayFastPayment; action: string; orderId: string } {
    const phones = this.phoneRepository.findByIds(dto.items.map((i) => i.phoneId));
    const phoneMap = new Map(phones.map((p) => [p.id, p]));

    let total = 0;
    const orderItems: { phone: Phone; quantity: number }[] = [];

    for (const item of dto.items) {
      const phone = phoneMap.get(item.phoneId);
      if (!phone) throw new Error(`Phone not found: ${item.phoneId}`);
      if (item.quantity > phone.stock) throw new Error(`Not enough stock for ${phone.name}`);
      total += phone.price * item.quantity;
      orderItems.push({ phone, quantity: item.quantity });
    }

    const orderId = `ORDER-${Date.now()}`;
    const { merchantId, merchantKey, passphrase, sandbox } = this.getPayFastConfig();

    const [firstName = '', lastName = ''] = (dto.name || '').split(' ').filter(Boolean);
    const itemName = orderItems.length === 1
      ? orderItems[0].phone.name
      : `${orderItems[0].phone.name} + ${orderItems.length - 1} more`;
    const itemDescription = orderItems.map((i) => `${i.quantity} x ${i.phone.name}`).join(', ');

    const base: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: dto.returnUrl,
      cancel_url: dto.cancelUrl,
      notify_url: dto.notifyUrl,
      name_first: firstName,
      name_last: lastName,
      email_address: dto.email,
      m_payment_id: orderId,
      amount: total.toFixed(2),
      item_name: itemName,
      item_description: itemDescription,
    };

    const orderedKeys = Object.keys(base);
    let getString = '';
    for (const key of orderedKeys) {
      const value = base[key] ?? '';
      if (value !== '') {
        getString += `${key}=${this.urlEncode(value)}&`;
      }
    }
    getString = getString.slice(0, -1);

    if (passphrase) {
      getString += `&passphrase=${this.urlEncode(passphrase)}`;
    }

    const signature = crypto.createHash('md5').update(getString).digest('hex').toLowerCase();
    const payment: PayFastPayment = { ...base, signature } as unknown as PayFastPayment;

    this.orders.push({ id: orderId, status: 'pending', amount: total, items: dto.items });

    return {
      payment,
      orderId,
      action: sandbox ? 'https://sandbox.payfast.co.za/eng/process' : 'https://www.payfast.co.za/eng/process',
    };
  }

  verifyItn(payload: Record<string, string | number>): { valid: boolean; orderId?: string; status?: string } {
    const receivedSignature = String(payload.signature || '');
    const { passphrase, merchantId } = this.getPayFastConfig();

    const data: Record<string, string> = {};
    for (const [key, value] of Object.entries(payload)) {
      if (key !== 'signature' && value !== undefined && value !== '') {
        data[key] = String(value);
      }
    }

    const orderedKeys = Object.keys(data).sort();
    let getString = '';
    for (const key of orderedKeys) {
      getString += `${key}=${this.urlEncode(data[key])}&`;
    }
    getString = getString.slice(0, -1);
    if (passphrase) {
      getString += `&passphrase=${this.urlEncode(passphrase)}`;
    }

    const expected = crypto.createHash('md5').update(getString).digest('hex').toLowerCase();
    if (receivedSignature.toLowerCase() !== expected) {
      return { valid: false };
    }

    const pfPaymentId = String(payload.pf_payment_id || '');
    const orderId = String(payload.m_payment_id || '');
    const paymentStatus = String(payload.payment_status || '');
    const amount = parseFloat(String(payload.amount_gross || '0'));

    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return { valid: false };
    if (merchantId && String(payload.merchant_id) !== merchantId) return { valid: false };
    if (Math.abs(order.amount - amount) > 0.01) return { valid: false };

    order.paymentStatus = paymentStatus;
    if (paymentStatus === 'COMPLETE') {
      order.status = 'paid';
      // Decrement stock
      for (const item of order.items) {
        const phone = this.phoneRepository.findById(item.phoneId);
        if (phone) phone.stock -= item.quantity;
      }
    }

    return { valid: true, orderId, status: paymentStatus };
  }

  private urlEncode(value: string): string {
    // Mimic PHP's urlencode() (used by PayFast's backend to validate the
    // signature), which percent-encodes !*'() while JS's encodeURIComponent
    // leaves them unescaped. Mismatched encoding here causes PayFast's
    // "Generated signature does not match submitted signature" error for
    // any field containing these characters (e.g. item names with brackets).
    return encodeURIComponent(value)
      .replace(/%20/g, '+')
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A');
  }
}
