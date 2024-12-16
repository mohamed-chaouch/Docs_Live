/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  images: {
    domains: ["localhost", "docs-live-backend.vercel.app"], // Add 'localhost' as an allowed domain
  },
};

export default nextConfig;
