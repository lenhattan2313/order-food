export const Greeting = () => {
  const currentHour = new Date().getHours(); // Get the current hour (0-23)
  let greeting;
  if (currentHour < 12) {
    greeting = '🌤️ Chào buổi sáng';
  } else if (currentHour < 18) {
    greeting = '🌖 Chào buổi chiều';
  } else {
    greeting = '🌙 Chào buổi tối';
  }
  //TODO: Create get and update info guest
  return (
    <>
      <p className="text-md text-center mt-2">
        {greeting} <span className="font-bold text-sky-400">Tan</span>
      </p>
      <p className="text-sm text-center">
        Chúng tôi sẽ trả đồ ăn cho bạn tại bàn:{' '}
        <span className="border py-1 px-2 rounded-full border-black dark:border-white">
          24
        </span>
      </p>
    </>
  );
};
