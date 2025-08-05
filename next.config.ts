/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Optional: fix the turbo config warning
  experimental: {
    turbo: {},
  },
}

export default nextConfig
