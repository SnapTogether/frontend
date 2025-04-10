import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'snaptogether25.s3.eu-north-1.amazonaws.com',
      },
    ],
  },
  i18n: {
    locales: ['en', 'mk', 'sq'],
    defaultLocale: 'en',
  }  
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
