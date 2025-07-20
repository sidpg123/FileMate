import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d1icfhx07dldbv.cloudfront.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
  env: {
    API_SERVER_BASE_URL: process.env.API_SERVER_BASE_URL,
  },
};

export default nextConfig;
