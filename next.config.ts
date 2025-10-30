import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images:{
    remotePatterns:[
      {
        protocol: "https",
        hostname:"**.convex.cloud",
      }
    ]
  }
  /* config options here */
};

export default nextConfig;
