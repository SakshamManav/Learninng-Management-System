/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  images: {
     remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
  },
};
