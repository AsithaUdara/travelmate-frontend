/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // All previously added domains
      { protocol: 'https', hostname: 'images.unsplash.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'th.bing.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'www.divergenttravelers.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'tse4.mm.bing.net', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'tse2.mm.bing.net', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'media.tacdn.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'tse1.mm.bing.net', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'www.storiesbysoumya.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'i.pinimg.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.shopify.com', port: '', pathname: '/**' },
      
      // --- ADD THESE THREE NEW DOMAINS ---
      {
        protocol: 'https',
        hostname: 'media.vamonos.nl',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dev2.uplist.lk',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sysadmin.niwadu.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;