import emailjs from 'emailjs-com';

const SERVICE_ID = 'service_bckjom5';
const TEMPLATE_ID = 'service_bckjom5';
const PUBLIC_KEY = 'GWQ7ImOwiHaXqSFDG';

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

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
  } catch (error: any) {
    console.error('EmailJS Error:', error);
    throw new Error(error.text || error.message || 'Failed to send email');
  }
}
