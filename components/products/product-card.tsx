"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star } from "lucide-react"
import { formatPrice, calculateDiscount } from "@/lib/utils"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  salePrice: number | null
  stock: number
  images: string[]
  featured: boolean
  category: {
    id: string
    name: string
  }
}

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const displayPrice = product.salePrice || product.price
  const hasDiscount = product.salePrice && product.salePrice < product.price
  const discountPercent = hasDiscount ? calculateDiscount(product.price, product.salePrice!) : 0

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      })

      if (response.ok) {
        onAddToCart?.(product.id)
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
              <ShoppingCart className="h-20 w-20 text-gray-400" />
            </div>
          )}
          {hasDiscount && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              -{discountPercent}%
            </Badge>
          )}
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-yellow-500">
              Nổi bật
            </Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Hết hàng</Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <CardTitle className="line-clamp-2 text-lg mb-2 hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-1">(4.0)</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(displayPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isLoading}
          className="w-full"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isLoading ? "Đang thêm..." : "Thêm vào giỏ"}
        </Button>
      </CardFooter>
    </Card>
  )
}
