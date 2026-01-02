import { Headline, NewsApiResponse } from './types';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

/**
 * Fetches top headlines from NewsAPI
 * Falls back to a "peaceful day" scenario if no headlines are found
 */
export async function fetchTopHeadlines(count: number = 5): Promise<Headline[]> {
  if (!NEWS_API_KEY) {
    console.warn('NEWS_API_KEY not set, using fallback headlines');
    return getFallbackHeadlines();
  }

  try {
    const url = new URL(`${NEWS_API_BASE_URL}/top-headlines`);
    url.searchParams.set('country', 'us');
    url.searchParams.set('pageSize', count.toString());
    url.searchParams.set('apiKey', NEWS_API_KEY);

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'WeeklyAvatarGenerator/1.0',
      },
    });

    if (!response.ok) {
      console.error('NewsAPI error:', response.status, await response.text());
      return getFallbackHeadlines();
    }

    const data: NewsApiResponse = await response.json();

    if (!data.articles || data.articles.length === 0) {
      console.warn('No articles returned from NewsAPI');
      return getFallbackHeadlines();
    }

    // Filter out articles with "[Removed]" titles (NewsAPI sometimes returns these)
    const validArticles = data.articles.filter(
      (article) => article.title && !article.title.includes('[Removed]')
    );

    if (validArticles.length === 0) {
      return getFallbackHeadlines();
    }

    return validArticles.slice(0, count).map((article) => ({
      title: article.title,
      source: article.source.name,
      url: article.url,
      publishedAt: article.publishedAt,
    }));
  } catch (error) {
    console.error('Error fetching headlines:', error);
    return getFallbackHeadlines();
  }
}

/**
 * Returns peaceful/neutral headlines for "slow news days" or API failures
 */
function getFallbackHeadlines(): Headline[] {
  return [
    {
      title: 'A peaceful day with clear skies and calm winds',
      source: 'Weather Service',
    },
    {
      title: 'Communities come together for local celebrations',
      source: 'Local News',
    },
    {
      title: 'Scientists make progress on renewable energy research',
      source: 'Science Daily',
    },
  ];
}
