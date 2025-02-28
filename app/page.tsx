"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { ProductSkeleton } from "@/components/product-skeleton"
import { Download } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useTranslations } from "next-intl"

export default function Home() {
  const t = useTranslations("Index")
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<{
    title: string[]
    prices: string[]
    stars: string[]
    image: string[]
    endPage: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scrapeAllPages, setScrapeAllPages] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setError(t("urlError"))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ siteUrl: url, scrapeAllPages }),
      })

      if (!response.ok) {
        throw new Error(t("fetchError"))
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("genericError"))
    } finally {
      setIsLoading(false)
    }
  }

  const downloadExcel = async () => {
    if (!data) return

    try {
      const response = await fetch("/api/download-excel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(t("excelError"))
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "scraped-products.xlsx"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("downloadError"))
    }
  }

  return (
    <main className="container mx-auto py-10 px-4 rtl">
      <h1 className="text-3xl font-bold mb-6 text-center">{t("title")}</h1>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="url"
              placeholder={t("urlPlaceholder")}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Checkbox
                id="scrapeAllPages"
                checked={scrapeAllPages}
                onCheckedChange={(checked) => setScrapeAllPages(checked as boolean)}
              />
              <label
                htmlFor="scrapeAllPages"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("scrapeAllPages")}
              </label>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("loading") : t("scrapeButton")}
            </Button>
          </form>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
      </Card>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      )}

      {data && !isLoading && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{t("results")}</h2>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {t("totalPages")}: {data.endPage || t("notAvailable")}
              </p>
              <Button variant="outline" size="sm" onClick={downloadExcel} className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                {t("downloadExcel")}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.title.map((title, index) => (
              <ProductCard
                key={index}
                title={title}
                price={data.prices[index] || t("notAvailable")}
                stars={data.stars[index] || t("notAvailable")}
                image={data.image[index] || "/placeholder.svg?height=200&width=200"}
              />
            ))}
          </div>
        </>
      )}
    </main>
  )
}

