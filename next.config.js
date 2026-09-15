/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Every image is local to public/images, so no remote patterns are needed.
    formats: ['image/avif', 'image/webp'],
  },
  // The site moved to Vercel, but mail stays on the cPanel host (41.80.37.8).
  // Sending the old cPanel URLs to the mail host keeps them working instead of 404ing.
  async redirects() {
    return [
      { source: '/webmail', destination: 'https://webmail.harriscomcompany.co.ke', permanent: false },
      { source: '/webmail/:path*', destination: 'https://webmail.harriscomcompany.co.ke/:path*', permanent: false },
      { source: '/mail', destination: 'https://webmail.harriscomcompany.co.ke', permanent: false },
      { source: '/roundcube', destination: 'https://webmail.harriscomcompany.co.ke', permanent: false },
      { source: '/cpanel', destination: 'https://cpanel.harriscomcompany.co.ke:2083', permanent: false },
      { source: '/whm', destination: 'https://whm.harriscomcompany.co.ke:2087', permanent: false },
      { source: '/webdisk', destination: 'https://webdisk.harriscomcompany.co.ke:2078', permanent: false },
    ]
  },
}

module.exports = nextConfig
