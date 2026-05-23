/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
    qualities: [52, 64, 72, 75],
  },
}

export default nextConfig
