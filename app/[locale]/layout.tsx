import type { Metadata } from 'next'
import '../globals.css'
import { Providers } from '../providers'
import { Cairo } from 'next/font/google'

const cairo = Cairo({ 
  subsets: ['arabic'],
  display: 'swap',
  adjustFontFallback: false // this helps with Arabic text rendering
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
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={cairo.className}>
      <body>
        <Providers messages={messages} locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  )
}

