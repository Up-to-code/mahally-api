import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Mahally API',
  description: 'Product scraping and analysis tool',
  generator: 'Next.js',
}

async function getMessages(locale: string) {
  try {
    return (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    return (await import(`../messages/en.json`)).default;
  }
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { locale?: string };
}>) {
  const locale = params.locale || 'en';
  const messages = await getMessages(locale);

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <Providers messages={messages} locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
