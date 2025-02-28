'use client';

import { NextIntlClientProvider } from 'next-intl';

export function Providers({
  children,
  messages,
  locale
}: {
  children: React.ReactNode;
  messages: any;
  locale: string;
}) {
  return (
    <NextIntlClientProvider 
      messages={messages} 
      locale={locale}
      timeZone="Asia/Dubai"
      // You can also use Intl.DateTimeFormat().resolvedOptions().timeZone
      // to get the user's local timezone
    >
      {children}
    </NextIntlClientProvider>
  );
} 