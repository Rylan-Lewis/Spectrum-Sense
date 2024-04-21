/** @type {import('next').NextConfig} */
const nextConfig = {};

// Import next-pwa using ES module syntax
import withPWA from 'next-pwa';

// Pass the configuration object directly to withPWA
export default withPWA({
  ...nextConfig,
  dest: 'public'
});
