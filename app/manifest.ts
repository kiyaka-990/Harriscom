import type { MetadataRoute } from 'next'

import { company } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: company.name,
    short_name: company.shortName,
    description: company.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#080811',
    theme_color: '#0b1230',
    icons: [
      { src: '/logo-mark.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  }
}
