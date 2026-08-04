export const COMPANY = {
  name: 'Pan Africa Telecom',
  slogan: 'Connecting the Unserved & Underserved of Sub-Saharan Africa',
  address: '26 Marconi Drive, Riverside Industrial, Newcastle, 2940, South Africa',
  phone: '034-0085055',
  whatsapp: '0871525695',
  email: 'info@PanAfricaTelecom.co.za',
  portalUrl: 'https://portal.panafricatelecom.co.za',
  icasaLicense: 'ICASA License No: 2411/CECNS/CECN/FEB/2023 | AS: 328583',
  wapaCoC: 'https://www.panafricatelecom.co.za/wp-content/uploads/2023/05/WAPA_CodeofConduct_Version4-1_140402.pdf',
  social: {
    facebook: 'https://www.facebook.com/PanAfricaTelecom/',
    linkedin: 'https://za.linkedin.com/company/panafricatelecom',
    youtube: 'https://www.youtube.com/@PanAfricaTelecom',
  },
} as const;

export const WHATSAPP_LINK = `https://wa.me/27${COMPANY.whatsapp.replace(/^0/, '')}`;
