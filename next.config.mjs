/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // reactCompiler: true,
  // basePath: process.env.BASEPATH ?? '',
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/dashboard/orders',
        permanent: true
      },
      {
        source: '/apps/users',
        destination: '/apps/users/list',
        permanent: true
      }
    ]
  }
};

export default nextConfig;
