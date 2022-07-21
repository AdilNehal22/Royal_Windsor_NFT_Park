/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig

// const { withSentryConfig } = require('@sentry/nextjs')

// const nextConfig = {
//   future: {
//     webpack5: true
//   }
// }

// module.exports = withSentryConfig(nextConfig)
