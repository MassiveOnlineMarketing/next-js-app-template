export type KeywordMetrics = {
  googleSearchKeywordId: string
  avg_monthly_searches: string | null
  competition: string | null
  competition_index: string | null
  high_top_of_page_bid_micros: string | null
  low_top_of_page_bid_micros: string | null
}

export type KeywordMetricsInput = {
  keyword_metrics: KeywordMetrics
  text: string
  id: string
}

export type KeywordMetric = {
  keyword_metrics: {
    avg_monthly_searches: string | null,
    competition: string | null,
    competition_index: string | null,
    high_top_of_page_bid_micros: string | null,
    low_top_of_page_bid_micros: string | null,
    monthly_search_volumes: string | null,
  },
  text: string,
  id: string
}