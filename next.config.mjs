/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: '**', // This allows any domain
              pathname: '**', // This allows any path
            },
        ],
    }
};

export default nextConfig;
