// ─── Mock Data Engine ──────────────────────────────────────────────────────────
// In production, replace with FinMind / TWSE API calls

export interface Stock {
  id: string
  name: string
  price: number
  change: number
  changePct: number
  industry: string
  dividendYield: number
  dividendPerShare: number
  exDividendDate: string
  fillDays: number | null
  fillRate: number
  earningsPayout: number // % of dividend from earnings (vs capital reserve)
  capitalReservePct: number // % from capital reserve (alert if high)
  consecutiveYears: number
  isCapitalReserveAlert: boolean
  marketCap: number
}

export interface ETFHolding {
  etfId: string
  stockId: string
  weight: number
}

export interface ETF {
  id: string
  name: string
  yield: number
  holdings: ETFHolding[]
}

export interface ChipData {
  stockId: string
  foreign: number // 外資
  trust: number   // 投信
  dealer: number  // 自營商
  govFunds: number // 八大官股
  topHolderPct: number // 千張大戶持股%
  topHolderChange: number // 本週增減
}

export interface DividendEvent {
  stockId: string
  stockName: string
  exDate: string
  payDate: string
  dividendPerShare: number
  estimatedAmount: number // NT$
  nhiAlert: boolean // single receipt > 20,000
}

export interface Gift {
  stockId: string
  stockName: string
  price: number // 1 share price
  giftValue: number // NT$
  giftDescription: string
  deadline: string // last buy date
  roi: number // %
  shareHolder: string // 1 share or 1 lot
}

// ─── Stocks ────────────────────────────────────────────────────────────────────
export const STOCKS: Stock[] = [
  {
    id: "2330", name: "台積電 TSMC", price: 1020, change: 10, changePct: 0.99, industry: "半導體",
    dividendYield: 1.67, dividendPerShare: 17, exDividendDate: "2025-07-17",
    fillDays: 3, fillRate: 100, earningsPayout: 100, capitalReservePct: 0,
    consecutiveYears: 22, isCapitalReserveAlert: false, marketCap: 2640000
  },
  {
    id: "2412", name: "中華電 CHT", price: 127.5, change: -0.5, changePct: -0.39, industry: "電信",
    dividendYield: 4.71, dividendPerShare: 6, exDividendDate: "2025-07-03",
    fillDays: 45, fillRate: 90, earningsPayout: 87, capitalReservePct: 13,
    consecutiveYears: 24, isCapitalReserveAlert: false, marketCap: 330000
  },
  {
    id: "0056", name: "元大高股息 ETF", price: 44.2, change: 0.12, changePct: 0.27, industry: "ETF",
    dividendYield: 8.14, dividendPerShare: 3.6, exDividendDate: "2025-10-22",
    fillDays: 18, fillRate: 85, earningsPayout: 100, capitalReservePct: 0,
    consecutiveYears: 17, isCapitalReserveAlert: false, marketCap: 420000
  },
  {
    id: "2317", name: "鴻海 Hon Hai", price: 185, change: -2.5, changePct: -1.33, industry: "電子製造",
    dividendYield: 4.86, dividendPerShare: 9, exDividendDate: "2025-08-12",
    fillDays: 62, fillRate: 78, earningsPayout: 65, capitalReservePct: 35,
    consecutiveYears: 20, isCapitalReserveAlert: true, marketCap: 1820000
  },
  {
    id: "00878", name: "國泰永續高股息", price: 23.8, change: 0.05, changePct: 0.21, industry: "ETF",
    dividendYield: 7.56, dividendPerShare: 1.8, exDividendDate: "2025-03-23",
    fillDays: 7, fillRate: 92, earningsPayout: 100, capitalReservePct: 0,
    consecutiveYears: 5, isCapitalReserveAlert: false, marketCap: 280000
  },
  {
    id: "00919", name: "群益台灣精選高息", price: 20.5, change: 0.1, changePct: 0.49, industry: "ETF",
    dividendYield: 9.76, dividendPerShare: 2.0, exDividendDate: "2025-03-20",
    fillDays: 5, fillRate: 88, earningsPayout: 100, capitalReservePct: 0,
    consecutiveYears: 3, isCapitalReserveAlert: false, marketCap: 180000
  },
  {
    id: "2886", name: "兆豐金 Mega FHC", price: 46.8, change: 0.2, changePct: 0.43, industry: "金融",
    dividendYield: 5.56, dividendPerShare: 2.6, exDividendDate: "2025-07-08",
    fillDays: 30, fillRate: 95, earningsPayout: 80, capitalReservePct: 20,
    consecutiveYears: 18, isCapitalReserveAlert: false, marketCap: 480000
  },
  {
    id: "6505", name: "台塑化 FPCC", price: 85.2, change: -1.2, changePct: -1.39, industry: "石化",
    dividendYield: 6.22, dividendPerShare: 5.3, exDividendDate: "2025-08-20",
    fillDays: null, fillRate: 55, earningsPayout: 40, capitalReservePct: 60,
    consecutiveYears: 12, isCapitalReserveAlert: true, marketCap: 380000
  },
]

// ─── ETF Holdings (Overlap Analysis) ─────────────────────────────────────────
export const ETF_HOLDINGS: ETFHolding[] = [
  // 0056
  { etfId: "0056", stockId: "2330", weight: 12.8 },
  { etfId: "0056", stockId: "2317", weight: 8.4 },
  { etfId: "0056", stockId: "2412", weight: 6.1 },
  { etfId: "0056", stockId: "2886", weight: 5.5 },
  { etfId: "0056", stockId: "6505", weight: 4.2 },
  // 00878
  { etfId: "00878", stockId: "2330", weight: 15.2 },
  { etfId: "00878", stockId: "2412", weight: 7.8 },
  { etfId: "00878", stockId: "2886", weight: 6.3 },
  { etfId: "00878", stockId: "2317", weight: 5.1 },
  // 00919
  { etfId: "00919", stockId: "2330", weight: 18.5 },
  { etfId: "00919", stockId: "2317", weight: 9.2 },
  { etfId: "00919", stockId: "2886", weight: 7.4 },
  { etfId: "00919", stockId: "6505", weight: 5.8 },
]

// ─── Chip (Institutional) Data ────────────────────────────────────────────────
export const CHIP_DATA: ChipData[] = [
  { stockId: "2330", foreign: 52400, trust: 8200, dealer: 1200, govFunds: 3100, topHolderPct: 58.2, topHolderChange: 0.8 },
  { stockId: "2317", foreign: -12000, trust: -3400, dealer: -500, govFunds: 800, topHolderPct: 42.1, topHolderChange: -1.2 },
  { stockId: "2412", foreign: 1200, trust: 300, dealer: 120, govFunds: 2100, topHolderPct: 65.4, topHolderChange: 0.2 },
  { stockId: "0056", foreign: 32000, trust: 14000, dealer: 2800, govFunds: 8000, topHolderPct: 45.8, topHolderChange: 1.4 },
  { stockId: "00878", foreign: 18000, trust: 22000, dealer: 1200, govFunds: 4200, topHolderPct: 38.2, topHolderChange: 2.1 },
  { stockId: "2886", foreign: 3200, trust: 1800, dealer: 400, govFunds: 5200, topHolderPct: 52.1, topHolderChange: -0.3 },
  { stockId: "6505", foreign: -8200, trust: -1200, dealer: -300, govFunds: 1200, topHolderPct: 39.8, topHolderChange: -2.1 },
]

// ─── Upcoming Dividend Events (next 12 months) ─────────────────────────────────
export const DIVIDEND_EVENTS: DividendEvent[] = [
  { stockId: "00919", stockName: "群益台灣精選高息", exDate: "2025-03-20", payDate: "2025-04-10", dividendPerShare: 0.5, estimatedAmount: 2500, nhiAlert: false },
  { stockId: "00878", stockName: "國泰永續高股息", exDate: "2025-03-23", payDate: "2025-04-17", dividendPerShare: 0.45, estimatedAmount: 4500, nhiAlert: false },
  { stockId: "2886", stockName: "兆豐金", exDate: "2025-07-08", payDate: "2025-07-30", dividendPerShare: 2.6, estimatedAmount: 26000, nhiAlert: true },
  { stockId: "2412", stockName: "中華電", exDate: "2025-07-03", payDate: "2025-07-28", dividendPerShare: 6.0, estimatedAmount: 12000, nhiAlert: false },
  { stockId: "2330", stockName: "台積電", exDate: "2025-07-17", payDate: "2025-08-05", dividendPerShare: 4.25, estimatedAmount: 42500, nhiAlert: true },
  { stockId: "2317", stockName: "鴻海", exDate: "2025-08-12", payDate: "2025-09-01", dividendPerShare: 9.0, estimatedAmount: 18000, nhiAlert: false },
  { stockId: "6505", stockName: "台塑化", exDate: "2025-08-20", payDate: "2025-09-10", dividendPerShare: 5.3, estimatedAmount: 10600, nhiAlert: false },
  { stockId: "0056", stockName: "元大高股息 ETF", exDate: "2025-10-22", payDate: "2025-11-10", dividendPerShare: 0.9, estimatedAmount: 27000, nhiAlert: true },
]

// ─── Shareholder Gifts ─────────────────────────────────────────────────────────
export const GIFTS: Gift[] = [
  { stockId: "2881", stockName: "富邦金", price: 98, giftValue: 500, giftDescription: "7-ELEVEN 禮品卡 $500", deadline: "2025-03-28", roi: 410, shareHolder: "1股" },
  { stockId: "2884", stockName: "玉山金", price: 35, giftValue: 200, giftDescription: "悠遊卡儲值 $200", deadline: "2025-04-01", roi: 471, shareHolder: "1股" },
  { stockId: "1216", stockName: "統一", price: 68, giftValue: 400, giftDescription: "統一商品卡 $400", deadline: "2025-04-10", roi: 488, shareHolder: "1股" },
  { stockId: "2912", stockName: "統一超", price: 290, giftValue: 300, giftDescription: "7-ELEVEN 購物金 $300", deadline: "2025-04-15", roi: -3, shareHolder: "1張" },
  { stockId: "2207", stockName: "和泰車", price: 850, giftValue: 1600, giftDescription: "Gogoro 換電序號 3個月", deadline: "2025-04-20", roi: 88, shareHolder: "1張" },
  { stockId: "6239", stockName: "力成", price: 155, giftValue: 200, giftDescription: "全家便利商店禮券 $200", deadline: "2025-05-01", roi: 29, shareHolder: "1股" },
]

// ─── AI Risk Scan ──────────────────────────────────────────────────────────────
export interface AIRiskSignal {
  stockId: string
  stockName: string
  riskLevel: "high" | "medium" | "low"
  toxicKeywords: string[]
  summary: string
  source: string
  date: string
}

export const AI_SIGNALS: AIRiskSignal[] = [
  {
    stockId: "2330", stockName: "台積電", riskLevel: "medium",
    toxicKeywords: ["庫存去化", "下修指引", "AI拉貨不如預期"],
    summary: "法說會提及部分產品線庫存去化速度低於預期，CoWoS 供給 Q3 可能出現瓶頸，但 AI 晶片需求維持強勁。",
    source: "Q3 2025 法說會", date: "2025-10-18"
  },
  {
    stockId: "2317", stockName: "鴻海", riskLevel: "high",
    toxicKeywords: ["毛利率下修", "產能利用率", "匯損擴大"],
    summary: "連續兩季毛利率下修至 5.8%，新台幣升值造成匯損擴大，印度廠產能利用率仍偏低。",
    source: "Q2 2025 財報", date: "2025-08-12"
  },
  {
    stockId: "6505", stockName: "台塑化", riskLevel: "high",
    toxicKeywords: ["庫存損失", "煉油虧損", "油價下跌"],
    summary: "原油大幅下跌造成庫存損失約 35 億元，煉油業務本季已轉為虧損，下季展望保守。",
    source: "Q1 2025 財報", date: "2025-05-10"
  },
  {
    stockId: "2412", stockName: "中華電", riskLevel: "low",
    toxicKeywords: [],
    summary: "財報穩健，現金流充沛，資本支出略增但可控。股利發放維持穩定已超過 20 年。",
    source: "H1 2025 財報", date: "2025-08-30"
  },
  {
    stockId: "00878", stockName: "國泰永續高股息", riskLevel: "low",
    toxicKeywords: [],
    summary: "ETF 分散風險良好，月配息機制受市場肯定，成分股調整符合 ESG 趨勢，持續吸引資金流入。",
    source: "2025 Q3 報告", date: "2025-10-01"
  },
]

// ─── Calculator helpers ────────────────────────────────────────────────────────
export function calcDRIP(
  principal: number,
  monthlyInvest: number,
  years: number,
  annualYield: number,
  drip: boolean
): { final: number; totalInvested: number; dividendEarned: number } {
  let holdings = principal
  let totalInvested = principal
  const monthlyRate = annualYield / 12 / 100
  let dividendEarned = 0
  for (let m = 0; m < years * 12; m++) {
    totalInvested += monthlyInvest
    holdings += monthlyInvest
    const monthlyDiv = holdings * monthlyRate
    dividendEarned += monthlyDiv
    if (drip) holdings += monthlyDiv
  }
  return { final: Math.round(holdings), totalInvested: Math.round(totalInvested), dividendEarned: Math.round(dividendEarned) }
}

export function calcNHITax(dividendAmount: number, taxBracket: number) {
  const NHI_RATE = 0.0211
  const NHI_THRESHOLD = 20000
  let nhiAmount = 0
  if (dividendAmount >= NHI_THRESHOLD) {
    nhiAmount = dividendAmount * NHI_RATE
  }
  const incomeTax = dividendAmount * (taxBracket / 100)
  return {
    nhiAmount: Math.round(nhiAmount),
    incomeTax: Math.round(incomeTax),
    netDividend: Math.round(dividendAmount - nhiAmount - incomeTax),
    splitStrategy: dividendAmount >= NHI_THRESHOLD
      ? `建議將持股拆分以使每次領息低於 NT$20,000，可省 NT$${Math.round(nhiAmount).toLocaleString()} 二代健保`
      : "目前金額未超過二代健保門檻"
  }
}
