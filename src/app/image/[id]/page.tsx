import { getImages } from '@/lib/client'
import { notFound } from 'next/navigation'
import ImageSwiper from '@/components/ImageSwiper'

type PageProps = {
  params: Promise<{
    id: string;
  }>;
}

export default async function ImageDetail({ params }: PageProps) {
  const { id } = await params
  const images = await getImages()
  const currentImage = images.find(img => img.id === id)
  
  if (!currentImage) {
    notFound()
  }

  return <ImageSwiper images={images} currentImageId={id} />
}
