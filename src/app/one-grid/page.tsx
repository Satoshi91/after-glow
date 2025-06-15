import { getImages } from '@/lib/client'
import Image from 'next/image'
import Link from 'next/link'

export default async function OneGrid() {
  const images = await getImages()

  return (
    <div className="min-h-screen text-lime-400">
      <div className="container mx-auto px-2 py-2">
        <div className="space-y-6">
          {/* 画像一覧 - 1列グリッド */}
          <div className="grid grid-cols-1">
            {images.map((image) => (
              <Link
                key={image.id}
                href={`/image/${image.id}`}
                className="rounded-lg overflow-hidden shadow-lg hover:opacity-90 transition-opacity"
              >
                <div className="relative aspect-square">
                  <Image
                    src={image.storage_url}
                    alt={image.original_filename || '画像'}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 