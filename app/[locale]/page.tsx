"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"
import { ProductSkeleton } from "@/components/product-skeleton"
import { Download, ArrowLeft } from "lucide-react"
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
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 arabic">
            {t("title")}
          </h1>

          {/* How it Works Section */}
          <Card className="mb-8 bg-white shadow-sm">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-6 arabic">
                {t("howItWorks")}
              </h2>
              <div className="space-y-4">
                {["step1", "step2", "step3", "step4", "step5"].map((step) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <p className="text-gray-700 arabic">
                      {t(`steps.${step}`)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scraping Form */}
          <Card className="mb-8 bg-white shadow-sm">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    type="url"
                    placeholder={t("urlPlaceholder")}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 arabic"
                  />
                  <Button type="submit" disabled={isLoading} className="arabic">
                    {isLoading ? t("loading") : t("scrapeButton")}
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="scrapeAllPages"
                    checked={scrapeAllPages}
                    onCheckedChange={(checked) => setScrapeAllPages(checked as boolean)}
                  />
                  <label
                    htmlFor="scrapeAllPages"
                    className="text-sm text-gray-600 arabic"
                  >
                    {t("scrapeAllPages")}
                  </label>
                </div>
              </form>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md arabic">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          )}

          {data && !isLoading && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 arabic">{t("results")}</h2>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600 arabic">
                    {t("totalPages")}: {data.endPage || t("notAvailable")}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={downloadExcel}
                    className="flex items-center gap-2 arabic"
                  >
                    <Download className="h-4 w-4" />
                    {t("downloadExcel")}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {data.title.map((title, index) => (
                  <ProductCard
                    key={index}
                    title={title}
                    price={data.prices[index] || t("notAvailable")}
                    stars={data.stars[index] || t("notAvailable")}
                    image={data.image[index] || "/placeholder.svg"}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
} 