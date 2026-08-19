# EmailJS Setup Guide

This project uses EmailJS to send enquiries from the homepage package signup form and the shop product enquiry form directly to `sales@panafricatelecom.co.za`.

## Setup Steps

### 1. Create an EmailJS Account
- Go to [emailjs.com](https://www.emailjs.com/)
- Sign up for a free account
- Verify your email

### 2. Create an Email Service
- In the EmailJS dashboard, go to **Email Services**
- Click **Create New Service**
- Select your email provider (Gmail, Outlook, etc.) or use EmailJS's SMTP service
- For Gmail:
  - Use your Gmail address
  - Generate an [App Password](https://myaccount.google.com/apppasswords)
  - Use the app password instead of your regular password
- Name the service: `service_panafricatelecom`
- Save the service

### 3. Create an Email Template
- Go to **Email Templates**
- Click **Create New Template**
- Set the template name to: `template_enquiry`
- Configure the template with the following variables:
  - `{{to_email}}` - Recipient email (sales@panafricatelecom.co.za)
  - `{{from_name}}` - Sender's full name
  - `{{from_email}}` - Sender's email address
  - `{{phone}}` - Sender's phone number
  - `{{location}}` - Sender's location
  - `{{service_interest}}` - Service or product of interest
  - `{{message}}` - Additional message/details

**Example template HTML:**
```html
<h2>New Enquiry from {{from_name}}</h2>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Phone:</strong> {{phone}}</p>
<p><strong>Location:</strong> {{location}}</p>
<p><strong>Service Interest:</strong> {{service_interest}}</p>
<p><strong>Message:</strong></p>
<p>{{message}}</p>
```

- Set the recipient email to: `sales@panafricatelecom.co.za`
- Save the template

### 4. Get Your Public Key
- Go to **Account** → **API Keys**
- Copy your **Public Key**
- Update `frontend/src/lib/emailjs.ts`:
  ```typescript
  const PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';
  ```
  Replace `YOUR_EMAILJS_PUBLIC_KEY` with your actual public key

### 5. Install Dependencies
```bash
cd frontend
npm install
```

## Testing

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Test the homepage package signup form:
   - Navigate to the home page
   - Click "Sign up" on any package
   - Fill in the form and submit
   - You should receive an email at `sales@panafricatelecom.co.za`

3. Test the shop product enquiry form:
   - Navigate to the shop page
   - Find an out-of-stock product
   - Click "Email for enquiries"
   - Fill in the form and submit
   - You should receive an email at `sales@panafricatelecom.co.za`

## Troubleshooting

- **"Cannot find module 'emailjs-com'"**: Run `npm install` in the frontend directory
- **Emails not sending**: Check that your service ID, template ID, and public key are correct in `emailjs.ts`
- **Emails going to spam**: Configure SPF, DKIM, and DMARC records for your domain
- **Rate limiting**: EmailJS has rate limits on free plans (200 emails/month). Upgrade if needed.

## Security Notes

- The public key is safe to expose in frontend code (it's meant to be public)
- Never expose your private key or API secret in frontend code
- EmailJS handles all backend email sending securely
