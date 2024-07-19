type KeywordMetrics = {
  googleSearchKeywordId: string
  avg_monthly_searches?: string
  competition?: string
  competition_index?: string
  high_top_of_page_bid_micros?: string
  low_top_of_page_bid_micros?: string
}

export type KeywordMetricsInput = {
  keyword_metrics: KeywordMetrics
  text: string
  id: string
}