export const round = (value: number, precision: number = 0) => {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

export const removeLeadingQuotationMarks = (str: string): string =>
  str.startsWith('"') ? str.slice(1) : str;

export const removeTrailingQuotationMarks = (str: string): string =>
  str.endsWith('"') ? str.slice(0, -1) : str;

export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
