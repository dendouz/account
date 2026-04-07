/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@studeo/shared"],
  output: "standalone",
};

module.exports = nextConfig;
