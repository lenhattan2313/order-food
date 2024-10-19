/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';
import NextBundleAnalyzer from '@next/bundle-analyzer';
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'test-order-food.s3.ap-southeast-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'order-food-app.s3.ap-southeast-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api-bigboy.duthanhduoc.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});
export default withNextIntl(withBundleAnalyzer(nextConfig));
