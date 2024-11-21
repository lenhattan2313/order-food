'use client';
import { ServiceDrawer } from '@/app/guest/home/component/ServiceDrawer';
import { Input } from '@/components/_client/Form/Input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Phone, Star } from 'lucide-react';
import { useState } from 'react';
export const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [phone, setPhone] = useState('');
  return (
    <ServiceDrawer
      icon={MessageSquare}
      title="Trải nghiệm của bạn hôm nay thế nào?"
      buttonText="Gửi đánh giá"
      buttonColor="bg-green-500"
    >
      <div className="">
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className={`w-8 h-8 cursor-pointer ${value <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              onClick={() => setRating(value)}
            />
          ))}
        </div>
        <p className="mb-2">Bạn có điều gì chưa hài lòng phải không?</p>
        <Textarea
          placeholder="Chia sẻ cho nhà hàng trải nghiệm của bạn nhé"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="mb-4 placeholder:text-sm"
        />
        <p className="mb-2 text-sm text-gray-600">
          Nhà hàng rất trân trọng và mong muốn phản hồi lại đánh giá trên, bạn
          vui lòng để lại số điện thoại nhé
        </p>
        <div className="flex items-center gap-2">
          <Input
            icon={Phone}
            placeholder="Số điện thoại của bạn"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="number"
            pattern="\d*"
          />
        </div>
      </div>
    </ServiceDrawer>
  );
};
