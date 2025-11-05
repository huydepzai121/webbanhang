import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Bắt đầu seed database...')

  // Tạo admin user
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@shopvn.com' },
  })

  if (!adminExists) {
    const hashedPassword = await hashPassword('admin123')
    await prisma.user.create({
      data: {
        email: 'admin@shopvn.com',
        name: 'Admin ShopVN',
        password: hashedPassword,
        role: 'ADMIN',
        phone: '0123456789',
        address: 'Hà Nội, Việt Nam',
        wallet: {
          create: {
            balance: 10000000,
          },
        },
        cart: {
          create: {},
        },
      },
    })
    console.log('✅ Đã tạo admin user')
  }

  // Tạo demo user
  const userExists = await prisma.user.findUnique({
    where: { email: 'user@shopvn.com' },
  })

  if (!userExists) {
    const hashedPassword = await hashPassword('user123')
    await prisma.user.create({
      data: {
        email: 'user@shopvn.com',
        name: 'Nguyễn Văn A',
        password: hashedPassword,
        role: 'USER',
        phone: '0987654321',
        address: 'TP. Hồ Chí Minh, Việt Nam',
        wallet: {
          create: {
            balance: 1000000,
          },
        },
        cart: {
          create: {},
        },
      },
    })
    console.log('✅ Đã tạo demo user')
  }

  // Tạo categories
  const categories = [
    {
      name: 'Điện thoại & Tablet',
      slug: 'dien-thoai-tablet',
      description: 'Điện thoại di động, máy tính bảng các hãng',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    },
    {
      name: 'Laptop & Máy tính',
      slug: 'laptop-may-tinh',
      description: 'Laptop, PC, linh kiện máy tính',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
    },
    {
      name: 'Âm thanh & Phụ kiện',
      slug: 'am-thanh-phu-kien',
      description: 'Tai nghe, loa, phụ kiện công nghệ',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    },
    {
      name: 'Đồng hồ thông minh',
      slug: 'dong-ho-thong-minh',
      description: 'Smartwatch, vòng đeo tay thông minh',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    },
    {
      name: 'Nhà thông minh',
      slug: 'nha-thong-minh',
      description: 'Thiết bị IoT, smarthome',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800',
    },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }
  console.log('✅ Đã tạo 5 categories')

  // Lấy categories để tạo products
  const createdCategories = await prisma.category.findMany()

  // Tạo 50 sản phẩm mẫu
  const products = [
    // Điện thoại (15 sản phẩm)
    {
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      description: 'iPhone 15 Pro Max 256GB - Titan xanh, chip A17 Pro, camera 48MP',
      price: 34990000,
      salePrice: 32990000,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1678652197950-d4938bc0f4c2?w=800'],
      featured: true,
      categoryId: createdCategories[0].id,
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'Galaxy S24 Ultra 512GB - Tím, chip Snapdragon 8 Gen 3, camera 200MP',
      price: 31990000,
      salePrice: 29990000,
      stock: 45,
      images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'],
      featured: true,
      categoryId: createdCategories[0].id,
    },
    {
      name: 'Xiaomi 14 Ultra',
      slug: 'xiaomi-14-ultra',
      description: 'Xiaomi 14 Ultra 16GB/512GB - Đen, camera Leica, chip Snapdragon 8 Gen 3',
      price: 27990000,
      salePrice: 25990000,
      stock: 30,
      images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'],
      featured: true,
      categoryId: createdCategories[0].id,
    },
    {
      name: 'iPhone 14 Pro',
      slug: 'iphone-14-pro',
      description: 'iPhone 14 Pro 256GB - Tím, Dynamic Island, camera 48MP',
      price: 27990000,
      salePrice: 24990000,
      stock: 60,
      images: ['https://images.unsplash.com/photo-1663499482523-1c0d2109cfb0?w=800'],
      featured: false,
      categoryId: createdCategories[0].id,
    },
    {
      name: 'OPPO Find X7 Ultra',
      slug: 'oppo-find-x7-ultra',
      description: 'OPPO Find X7 Ultra 16GB/512GB - Camera Hasselblad',
      price: 24990000,
      salePrice: 22990000,
      stock: 25,
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'],
      featured: false,
      categoryId: createdCategories[0].id,
    },
    {
      name: 'Samsung Galaxy Z Fold 5',
      slug: 'samsung-galaxy-z-fold-5',
      description: 'Galaxy Z Fold 5 512GB - Màn hình gập, chip Snapdragon 8 Gen 2',
      price: 40990000,
      salePrice: 37990000,
      stock: 20,
      images: ['https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800'],
      featured: true,
      categoryId: createdCategories[0].id,
    },
    {
      name: 'Google Pixel 8 Pro',
      slug: 'google-pixel-8-pro',
      description: 'Pixel 8 Pro 256GB - AI camera, chip Tensor G3',
      price: 24990000,
      salePrice: null,
      stock: 35,
      images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'],
      featured: false,
      categoryId: createdCategories[0].id,
    },
    {
      name: 'Vivo X100 Pro',
      slug: 'vivo-x100-pro',
      description: 'Vivo X100 Pro - Camera ZEISS, chip Dimensity 9300',
      price: 22990000,
      salePrice: 20990000,
      stock: 28,
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'],
      featured: false,
      categoryId: createdCategories[0].id,
    },
    {
      name: 'OnePlus 12',
      slug: 'oneplus-12',
      description: 'OnePlus 12 16GB/256GB - Camera Hasselblad, sạc nhanh 100W',
      price: 19990000,
      salePrice: 18490000,
      stock: 40,
      images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'],
      featured: false,
      categoryId: createdCategories[0].id,
    },
    {
      name: 'iPhone 13',
      slug: 'iphone-13',
      description: 'iPhone 13 128GB - Hồng, chip A15 Bionic',
      price: 17990000,
      salePrice: 15990000,
      stock: 80,
      images: ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800'],
      featured: false,
      categoryId: createdCategories[0].id,
    },
    {
      name: 'Samsung Galaxy A54',
      slug: 'samsung-galaxy-a54',
      description: 'Galaxy A54 8GB/256GB - Màn hình Super AMOLED 120Hz',
      price: 10990000,
      salePrice: 9990000,
      stock: 100,
      images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'],
      featured: false,
      categoryId: createdCategories[0].id,
    },
    {
      name: 'Xiaomi Redmi Note 13 Pro',
      slug: 'xiaomi-redmi-note-13-pro',
      description: 'Redmi Note 13 Pro 8GB/256GB - Camera 200MP',
      price: 7990000,
      salePrice: 6990000,
      stock: 150,
      images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'],
      featured: false,
      categoryId: createdCategories[0].id,
    },
    {
      name: 'iPad Pro M2 11 inch',
      slug: 'ipad-pro-m2-11',
      description: 'iPad Pro M2 11 inch 256GB - Chip M2, màn hình Liquid Retina',
      price: 24990000,
      salePrice: 22990000,
      stock: 35,
      images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'],
      featured: true,
      categoryId: createdCategories[0].id,
    },
    {
      name: 'Samsung Galaxy Tab S9',
      slug: 'samsung-galaxy-tab-s9',
      description: 'Galaxy Tab S9 256GB - Màn hình Dynamic AMOLED 2X',
      price: 19990000,
      salePrice: 17990000,
      stock: 40,
      images: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800'],
      featured: false,
      categoryId: createdCategories[0].id,
    },
    {
      name: 'Xiaomi Pad 6',
      slug: 'xiaomi-pad-6',
      description: 'Xiaomi Pad 6 8GB/256GB - Màn hình 11 inch 144Hz',
      price: 8990000,
      salePrice: 7990000,
      stock: 60,
      images: ['https://images.unsplash.com/photo-1585790050230-5dd28404f8f3?w=800'],
      featured: false,
      categoryId: createdCategories[0].id,
    },

    // Laptop (15 sản phẩm)
    {
      name: 'MacBook Pro 14 M3 Pro',
      slug: 'macbook-pro-14-m3-pro',
      description: 'MacBook Pro 14 inch M3 Pro 18GB/512GB - Xám',
      price: 52990000,
      salePrice: 49990000,
      stock: 25,
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
      featured: true,
      categoryId: createdCategories[1].id,
    },
    {
      name: 'Dell XPS 15',
      slug: 'dell-xps-15',
      description: 'Dell XPS 15 i7-13700H/16GB/512GB - Màn hình 4K OLED',
      price: 45990000,
      salePrice: 42990000,
      stock: 20,
      images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'],
      featured: true,
      categoryId: createdCategories[1].id,
    },
    {
      name: 'ASUS ROG Zephyrus G14',
      slug: 'asus-rog-zephyrus-g14',
      description: 'ROG Zephyrus G14 Ryzen 9/32GB/1TB RTX 4060 - Gaming',
      price: 42990000,
      salePrice: 39990000,
      stock: 18,
      images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'],
      featured: true,
      categoryId: createdCategories[1].id,
    },
    {
      name: 'MacBook Air M2',
      slug: 'macbook-air-m2',
      description: 'MacBook Air M2 8GB/256GB - Xanh, siêu mỏng nhẹ',
      price: 28990000,
      salePrice: 26990000,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800'],
      featured: false,
      categoryId: createdCategories[1].id,
    },
    {
      name: 'Lenovo ThinkPad X1 Carbon',
      slug: 'lenovo-thinkpad-x1-carbon',
      description: 'ThinkPad X1 Carbon i7-1365U/16GB/512GB - Business',
      price: 38990000,
      salePrice: 35990000,
      stock: 30,
      images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'],
      featured: false,
      categoryId: createdCategories[1].id,
    },
    {
      name: 'HP Spectre x360',
      slug: 'hp-spectre-x360',
      description: 'HP Spectre x360 i7/16GB/1TB - 2 in 1, màn hình cảm ứng',
      price: 35990000,
      salePrice: 32990000,
      stock: 22,
      images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'],
      featured: false,
      categoryId: createdCategories[1].id,
    },
    {
      name: 'MSI GE76 Raider',
      slug: 'msi-ge76-raider',
      description: 'MSI GE76 i9/32GB/2TB RTX 4080 - Gaming đỉnh cao',
      price: 65990000,
      salePrice: 62990000,
      stock: 10,
      images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'],
      featured: true,
      categoryId: createdCategories[1].id,
    },
    {
      name: 'Acer Swift X',
      slug: 'acer-swift-x',
      description: 'Acer Swift X Ryzen 7/16GB/512GB RTX 3050 - Mỏng nhẹ',
      price: 22990000,
      salePrice: 19990000,
      stock: 40,
      images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'],
      featured: false,
      categoryId: createdCategories[1].id,
    },
    {
      name: 'LG Gram 17',
      slug: 'lg-gram-17',
      description: 'LG Gram 17 inch i7/16GB/512GB - Siêu nhẹ 1.35kg',
      price: 32990000,
      salePrice: 29990000,
      stock: 25,
      images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'],
      featured: false,
      categoryId: createdCategories[1].id,
    },
    {
      name: 'Razer Blade 15',
      slug: 'razer-blade-15',
      description: 'Razer Blade 15 i7/16GB/1TB RTX 4070 - Gaming premium',
      price: 54990000,
      salePrice: 51990000,
      stock: 15,
      images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'],
      featured: false,
      categoryId: createdCategories[1].id,
    },
    {
      name: 'Microsoft Surface Laptop 5',
      slug: 'microsoft-surface-laptop-5',
      description: 'Surface Laptop 5 i5/16GB/512GB - Cảm ứng',
      price: 27990000,
      salePrice: 25990000,
      stock: 35,
      images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'],
      featured: false,
      categoryId: createdCategories[1].id,
    },
    {
      name: 'ASUS ZenBook 14',
      slug: 'asus-zenbook-14',
      description: 'ASUS ZenBook 14 OLED i7/16GB/512GB - Mỏng nhẹ',
      price: 24990000,
      salePrice: 22990000,
      stock: 45,
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
      featured: false,
      categoryId: createdCategories[1].id,
    },
    {
      name: 'Gigabyte Aero 16',
      slug: 'gigabyte-aero-16',
      description: 'Gigabyte Aero 16 i9/32GB/1TB RTX 4060 - Creator',
      price: 48990000,
      salePrice: 45990000,
      stock: 12,
      images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'],
      featured: false,
      categoryId: createdCategories[1].id,
    },
    {
      name: 'Alienware m15 R7',
      slug: 'alienware-m15-r7',
      description: 'Alienware m15 R7 i7/16GB/1TB RTX 4060 - Gaming',
      price: 44990000,
      salePrice: 41990000,
      stock: 18,
      images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'],
      featured: false,
      categoryId: createdCategories[1].id,
    },
    {
      name: 'Huawei MateBook X Pro',
      slug: 'huawei-matebook-x-pro',
      description: 'MateBook X Pro i7/16GB/1TB - Màn hình cảm ứng 3K',
      price: 33990000,
      salePrice: 30990000,
      stock: 20,
      images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'],
      featured: false,
      categoryId: createdCategories[1].id,
    },

    // Âm thanh & Phụ kiện (10 sản phẩm)
    {
      name: 'AirPods Pro 2',
      slug: 'airpods-pro-2',
      description: 'AirPods Pro thế hệ 2 - Chống ồn chủ động, USB-C',
      price: 6490000,
      salePrice: 5990000,
      stock: 100,
      images: ['https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800'],
      featured: true,
      categoryId: createdCategories[2].id,
    },
    {
      name: 'Sony WH-1000XM5',
      slug: 'sony-wh-1000xm5',
      description: 'Sony WH-1000XM5 - Tai nghe chống ồn tốt nhất',
      price: 8990000,
      salePrice: 7990000,
      stock: 60,
      images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800'],
      featured: true,
      categoryId: createdCategories[2].id,
    },
    {
      name: 'JBL Flip 6',
      slug: 'jbl-flip-6',
      description: 'Loa bluetooth JBL Flip 6 - Chống nước IP67',
      price: 2990000,
      salePrice: 2490000,
      stock: 80,
      images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'],
      featured: false,
      categoryId: createdCategories[2].id,
    },
    {
      name: 'Samsung Galaxy Buds2 Pro',
      slug: 'samsung-galaxy-buds2-pro',
      description: 'Galaxy Buds2 Pro - Chống ồn 360 Audio',
      price: 4490000,
      salePrice: 3990000,
      stock: 90,
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800'],
      featured: false,
      categoryId: createdCategories[2].id,
    },
    {
      name: 'Bose QuietComfort 45',
      slug: 'bose-quietcomfort-45',
      description: 'Bose QC45 - Tai nghe chống ồn cao cấp',
      price: 7990000,
      salePrice: 6990000,
      stock: 40,
      images: ['https://images.unsplash.com/photo-1545127398-14699f92334b?w=800'],
      featured: false,
      categoryId: createdCategories[2].id,
    },
    {
      name: 'Anker PowerCore 20000mAh',
      slug: 'anker-powercore-20000',
      description: 'Pin sạc dự phòng Anker 20000mAh - Sạc nhanh PD',
      price: 1290000,
      salePrice: 990000,
      stock: 200,
      images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800'],
      featured: false,
      categoryId: createdCategories[2].id,
    },
    {
      name: 'Logitech MX Master 3S',
      slug: 'logitech-mx-master-3s',
      description: 'Chuột không dây Logitech MX Master 3S - Cho dân văn phòng',
      price: 2490000,
      salePrice: 2190000,
      stock: 70,
      images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=800'],
      featured: false,
      categoryId: createdCategories[2].id,
    },
    {
      name: 'Keychron K8 Pro',
      slug: 'keychron-k8-pro',
      description: 'Bàn phím cơ Keychron K8 Pro - RGB, Hot-swap',
      price: 2990000,
      salePrice: 2690000,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?w=800'],
      featured: false,
      categoryId: createdCategories[2].id,
    },
    {
      name: 'Marshall Emberton II',
      slug: 'marshall-emberton-ii',
      description: 'Loa bluetooth Marshall Emberton II - Âm thanh Rock',
      price: 4990000,
      salePrice: 4490000,
      stock: 35,
      images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'],
      featured: false,
      categoryId: createdCategories[2].id,
    },
    {
      name: 'Belkin 3-in-1 Wireless Charger',
      slug: 'belkin-3in1-charger',
      description: 'Đế sạc không dây Belkin 3-in-1 cho iPhone, AirPods, Apple Watch',
      price: 3490000,
      salePrice: 2990000,
      stock: 45,
      images: ['https://images.unsplash.com/photo-1591290619762-5dd77e671dd0?w=800'],
      featured: false,
      categoryId: createdCategories[2].id,
    },

    // Đồng hồ thông minh (5 sản phẩm)
    {
      name: 'Apple Watch Series 9',
      slug: 'apple-watch-series-9',
      description: 'Apple Watch Series 9 45mm - GPS, màn hình sáng hơn',
      price: 10990000,
      salePrice: 9990000,
      stock: 60,
      images: ['https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800'],
      featured: true,
      categoryId: createdCategories[3].id,
    },
    {
      name: 'Samsung Galaxy Watch 6',
      slug: 'samsung-galaxy-watch-6',
      description: 'Galaxy Watch 6 44mm - Theo dõi sức khỏe toàn diện',
      price: 7990000,
      salePrice: 6990000,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800'],
      featured: true,
      categoryId: createdCategories[3].id,
    },
    {
      name: 'Garmin Fenix 7',
      slug: 'garmin-fenix-7',
      description: 'Garmin Fenix 7 - Đồng hồ thể thao chuyên nghiệp',
      price: 17990000,
      salePrice: 15990000,
      stock: 25,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
      featured: false,
      categoryId: createdCategories[3].id,
    },
    {
      name: 'Xiaomi Watch 2 Pro',
      slug: 'xiaomi-watch-2-pro',
      description: 'Xiaomi Watch 2 Pro - GPS, pin 14 ngày',
      price: 4990000,
      salePrice: 4490000,
      stock: 80,
      images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800'],
      featured: false,
      categoryId: createdCategories[3].id,
    },
    {
      name: 'Huawei Watch GT 4',
      slug: 'huawei-watch-gt-4',
      description: 'Huawei Watch GT 4 46mm - Pin 14 ngày, thiết kế sang trọng',
      price: 5990000,
      salePrice: 5490000,
      stock: 70,
      images: ['https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800'],
      featured: false,
      categoryId: createdCategories[3].id,
    },

    // Nhà thông minh (5 sản phẩm)
    {
      name: 'Google Nest Hub Max',
      slug: 'google-nest-hub-max',
      description: 'Google Nest Hub Max - Màn hình thông minh 10 inch',
      price: 5990000,
      salePrice: 4990000,
      stock: 40,
      images: ['https://images.unsplash.com/photo-1558002038-1055907df827?w=800'],
      featured: true,
      categoryId: createdCategories[4].id,
    },
    {
      name: 'Amazon Echo Show 10',
      slug: 'amazon-echo-show-10',
      description: 'Echo Show 10 - Màn hình xoay tự động với Alexa',
      price: 6490000,
      salePrice: 5490000,
      stock: 35,
      images: ['https://images.unsplash.com/photo-1558089687-e946e3452f1c?w=800'],
      featured: false,
      categoryId: createdCategories[4].id,
    },
    {
      name: 'Philips Hue Starter Kit',
      slug: 'philips-hue-starter-kit',
      description: 'Bộ đèn thông minh Philips Hue - 3 bóng + Hub',
      price: 3990000,
      salePrice: 3490000,
      stock: 60,
      images: ['https://images.unsplash.com/photo-1558089687-e946e3452f1c?w=800'],
      featured: false,
      categoryId: createdCategories[4].id,
    },
    {
      name: 'Ring Video Doorbell Pro 2',
      slug: 'ring-doorbell-pro-2',
      description: 'Chuông cửa thông minh Ring - Camera HD, phát hiện chuyển động',
      price: 4990000,
      salePrice: 4490000,
      stock: 45,
      images: ['https://images.unsplash.com/photo-1558002038-1055907df827?w=800'],
      featured: false,
      categoryId: createdCategories[4].id,
    },
    {
      name: 'TP-Link Tapo Smart Plug',
      slug: 'tapo-smart-plug',
      description: 'Ổ cắm thông minh TP-Link Tapo - Điều khiển từ xa',
      price: 299000,
      salePrice: 249000,
      stock: 200,
      images: ['https://images.unsplash.com/photo-1558002038-1055907df827?w=800'],
      featured: false,
      categoryId: createdCategories[4].id,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  console.log('✅ Đã tạo 50 sản phẩm')

  console.log('🎉 Seed database hoàn tất!')
  console.log('')
  console.log('📝 Thông tin đăng nhập:')
  console.log('Admin: admin@shopvn.com / admin123')
  console.log('User: user@shopvn.com / user123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
