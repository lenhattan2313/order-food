import GuestLoginForm from '@/app/guest/tables/[number]/GuestLoginForm';
import Image from 'next/image';

export default function TableNumberPage() {
  return (
    <div className="flex justify-center items-center flex-col m-4">
      <div className="w-full h-full flex justify-center">
        <Image
          src="/logo.png"
          alt="Logo tanrest"
          width={200}
          height={200}
          quality={80}
          className="object-cover"
        />
      </div>
      <h6 className="text-xl mb-2 text-center max-w-[300px]">
        NHÀ HÀNG <span className="font-bold">&ldquo;TANREST&ldquo;</span>
      </h6>
      <h5 className="text-lg mb-4"> Xin chào quý khách.</h5>
      <GuestLoginForm />
    </div>
  );
}
