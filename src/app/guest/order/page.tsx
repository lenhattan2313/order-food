import Order from '@/app/guest/order/components/OrderGuest';

export default async function OrderPage() {
  return (
    <div className="max-w-[400px] mx-auto space-y-4">
      <h1 className="text-center text-xl font-bold">Order List</h1>
      <Order />
    </div>
  );
}
