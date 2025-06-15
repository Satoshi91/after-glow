import { getImages } from '@/lib/client'
import { notFound } from 'next/navigation'
import ImageSwiper from '@/components/ImageSwiper'

export default async function ImageDetail({ params }: { params: { id: string } }) {
  const images = await getImages()
  const currentImage = images.find(img => img.id === params.id)
  
  if (!currentImage) {
    notFound()
  }

  return <ImageSwiper images={images} currentImageId={params.id} />
} 