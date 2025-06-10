const sequence = '1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik9ol0p1QAZ2WSX3EDC4RFV5TGB6YHN7UJM8IK9OL0P';

export const randomKey = (length: number) => {
  let key = '';

  for (let i = 0; i < length; ++i) {
    key += sequence.charAt(Math.random() * sequence.length);
  }

  return key;
};

export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const createArrayFrom1ToN = (n: number) => {
  return Array.from({ length: n }, (_, i) => i + 1);
};

export const isNil = (value: unknown) => value === null || value === undefined;
export const isNotNil = (value: unknown) => value !== null && value !== undefined;

export const splitValueUnit = (value: number | string, defaultUnit = 'px') => {
  switch (typeof value) {
    case 'number':
      return { value, unit: defaultUnit, join: `${value}${defaultUnit}` };

    case 'string': {
      const unit = value.replace(/[0-9.]/g, '') || defaultUnit;
      value = Number(value.replace(/[^0-9.]/g, ''));

      return { value, unit, join: `${value}${unit}` };
    }

    default:
      break;
  }

  throw new Error(`invalid input: ${value}`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const call = (func?: (...args: any[]) => any, ...args: any[]) => {
  if (typeof func === 'function') {
    return func(...args);
  }
};

export const array2Object = (array?: object[]) => {
  const obj: { [key: number]: object } = {};

  if (array) {
    for (let i = 0; i < array.length; ++i) {
      if (!isNil(array[i])) {
        obj[i] = array[i];
      }
    }
  }

  return obj;
};
export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

export const toString = (val: unknown) => (typeof val === 'string' ? val : String(val));

export function zipCodeMask(value: string) {
  if (!value) return '';
  value = value.replace(/\D/g, '');
  value = value.replace(/(\d{5})(\d)/, '$1-$2');
  return value;
}

export async function downloadFileFromURL(url: string) {
  const data = await fetch(url);
  const blob = await data.blob();
  const formattedUrl = url.split('?')[0];
  const extension = formattedUrl.split('.').slice(-1)[0];

  const finalFileName = `file.${extension}`;

  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', objectUrl);
  link.setAttribute('download', finalFileName);
  link.style.display = 'none';

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
}

export const getCompleteDaysBetweenDates = (startDate: Date, endDate: Date) => {
  return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
};
