import emailjs from 'emailjs-com';

const SERVICE_ID = 'service_panafricatelecom';
const TEMPLATE_ID = 'template_enquiry';
const PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';

emailjs.init(PUBLIC_KEY);

export interface EnquiryData {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  serviceInterest: string;
  message?: string;
}

export async function sendEnquiry(data: EnquiryData): Promise<void> {
  const templateParams = {
    to_email: 'sales@panafricatelecom.co.za',
    from_name: data.fullName,
    from_email: data.email,
    phone: data.phone || 'Not provided',
    location: data.location || 'Not provided',
    service_interest: data.serviceInterest,
    message: data.message || 'No additional details',
  };

  await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
}
