export interface Image {
  id: string;
  request_id: string | null;
  storage_url: string;
  original_filename: string | null;
  created_at: string;
  is_public: boolean;
  rating: number | null;
  views: number | null;
} 