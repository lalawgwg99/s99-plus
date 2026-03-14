// Shared AI scan signals — single source of truth
export interface AISignal {
  stockId: string
  stockName: string
  riskLevel: "high" | "medium" | "low"
  toxicKeywords: string[]
  summary: string
  source: string
  date: string
}

export const AI_SIGNALS: AISignal[] = [
  { stockId: "2330", stockName: "台積電", riskLevel: "medium", toxicKeywords: ["庫存去化", "下修指引"], summary: "法說會提及部分產品線庫存去化速度低於預期，但 AI 晶片需求維持強勁。", source: "Q3 2025 法說會", date: "2025-10-18" },
  { stockId: "2317", stockName: "鴻海", riskLevel: "high", toxicKeywords: ["毛利率下修", "匯損擴大"], summary: "連續兩季毛利率下修至 5.8%，新台幣升值造成匯損擴大。", source: "Q2 2025 財報", date: "2025-08-12" },
  { stockId: "6505", stockName: "台塑化", riskLevel: "high", toxicKeywords: ["庫存損失", "煉油虧損"], summary: "原油大幅下跌造成庫存損失約 35 億元，煉油業務轉虧。", source: "Q1 2025 財報", date: "2025-05-10" },
  { stockId: "2412", stockName: "中華電", riskLevel: "low", toxicKeywords: [], summary: "財報穩健，現金流充沛，股利發放維持穩定已超過 20 年。", source: "H1 2025 財報", date: "2025-08-30" },
]
