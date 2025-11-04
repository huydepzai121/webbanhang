"use client"

import Link from "next/link"
import { ShoppingCart, User, Wallet, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <ShoppingCart className="h-6 w-6" />
          <span className="font-bold text-xl">ShopVN</span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 items-center space-x-4 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-8"
            />
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-6 ml-auto">
          <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
            Sản phẩm
          </Link>
          <Link href="/cart" className="flex items-center space-x-1">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-sm font-medium">Giỏ hàng</span>
          </Link>
          <Link href="/profile/wallet" className="flex items-center space-x-1">
            <Wallet className="h-5 w-5" />
            <span className="text-sm font-medium">Ví</span>
          </Link>
          <Link href="/profile">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Tài khoản
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container mx-auto flex flex-col space-y-4 px-4 py-4">
            <Input placeholder="Tìm kiếm sản phẩm..." />
            <Link href="/products" className="text-sm font-medium">
              Sản phẩm
            </Link>
            <Link href="/cart" className="text-sm font-medium">
              Giỏ hàng
            </Link>
            <Link href="/profile/wallet" className="text-sm font-medium">
              Ví của tôi
            </Link>
            <Link href="/profile" className="text-sm font-medium">
              Tài khoản
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
