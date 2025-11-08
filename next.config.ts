import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'reactecommerceapp.blob.core.windows.net',
        port: '',
        search: '',
      }
    ]
  }
};

export default nextConfig;
