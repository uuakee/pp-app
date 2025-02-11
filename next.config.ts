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
      {
        protocol: 'https',
        hostname: 'epiroc.scene7.com',
        port: '',
        pathname: '/is/image/**',
      }
    ]
  },
  reactStrictMode: true,
}

module.exports = nextConfig 