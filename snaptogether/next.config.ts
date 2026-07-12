import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/mk/event/09e1b5/guest',
        destination: '/mk/event/860fca/guest',
        permanent: false,
      },
      {
        source: '/event/:path*',
        destination: '/mk/event/:path*',
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'snaptogether25.s3.eu-north-1.amazonaws.com',
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
