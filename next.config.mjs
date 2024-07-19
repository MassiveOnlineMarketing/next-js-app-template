/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Existing rule for SVG
    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: "@svgr/webpack" }],
    });

    return config;
  },


  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
