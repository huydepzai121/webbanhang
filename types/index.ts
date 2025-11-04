import { Product, User, Order, Cart, Category, Wallet, Transaction } from '@prisma/client'

export type ProductWithCategory = Product & {
  category: Category
}

export type CartWithItems = Cart & {
  items: (CartItem & {
    product: Product
  })[]
}

export type CartItem = {
  id: string
  cartId: string
  productId: string
  quantity: number
  product: Product
}

export type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product
  })[]
  user: User
}

export type OrderItem = {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  product: Product
}

export type UserWithWallet = User & {
  wallet: Wallet | null
}

export type TransactionWithDetails = Transaction & {
  user: User
  order?: Order | null
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface CreateProductRequest {
  name: string
  description?: string
  price: number
  salePrice?: number
  stock: number
  categoryId: string
  images: string[]
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string
}

export interface AddToCartRequest {
  productId: string
  quantity: number
}

export interface CheckoutRequest {
  paymentMethod: 'WALLET' | 'CARD' | 'COD'
  shippingAddress: string
  phone: string
  notes?: string
}

export interface DepositRequest {
  amount: number
}

export interface CardTopupRequest {
  cardType: string
  cardSerial: string
  cardCode: string
}
