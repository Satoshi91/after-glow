import { createClient } from '@supabase/supabase-js'
import type { Image } from '@/types'

// Supabaseクライアントを作成
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 有効な画像URLかどうかをチェックする関数
function isValidImageUrl(url: string): boolean {
  // 'temp'や空文字、nullなどの無効なURLを除外
  if (!url || url === 'temp' || url.trim() === '') {
    return false
  }
  
  // 基本的なURL形式をチェック
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// 型安全な画像取得関数
export async function getImages(): Promise<Image[]> {
  try {
    const response = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false })

    console.log(response)

    if (response.error) {
      console.error('Error fetching images:', response.error)
      return []
    }

    const allImages = response.data as Image[] || []
    
    // 有効な画像URLを持つ画像のみをフィルタリング
    const validImages = allImages.filter(image => isValidImageUrl(image.storage_url))
    
    console.log(`全画像数: ${allImages.length}, 有効な画像数: ${validImages.length}`)
    
    return validImages
  } catch (error) {
    console.error('Unexpected error fetching images:', error)
    return []
  }
}

// 個別画像取得関数
export async function getImageById(id: string): Promise<Image | null> {
  try {
    const response = await supabase
      .from('images')
      .select('*')
      .eq('id', id)
      .single()

    if (response.error) {
      console.error('Error fetching image:', response.error)
      if (response.error.code === 'PGRST116') {
        // Not found error
        return null
      }
      return null
    }

    const image = response.data as Image
    
    // 個別画像でも有効なURLかチェック
    if (!isValidImageUrl(image.storage_url)) {
      console.warn(`Invalid storage URL for image ${id}: ${image.storage_url}`)
      return null
    }

    return image
  } catch (error) {
    console.error('Unexpected error fetching image:', error)
    return null
  }
}

// 画像のpublic URLを取得する関数
export function getImageUrl(storagePath: string): string {
  try {
    // 既に完全なURLの場合
    if (storagePath.startsWith('http')) {
      // URLの最後の?を削除
      return storagePath.replace(/\?$/, '')
    }
    
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(storagePath)

    // URLの最後の?を削除
    return data.publicUrl.replace(/\?$/, '')
  } catch (error) {
    console.error('Error generating public URL:', error)
    // フォールバック画像やプレースホルダーを返すことも可能
    return '/placeholder-image.jpg'
  }
} 