# ShopVN - Website Bán Hàng Full-Stack E-commerce

Website bán hàng trực tuyến hiện đại với đầy đủ tính năng: thanh toán ví điện tử, nạp thẻ điện thoại, quản lý đơn hàng, và admin dashboard.

## 🚀 Tính năng

### Người dùng
- ✅ Đăng ký/Đăng nhập với JWT Authentication
- ✅ Xem danh sách sản phẩm với phân trang và tìm kiếm
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Quản lý giỏ hàng (thêm, sửa, xóa)
- ✅ Đặt hàng với nhiều phương thức thanh toán
- ✅ Ví điện tử tích hợp
- ✅ Nạp tiền vào ví
- ✅ Nạp thẻ điện thoại (Viettel, Vinaphone, Mobifone)
- ✅ Xem lịch sử đơn hàng và giao dịch
- ✅ Quản lý thông tin cá nhân

### Admin
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý đơn hàng
- ✅ Quản lý người dùng
- ✅ Xem thống kê doanh thu
- ✅ Admin dashboard

## 🛠 Công nghệ sử dụng

- **Next.js 14+** - React Framework với App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Docker** - Containerization

## 📦 Cài đặt

### Yêu cầu
- Node.js 20+
- PostgreSQL 14+
- npm

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Cấu hình môi trường
Sao chép file `.env.example` thành `.env`:
```bash
cp .env.example .env
```

### Bước 3: Setup database
```bash
npm run db:generate
npm run db:migrate
```

### Bước 4: Chạy development server
```bash
npm run dev
```

Website: http://localhost:3000

## 🐳 Chạy với Docker

```bash
docker-compose up -d
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin user

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `POST /api/products` - Tạo sản phẩm (Admin)
- `PUT /api/products/[id]` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/[id]` - Xóa sản phẩm (Admin)

### Cart & Orders
- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart` - Thêm vào giỏ hàng
- `GET /api/orders` - Lấy đơn hàng
- `POST /api/orders` - Tạo đơn hàng

### Wallet
- `GET /api/wallet` - Thông tin ví
- `POST /api/wallet` - Nạp tiền
- `POST /api/wallet/topup-card` - Nạp thẻ
