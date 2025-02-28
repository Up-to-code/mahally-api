import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

interface ProductCardProps {
  title: string
  price: string
  stars: string
  image: string
}

export function ProductCard({ title, price, stars, image }: ProductCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={image || "/placeholder.svg?height=200&width=200"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder.svg?height=200&width=200"
          }}
        />
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium line-clamp-2 mb-2">{title}</h3>
        <div className="flex items-center gap-1 text-yellow-500 mb-2">
          <Star className="h-4 w-4 fill-current" />
          <span className="text-sm font-bold">{stars}</span>
        </div>
        <p className="text-lg font-bold mt-auto">{price}</p>
      </CardContent>
    </Card>
  )
}

