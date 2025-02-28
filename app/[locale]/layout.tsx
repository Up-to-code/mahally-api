import type React from "react"
import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getTranslations } from "next-intl/server"

const inter = Cairo({ subsets: ["latin" , "arabic"] })

export const metadata: Metadata = {
  title: "Product Scraper",
  description: "Scrape product data from websites",
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }]
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  let messages
  try {
    messages = (await import(`../../messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const t = await getTranslations({ locale, namespace: "Index" })

  return {
    title: t("title"),
  }
}

