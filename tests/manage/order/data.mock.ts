export const dishesData = {
  data: [
    {
      id: 9,
      name: 'Phở ',
      price: 40000,
      description:
        'Phở là món ăn truyền thống của Việt Nam, gồm bánh phở, nước dùng thơm ngon, thịt bò hoặc gà và rau thơm.',
      image:
        'http://localhost:4000/static/a8b598a83ff84045a02dc0b93291d52f.jpeg',
      status: 'Available',
      createdAt: '2024-10-01T08:27:33.986Z',
      updatedAt: '2024-10-05T08:50:25.322Z',
      isUploadS3: false,
    },
    {
      id: 7,
      name: 'Bò Lúc lắc',
      price: 50000,
      description:
        'Bò lúc lắc là món ăn Việt Nam gồm thịt bò cắt miếng vuông, xào nhanh với hành tây, ớt chuông và sốt đặc trưng.',
      image:
        'http://localhost:4000/static/efc05c652f4c4376ac9a925c0a1f108c.jpeg',
      status: 'Available',
      createdAt: '2024-09-09T08:02:50.392Z',
      updatedAt: '2024-10-05T08:52:02.974Z',
      isUploadS3: false,
    },
    {
      id: 6,
      name: 'Hamburger',
      price: 35000,
      description:
        'Hamburger là món ăn gồm bánh mì kẹp thịt bò xay, phô mai, rau xà lách, cà chua, dưa leo muối và sốt, thường ăn kèm khoai tây chiên.',
      image:
        'http://localhost:4000/static/6d05d144f70f4eadbd3a89428645e346.png',
      status: 'Unavailable',
      createdAt: '2024-06-26T04:31:09.710Z',
      updatedAt: '2024-10-05T08:52:34.630Z',
      isUploadS3: false,
    },
    {
      id: 2,
      name: 'Spaghetti',
      price: 50000,
      description:
        'Spaghetti là món mì Ý sợi dài, thường ăn kèm sốt cà chua, thịt băm, phô mai Parmesan và các loại thảo mộc như húng quế.',
      image:
        'http://localhost:4000/static/e0001b7e08604e0dbabf0d8f95e6174a.jpg',
      status: 'Available',
      createdAt: '2024-06-01T03:50:26.434Z',
      updatedAt: '2024-10-05T08:52:54.297Z',
      isUploadS3: false,
    },
    {
      id: 1,
      name: 'Beef steak',
      price: 100000,
      description:
        'Bò bít tết là món thịt bò áp chảo hoặc nướng, thường dùng miếng thịt nguyên, ăn kèm khoai tây, rau củ và sốt tiêu.',
      image:
        'http://localhost:4000/static/4f2867ef88214b4b961e72cf05e093b4.jpg',
      status: 'Available',
      createdAt: '2024-06-01T03:45:43.148Z',
      updatedAt: '2024-10-05T08:53:26.472Z',
      isUploadS3: false,
    },
  ],
  message: 'Lấy danh sách món ăn thành công!',
};
export const orderData = {
  message: 'Lấy danh sách đơn hàng thành công',
  data: [
    {
      id: 93,
      guestId: 123,
      guest: {
        id: 123,
        name: 'Tan',
        tableNumber: 3,
        createdAt: '2024-10-12T04:58:25.864Z',
        updatedAt: '2024-10-12T04:58:25.864Z',
      },
      tableNumber: 3,
      dishSnapshotId: 105,
      dishSnapshot: {
        id: 105,
        name: 'Phở ',
        price: 40000,
        image:
          'http://localhost:4000/static/a8b598a83ff84045a02dc0b93291d52f.jpeg',
        description:
          'Phở là món ăn truyền thống của Việt Nam, gồm bánh phở, nước dùng thơm ngon, thịt bò hoặc gà và rau thơm.',
        status: 'Available',
        dishId: 9,
        createdAt: '2024-10-12T04:58:25.885Z',
        updatedAt: '2024-10-12T04:58:25.885Z',
      },
      quantity: 1,
      orderHandlerId: 1,
      orderHandler: {
        id: 1,
        name: 'Tan Le',
        email: 'admin@order.com',
        role: 'Owner',
        avatar: null,
      },
      status: 'Rejected',
      createdAt: '2024-10-12T04:58:25.885Z',
      updatedAt: '2024-10-12T09:53:52.535Z',
    },
  ],
};
export const tableData = {
  data: [
    {
      number: 3,
      capacity: 3,
      status: 'Available',
      token: 'd4f52870d49348acbae109476062de89',
      createdAt: '2024-09-09T10:30:53.939Z',
      updatedAt: '2024-09-09T10:44:14.265Z',
    },
    {
      number: 2,
      capacity: 10,
      status: 'Reserved',
      token: '667f3b1ce5e4429990dacea1809d20e7',
      createdAt: '2024-06-21T06:52:26.847Z',
      updatedAt: '2024-07-03T04:36:51.130Z',
    },
    {
      number: 1,
      capacity: 4,
      status: 'Hidden',
      token: 'f629ea1f1da84a68b4835a2cf56ddf50',
      createdAt: '2024-06-19T09:43:34.786Z',
      updatedAt: '2024-06-19T09:47:06.395Z',
    },
  ],
  message: 'Lấy danh sách bàn thành công!',
};
