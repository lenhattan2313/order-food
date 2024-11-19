import { Button } from '@/components/ui/button';
import { MessageSquare, Receipt, User2, Utensils } from 'lucide-react';

export const Service = () => {
  return (
    <div className="p-4 max-w-md mx-auto grid gap-4">
      <div className="grid grid-cols-3 gap-4">
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-2 h-auto p-4 hover:bg-orange-100 dark:hover:text-black"
        >
          <div className="w-12 h-12 bg-orange-400 rounded-xl flex items-center justify-center">
            <Receipt className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-medium text-center ">
            Gọi thanh toán
          </span>
        </Button>

        <Button
          variant="ghost"
          className="flex flex-col items-center gap-2 h-auto p-4 hover:bg-blue-100 dark:hover:text-black"
        >
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <User2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-medium text-center">Gọi nhân viên</span>
        </Button>

        <Button
          variant="ghost"
          className="flex flex-col items-center gap-2 h-auto p-4 hover:bg-green-100 dark:hover:text-black"
        >
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-medium text-center">Đánh giá</span>
        </Button>
      </div>

      <Button
        variant="ghost"
        className="flex items-center gap-4 bg-red-500 hover:bg-red-600 text-white h-auto p-6 rounded-xl"
      >
        <div className="w-12 h-12 flex items-center justify-center">
          <Utensils className="w-8 h-8" />
        </div>
        <span className="text-lg font-medium">Xem Menu - Gọi món</span>
      </Button>
    </div>
  );
};
