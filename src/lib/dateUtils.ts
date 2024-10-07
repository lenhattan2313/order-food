import { formatDate } from 'date-fns';

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return formatDate(
    date instanceof Date ? date : new Date(date),
    'HH:mm:ss dd/MM/yyyy',
  );
};

export const formatDateTimeToTimeString = (date: string | Date) => {
  return formatDate(date instanceof Date ? date : new Date(date), 'HH:mm:ss');
};
