export interface Headline {
  title: string;
  source: string;
  url?: string;
  publishedAt?: string;
}

export interface WeeklyAvatar {
  id: string;
  week_date: string; // ISO date string (YYYY-MM-DD)
  image_url: string;
  headlines: Headline[];
  generated_prompt: string;
  status: 'pending' | 'generating' | 'success' | 'failed';
  error_message?: string;
  is_paused: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Array<{
    source: { id: string | null; name: string };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
  }>;
}
