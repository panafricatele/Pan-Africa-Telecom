export const COMPANY = {
  name: 'Pan Africa Telecom',
  slogan: 'Connecting the Unserved & Underserved of Sub-Saharan Africa',
  address: '26 Marconi Drive, Riverside Industrial, Newcastle, 2940, South Africa',
  phone: '034-0085055',
  whatsapp: '0871525695',
  email: 'info@PanAfricaTelecom.co.za',
  portalUrl: 'https://portal.panafricatelecom.co.za',
  icasaLicense: 'ICASA License No: 2411/CECNS/CECN/FEB/2023 | AS: 329467',
  policies: {
    terms: 'https://www.panafricatelecom.co.za/wp-content/uploads/2023/07/General-Terms-Conditions_PAT_FIN-Published.pdf',
    privacy: 'https://www.panafricatelecom.co.za/wp-content/uploads/2023/06/Pan-Africa-Telecom-Pty-Ltd-Privacy-Policy-June-20233-1.pdf',
    wapaCoC: 'https://www.panafricatelecom.co.za/wp-content/uploads/2023/05/WAPA_CodeofConduct_Version4-1_140402.pdf',
    codeOfConduct: 'https://www.panafricatelecom.co.za/wp-content/uploads/2026/05/PAN20004-20260226-pan-africa-code-of-conduct.pdf',
  },
  social: {
    facebook: 'https://www.facebook.com/PanAfricaTelecom/',
    linkedin: 'https://za.linkedin.com/company/panafricatelecom',
    youtube: 'https://www.youtube.com/@PanAfricaTelecom',
  },
} as const;

export const WHATSAPP_LINK = `https://wa.me/27${COMPANY.whatsapp.replace(/^0/, '')}`;
