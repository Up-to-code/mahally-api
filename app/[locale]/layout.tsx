import type { Metadata } from 'next'
import '../globals.css'
import { Providers } from '../providers'
import { Cairo } from 'next/font/google'

const cairo = Cairo({ 
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  adjustFontFallback: false
})

export const metadata: Metadata = {
  title: 'محلي API',
  description: 'أداة تحليل وجمع بيانات المنتجات',
  generator: 'Next.js',
}

async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    return (await import(`@/messages/ar.json`)).default;
  }
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages(locale);

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`${cairo.variable}`}>
      <body className={`font-sans`}>
        <Providers messages={messages} locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  )
}

