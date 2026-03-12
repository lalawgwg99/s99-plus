// ─── FinMind API Client ────────────────────────────────────────────────────────
// Docs: https://api.finmindtrade.com/api/v4/
// Free tier: 600 req/day, 3 req/s — no backend needed, supports CORS

const FM_BASE = "https://api.finmindtrade.com/api/v4"

// Optional: set your FinMind token in .env.local as NEXT_PUBLIC_FINMIND_TOKEN
const TOKEN = process.env.NEXT_PUBLIC_FINMIND_TOKEN ?? ""

async function fmFetch<T>(dataset: string, params: Record<string, string>): Promise<T[]> {
  const qs = new URLSearchParams({ dataset, ...params, ...(TOKEN ? { token: TOKEN } : {}) })
  const res = await fetch(`${FM_BASE}/data?${qs}`)
  if (!res.ok) throw new Error(`FinMind API error: ${res.status}`)
  const json = await res.json()
  if (json.status !== 200) throw new Error(json.msg ?? "FinMind error")
  return json.data as T[]
}

// ─── TWSE direct endpoints (no auth needed) ────────────────────────────────────
const TWSE_BASE = "https://openapi.twse.com.tw/v1"

async function twseFetch<T>(path: string): Promise<T[]> {
  const res = await fetch(`${TWSE_BASE}${path}`)
  if (!res.ok) throw new Error(`TWSE API error: ${res.status}`)
  return res.json() as Promise<T[]>
}

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface StockInfo {
  stock_id: string
  stock_name: string
  industry_category: string
  type: string // 上市 / 上櫃
}

export interface DailyPrice {
  date: string
  stock_id: string
  Trading_Volume: number
  Trading_money: number
  open: number
  max: number
  min: number
  close: number
  spread: number
  Trading_turnover: number
}

export interface DividendRecord {
  stock_id: string
  year: number
  StockEarningsDistribution: number
  StockStatutoryDistribution: number
  StockCapitalDistribution: number
  CashEarningsDistribution: number
  CashStatutoryDistribution: number
  CashCapitalDistribution: number
  CashExDividendTradingDate: string
  CashDividendPayDate: string
  StockExDividendTradingDate: string
  ComprehensiveDividend: number
}

export interface InstitutionalFlow {
  date: string
  stock_id: string
  ForeignInvestors_buy: number
  ForeignInvestors_sell: number
  ForeignInvestors_net: number
  InvestmentTrust_buy: number
  InvestmentTrust_sell: number
  InvestmentTrust_net: number
  Dealer_net: number
}

export interface TWCIPrice {
  Date: string
  TradeVolume: string
  TradeValue: string
  OpeningPrice: string
  HighestPrice: string
  LowestPrice: string
  ClosingPrice: string
  Change: string
}

export interface TWStockListing {
  公司代號: string
  公司名稱: string
  市場別: string
  產業別: string
  上市日: string
}

// ─── API Functions ─────────────────────────────────────────────────────────────

/** Search all listed stocks from TWSE */
export async function fetchAllListedStocks(): Promise<TWStockListing[]> {
  return twseFetch<TWStockListing>("/exchangeReport/STOCK_DAY_ALL")
    .catch(() => twseFetch<TWStockListing>("/company/Esession") )
}

/** Get FinMind stock info list (name + industry) */
export async function fetchStockInfo(): Promise<StockInfo[]> {
  return fmFetch<StockInfo>("TaiwanStockInfo", {})
}

/** Get daily OHLCV for a single stock */
export async function fetchDailyPrice(stockId: string, startDate: string): Promise<DailyPrice[]> {
  return fmFetch<DailyPrice>("TaiwanStockPrice", { data_id: stockId, start_date: startDate })
}

/** Get dividend history */
export async function fetchDividends(stockId: string): Promise<DividendRecord[]> {
  return fmFetch<DividendRecord>("TaiwanStockDividend", { data_id: stockId, start_date: "2010-01-01" })
}

/** Get 3 institutional investor flows */
export async function fetchChipFlow(stockId: string, startDate: string): Promise<InstitutionalFlow[]> {
  return fmFetch<InstitutionalFlow>("TaiwanStockInstitutionalInvestors", { data_id: stockId, start_date: startDate })
}

/** Get TWSE market summary for today */
export async function fetchMarketSummary(): Promise<TWCIPrice[]> {
  return twseFetch<TWCIPrice>("/exchangeReport/TWTCI")
}

// ─── Helper ────────────────────────────────────────────────────────────────────
export function nDaysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}
