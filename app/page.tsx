import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Wallet, CreditCard, Shield } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: ShoppingBag,
      title: "Mua sắm dễ dàng",
      description: "Hàng ngàn sản phẩm chất lượng với giá tốt nhất",
    },
    {
      icon: Wallet,
      title: "Ví điện tử",
      description: "Thanh toán nhanh chóng và an toàn với ví điện tử",
    },
    {
      icon: CreditCard,
      title: "Nạp thẻ tiện lợi",
      description: "Hỗ trợ nạp thẻ điện thoại các nhà mạng",
    },
    {
      icon: Shield,
      title: "Bảo mật cao",
      description: "Thông tin được mã hóa và bảo vệ tuyệt đối",
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Chào mừng đến với ShopVN
            </h1>
            <p className="text-xl mb-8">
              Website bán hàng trực tuyến hiện đại với đầy đủ tính năng:
              thanh toán ví điện tử, nạp thẻ, và hàng ngàn sản phẩm chất lượng.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" variant="secondary">
                  Mua sắm ngay
                </Button>
              </Link>
              <Link href="/(auth)/register">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                  Đăng ký
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tính năng nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <feature.icon className="h-10 w-10 mb-4 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Bắt đầu mua sắm ngay hôm nay!
            </h2>
            <p className="text-xl mb-8">
              Đăng ký tài khoản và nhận ngay ưu đãi đặc biệt
            </p>
            <Link href="/(auth)/register">
              <Button size="lg" variant="secondary">
                Đăng ký miễn phí
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Sản phẩm</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-muted-foreground">Khách hàng</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Hài lòng</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
