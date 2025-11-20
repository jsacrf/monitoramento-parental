import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ParentalPro - Controle Parental',
    short_name: 'ParentalPro',
    description: 'Monitore e proteja seus filhos no mundo digital',
    start_url: '/app',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4F46E5',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ],
    categories: ['lifestyle', 'utilities'],
    lang: 'pt-BR',
    dir: 'ltr'
  }
}
