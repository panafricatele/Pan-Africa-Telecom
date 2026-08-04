export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: value < 1 ? 3 : 0,
  }).format(value);
}

export function pad(num: number): string {
  return num.toString().padStart(2, '0');
}
