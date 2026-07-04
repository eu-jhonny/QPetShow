import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Permite imagens hospedadas externamente (ex.: Cloudinary) em banners/produtos.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
