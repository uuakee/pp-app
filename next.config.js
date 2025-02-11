/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'minerarent.com',
        port: '',
        pathname: '/assets/images/**',
      },
    ],
  },
}

module.exports = nextConfig 