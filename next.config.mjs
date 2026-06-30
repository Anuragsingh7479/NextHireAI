/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // @react-pdf/renderer and firebase-admin are server-only; keep them external
  // so they aren't bundled into client code.
  serverExternalPackages: ["@react-pdf/renderer", "firebase-admin"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google avatars
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
};

export default nextConfig;
