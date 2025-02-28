/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
  },
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'ar',
  }
};

module.exports = nextConfig; 