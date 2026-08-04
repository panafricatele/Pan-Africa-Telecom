import { Controller, Post, Body, Res, HttpStatus, Headers, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { CheckoutService } from './checkout.service';
import { CheckoutDto } from './dto/checkout.dto';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('payfast')
  createPayment(@Body() dto: CheckoutDto) {
    try {
      const { payment, action, orderId } = this.checkoutService.buildPaymentRequest({
        items: dto.items,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        returnUrl: dto.returnUrl,
        cancelUrl: dto.cancelUrl,
        notifyUrl: dto.notifyUrl,
        sandbox: dto.sandbox,
      });

      return {
        orderId,
        action,
        payment,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Checkout failed';
      throw new BadRequestException(message);
    }
  }

  @Post('notify')
  async handleNotify(
    @Body() payload: Record<string, string | number>,
    @Res() res: Response,
    @Headers() headers: Record<string, string>,
  ) {
    // Optional: verify source IP. For now rely on signature.
    const result = this.checkoutService.verifyItn(payload);
    if (!result.valid) {
      return res.status(HttpStatus.BAD_REQUEST).send('Invalid signature');
    }
    if (result.status === 'COMPLETE') {
      // Payment completed. Persisted in service.
    }
    return res.status(HttpStatus.OK).send('OK');
  }
}
