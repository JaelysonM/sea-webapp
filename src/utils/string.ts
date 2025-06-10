import moment from 'moment';

import 'moment/locale/pt';

export function capitalize(str: string): string {
  if (!str) return str;
  return str.toLowerCase().replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function convertHexColorToRGBA(hex: string, alpha = 1): string {
  const [r, g, b] = hex.match(/\w\w/g)!.map((x) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
}

export function pad(value: string, times: number, character: string): string {
  let s = value + '';
  while (s.length < times) {
    s = character + s;
  }
  return s;
}

export function formatIdentificationNumber(value: string) {
  return format(pad(value, 8, '0'), '####.####');
}

export function format(value: string, pattern: string) {
  let i = 0;
  const v = value.toString();
  return pattern.replace(/#/g, () => v[i++]);
}

export function appendDots(value: string, maxLength: number): string {
  return value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
}

// Padding zero to a number
export function zeroPad(value: number, length: number): string {
  return pad(value.toString(), length, '0');
}

export function formatDate(inputDate: string) {
  const date = new Date(inputDate);
  const brazilianPattern = new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  if (isValidDate(date)) {
    const formattedDate = brazilianPattern.format(date);

    return formattedDate;
  }
}

export function formatResolutionString(width?: number, height?: number) {
  return `${width} x ${height} px`;
}

export function formatNumbertToTime(durationInSeconds: number) {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

export function readDate(date?: Date) {
  const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSST';

  return moment(date, DATE_FORMAT).utcOffset(-3).add(4, 'hour');
}

export function isValidDate(dateObject: string | Date) {
  return new Date(dateObject).toString() !== 'Invalid Date';
}

export function reverseString(dateString: string) {
  // Split the date string by '/'
  const parts = dateString.split('/');
  // Reverse the array and join with '/'
  return parts.reverse().join('/');
}

export function formatContractName(contract: {
  id: number;
  nome: string;
  data_inicio?: Date;
  data_fim?: Date;
}) {
  return `${contract.id} - ${contract.nome} | ${reverseString(
    (contract.data_inicio as unknown as string).replace(/-/g, '/'),
  )} - ${reverseString((contract.data_fim as unknown as string).replace(/-/g, '/'))}`;
}

export function capitalizeText(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function extractPrettierDateHour(date: string) {
  return moment(date).format('DD/MM/YYYY HH:mm:ss');
}
