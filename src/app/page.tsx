import { getImages } from '@/lib/client'
import Image from 'next/image'

export default async function Home() {
  const images = await getImages()

  return (
    <div className="min-h-screen text-lime-400">
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* 画像一覧 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="rounded-lg overflow-hidden shadow-lg">
                <div className="relative aspect-square">
                  <Image
                    src={image.storage_url}
                    alt={image.original_filename || '画像'}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
