# StockMoat

A smart stock health check and portfolio analyzer prioritizing an **Apple Native** design language, complete with AI risk scanners, ETF overlap warnings, and optimized dividend tracking.

## Phase 1 Architecture

### 1. Frontend (Next.js 14 App Router)
- Designed with **Tailwind CSS + shadcn/ui**.
- Aesthetics strictly follow **Apple Human Interface Guidelines (HIG)**: SF Pro Typography, Translucency (`backdrop-blur`), System Colors, and native-feeling interactions.
- Ensure to use Native Apple SVG icons or deeply integrated lucide-react equivalents.

### 2. Backend & Data Pipeline
- Data stored in **PostgreSQL 15** via Docker. 
- Python crawler scripts (`pipelines/dags/`) for fetching TWSE Trade data and FinMind historical data. These can be executed via cron or Airflow.

## Quick Start

1. Start the UI:
```bash
npm install
npm run dev
```

2. Start the Database:
```bash
docker compose up -d
```

3. Initialize Data Pipeline
```bash
python pipelines/dags/institutional.py
python pipelines/dags/finmind_history.py
```

## Upcoming (Phase 2 & Beyond)
- Individual Stock Page (K-line charts)
- Institutional Chip Flow Heatmaps
- 2nd Gen NHI Strategy / Tax Minimizer
- PDF Smart Analyzer
