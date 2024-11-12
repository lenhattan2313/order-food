import envConfig from '@/config';
import { TableStatus } from '@/constants/type';

export const getVietnameseTableStatus = (
  status: (typeof TableStatus)[keyof typeof TableStatus],
) => {
  switch (status) {
    case TableStatus.Available:
      return 'Có sẵn';
    case TableStatus.Reserved:
      return 'Đã đặt';
    default:
      return 'Ẩn';
  }
};

export const getTableLink = ({
  token,
  tableNumber,
}: {
  token: string;
  tableNumber: number;
}) => {
  return (
    envConfig.NEXT_PUBLIC_BASE_URL +
    `/guest/tables/` +
    tableNumber +
    '?token=' +
    token
  );
};
