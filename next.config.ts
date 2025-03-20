import type { NextConfig } from "next"
// import path from "node:path"

/** @type {Import("next").NextConfig} */
const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // own custom cache handler
  // cacheHandler: path.resolve("./cache-handler.mjs"),
  // cacheMaxMemorySize: 0 // Disable in-memory cache
  images: {
    // use custom image optimizon service
    // loader: 'custom',
    // loaderFile: './image-loader.ts',
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unplash.com",
        port: "",
        pathname: "/**",
        search: "" // query parameter disable
      }
    ]
  },
  // Nginx will do gzip compression. We disable
  // compression here so we can prevent buffering
  // streaming responses
  compress: false
  // Optional: override the default (1 year) `stale-while-revalidate`
  // header time for static pages
  // swrDelta: 3600 // seconds
}

export default nextConfig
