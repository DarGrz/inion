import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/pracodawca/:slug',
        destination: '/:slug',
        permanent: true, // 301 redirect - permanent
      },
    ];
  },
};

export default nextConfig;
