"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ShoppingBag,
  Wallet,
  CreditCard,
  Shield,
  Truck,
  Clock,
  Star,
  TrendingUp,
  Zap,
  ArrowRight,
  ChevronRight,
  Percent
} from "lucide-react"
import { formatPrice, calculateDiscount } from "@/lib/utils"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  salePrice: number | null
  images: string[]
  featured: boolean
}

interface Category {
  id: string
  name: string
  slug: string
  image: string
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [hotDeals, setHotDeals] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products?featured=true&pageSize=8"),
        fetch("/api/categories"),
      ])

      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()

      if (productsData.success) {
        setFeaturedProducts(productsData.data.items.slice(0, 4))
        setHotDeals(productsData.data.items.slice(4, 8))
      }
      if (categoriesData.success) {
        setCategories(categoriesData.data)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: Truck,
      title: "Miễn phí vận chuyển",
      description: "Cho đơn hàng trên 500K",
    },
    {
      icon: Wallet,
      title: "Thanh toán an toàn",
      description: "Ví điện tử & COD",
    },
    {
      icon: Clock,
      title: "Giao hàng nhanh",
      description: "2-3 ngày toàn quốc",
    },
    {
      icon: Shield,
      title: "Bảo hành chính hãng",
      description: "12 tháng trở lên",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">
                <Zap className="h-3 w-3 mr-1" />
                Giảm giá tới 50% hôm nay!
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Mua sắm thông minh<br />
                <span className="text-yellow-300">Tiết kiệm hơn</span>
              </h1>
              <p className="text-xl opacity-90 max-w-lg">
                Hàng ngàn sản phẩm công nghệ chính hãng với giá tốt nhất thị trường.
                Thanh toán ví điện tử, nạp thẻ tiện lợi.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" variant="secondary" className="text-lg">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Khám phá ngay
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg"
                  >
                    Đăng ký miễn phí
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                    <ShoppingBag className="h-8 w-8 mb-2" />
                    <div className="text-2xl font-bold">10K+</div>
                    <div className="text-sm opacity-90">Sản phẩm</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                    <Star className="h-8 w-8 mb-2 fill-yellow-300 text-yellow-300" />
                    <div className="text-2xl font-bold">4.9/5</div>
                    <div className="text-sm opacity-90">Đánh giá</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                    <TrendingUp className="h-8 w-8 mb-2" />
                    <div className="text-2xl font-bold">50K+</div>
                    <div className="text-sm opacity-90">Khách hàng</div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                    <Truck className="h-8 w-8 mb-2" />
                    <div className="text-2xl font-bold">2-3 ngày</div>
                    <div className="text-sm opacity-90">Giao hàng</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">{feature.title}</div>
                  <div className="text-sm text-muted-foreground">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Danh mục nổi bật</h2>
              <p className="text-muted-foreground">Khám phá theo danh mục sản phẩm</p>
            </div>
            <Link href="/products">
              <Button variant="outline">
                Xem tất cả
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.slug}`}>
                <Card className="group hover:shadow-lg transition-all cursor-pointer overflow-hidden">
                  <CardContent className="p-4">
                    <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-center group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Deals */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-red-500 text-white p-2 rounded-lg">
                <Percent className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-red-600">Flash Sale</h2>
                <p className="text-muted-foreground">Giảm giá sốc trong hôm nay!</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
              <Clock className="h-5 w-5 text-red-500" />
              <span className="font-mono text-xl font-bold">23:59:45</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {hotDeals.map((product) => {
              const discount = product.salePrice
                ? calculateDiscount(product.price, product.salePrice)
                : 0
              return (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <Card className="group hover:shadow-xl transition-all">
                    <CardContent className="p-4">
                      <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100">
                        <Badge className="absolute top-2 right-2 bg-red-500 z-10">
                          -{discount}%
                        </Badge>
                        {product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-20 w-20 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-red-600">
                          {formatPrice(product.salePrice || product.price)}
                        </span>
                        {product.salePrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Sản phẩm nổi bật</h2>
              <p className="text-muted-foreground">Những sản phẩm được yêu thích nhất</p>
            </div>
            <Link href="/products">
              <Button variant="outline">
                Xem tất cả
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <Card className="group hover:shadow-xl transition-all">
                  <CardContent className="p-4">
                    <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100">
                      <Badge className="absolute top-2 left-2 bg-yellow-500 z-10">
                        <Star className="h-3 w-3 mr-1 fill-white" />
                        Nổi bật
                      </Badge>
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-20 w-20 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(product.salePrice || product.price)}
                      </span>
                      {product.salePrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Trở thành thành viên ShopVN
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Đăng ký ngay để nhận ưu đãi độc quyền, tích điểm và nhiều đặc quyền khác!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Input
                type="email"
                placeholder="Nhập email của bạn"
                className="max-w-md bg-white text-black"
              />
              <Button size="lg" variant="secondary" className="min-w-[150px]">
                Đăng ký ngay
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tại sao chọn ShopVN?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Hàng chính hãng 100%",
                description: "Cam kết sản phẩm chính hãng, bảo hành đầy đủ"
              },
              {
                icon: CreditCard,
                title: "Thanh toán đa dạng",
                description: "Ví điện tử, nạp thẻ, COD - tùy bạn chọn"
              },
              {
                icon: Truck,
                title: "Giao hàng toàn quốc",
                description: "Nhanh chóng, an toàn với đội ngũ shipper chuyên nghiệp"
              },
              {
                icon: Star,
                title: "Hỗ trợ 24/7",
                description: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng"
              }
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <item.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
