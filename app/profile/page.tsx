"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Wallet,
  ShoppingBag,
  CreditCard,
  LogOut,
  Settings,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { formatPrice, formatDate } from "@/lib/utils"
import Link from "next/link"

interface UserData {
  id: string
  email: string
  name: string
  role: string
  phone: string | null
  address: string | null
  wallet: {
    balance: number
  } | null
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me")
      const data = await response.json()
      if (data.success) {
        setUser(data.data)
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
              <p className="opacity-90">{user.email}</p>
              <Badge className="mt-3 bg-white/20 hover:bg-white/30">
                {user.role === "ADMIN" ? "Quản trị viên" : "Thành viên"}
              </Badge>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Wallet Balance */}
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-none">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Wallet className="h-5 w-5 mr-2" />
                Số dư ví
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-4">
                {formatPrice(user.wallet?.balance || 0)}
              </p>
              <Link href="/profile/wallet">
                <Button variant="secondary" className="w-full">
                  Quản lý ví
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-4">0</p>
              <Link href="/profile/orders">
                <Button variant="outline" className="w-full">
                  Xem đơn hàng
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Điểm tích lũy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-4">0</p>
              <Button variant="outline" className="w-full" disabled>
                Đổi quà
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="wallet">Ví & Giao dịch</TabsTrigger>
            <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>Quản lý thông tin tài khoản của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Họ và tên
                    </label>
                    <p className="text-lg mt-1">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-lg mt-1">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Số điện thoại
                    </label>
                    <p className="text-lg mt-1">{user.phone || "Chưa cập nhật"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Vai trò</label>
                    <p className="text-lg mt-1">
                      {user.role === "ADMIN" ? "Quản trị viên" : "Thành viên"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Địa chỉ</label>
                  <p className="text-lg mt-1">{user.address || "Chưa cập nhật"}</p>
                </div>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Cập nhật thông tin
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ví điện tử</CardTitle>
                <CardDescription>Quản lý số dư và nạp tiền vào ví</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Wallet className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-xl font-semibold mb-2">Số dư hiện tại</p>
                  <p className="text-4xl font-bold text-primary mb-6">
                    {formatPrice(user.wallet?.balance || 0)}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link href="/profile/wallet/deposit">
                      <Button size="lg">
                        <ArrowDownRight className="h-4 w-4 mr-2" />
                        Nạp tiền
                      </Button>
                    </Link>
                    <Link href="/profile/wallet/topup-card">
                      <Button size="lg" variant="outline">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Nạp thẻ
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lịch sử giao dịch</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Chưa có giao dịch nào
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Đơn hàng của tôi</CardTitle>
                <CardDescription>Theo dõi trạng thái đơn hàng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground mb-4">Chưa có đơn hàng nào</p>
                  <Link href="/products">
                    <Button>Bắt đầu mua sắm</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Admin Panel Link */}
        {user.role === "ADMIN" && (
          <Card className="mt-6 border-primary">
            <CardHeader>
              <CardTitle className="text-primary">Khu vực quản trị</CardTitle>
              <CardDescription>Bạn có quyền truy cập admin dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin">
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Vào trang quản trị
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
