// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//    headers: async () => [
//     {
//       source: '/(.*)',
//       headers: [
//         { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }, // Force un rechargement propre des CSS/JS
//       ],
//     },
//   ],
//   experimental: {
//     optimizeCss: true, // (Laisse actif pour un CSS optimisé, mais surveille le rendu)
//   },
// };

// export default nextConfig;
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;