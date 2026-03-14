# StockMoat v2 Redesign Spec

## 1. Navigation: 8 Pages → 4 Tabs

Consolidate into a unified bottom tab bar (works on both mobile and desktop):

```
Tab 1: 首頁 (Home)      → /           Market overview + AI scanner + portfolio summary
Tab 2: 探索 (Explore)   → /explore    Stock search + K-line + chip flow + dividends (all-in-one)
Tab 3: 投資 (Portfolio) → /portfolio  ETF X-Ray + DCA calculator + NHI tax minimizer
Tab 4: 更多 (More)      → /more       AGM gifts ROI + Settings + dark mode toggle
```

### Layout Changes:
- **Remove** the sidebar (`<aside>` in layout.tsx) completely
- **Remove** the separate mobile bottom nav (it has 8 items, too many)
- Add a unified `TabBar` component with 4 tabs, fixed bottom on all screen sizes
- Add `TabBar` height padding to main content (`pb-20` mobile, `pb-6` desktop)
- Desktop: show TabBar at bottom centered with max-width, or keep at bottom full-width
- Header: sticky top bar with page title + search icon + dark mode toggle

### Routes to DELETE (merge into above):
- `/chips` → merge into `/explore` as a tab/section
- `/dividends` → merge into `/explore` or `/portfolio`
- `/etf` → merge into `/portfolio`
- `/gifts` → merge into `/more`
- `/dca` → merge into `/portfolio`
- `/ai` → merge into `/home`

## 2. Visual: Replace CSS Bar Chart with lightweight-charts

### Install:
```bash
npm install lightweight-charts
```

### Create `src/components/KLineChart.tsx`:
- Client component wrapping `lightweight-charts`
- Props: `data: DailyPrice[]`
- Features:
  - Candlestick series (green up / red down)
  - Volume bars at bottom
  - 20-day MA line overlay
  - Responsive: resize with container
  - Dark mode support (chart colors adapt)
  - Tooltip on hover showing OHLCV
- Replace the CSS bar chart in `/stocks/page.tsx` with this component

## 3. Data Layer Refactor

### 3a. Add Server Components (RSC)
- `page.tsx` for each route should be a Server Component by default
- Only add `"use client"` to interactive components (search, charts, calculators)
- Wrap client components in `Suspense` with skeleton fallbacks

### 3b. Add Loading Skeletons
Create `src/components/Skeleton.tsx`:
```tsx
export function StockCardSkeleton() { ... }
export function ChartSkeleton() { ... }
export function TableSkeleton() { ... }
```
Use in each page's loading.tsx

### 3c. Cache Layer
Create `src/lib/cache.ts`:
```ts
const cache = new Map<string, { data: any; expiry: number }>()

export function getCached<T>(key: string): T | null { ... }
export function setCache<T>(key: string, data: T, ttlMs: number) { ... }
```
Wrap FinMind API calls in api.ts with 5-minute TTL cache.

### 3d. Delete `src/lib/data.ts`
All mock data must be removed. All data comes from FinMind API or TWSE API.
Replace any import from `data.ts` with actual API calls.

## 4. UI/UX Enhancements

### 4a. Dark Mode Toggle
- Add a toggle button in the header (sun/moon icon from lucide-react)
- Store preference in `localStorage`
- Apply `.dark` class to `<html>` element
- The CSS variables in globals.css already support dark mode

### 4b. iOS-style Search Sheet
- When user taps search icon in header, show a full-screen overlay (like iOS Spotlight)
- Blur background, search input at top, results below
- Dismiss with swipe down or X button
- Create `src/components/SearchSheet.tsx`

### 4c. Haptic Feedback
- Add `onClick={() => navigator.vibrate?.(10)}` to primary buttons

### 4d. Micro-interactions
- Cards: `transition-all duration-200 hover:shadow-lg hover:scale-[1.01]`
- List items: `active:bg-secondary/60` (already partially done)
- Tab bar: animate indicator sliding between tabs

## 5. Portfolio Summary (Home Page)

Replace the placeholder pie chart with a real `recharts` PieChart:
```bash
npm install recharts
```

Create `src/components/PortfolioPie.tsx`:
- Show allocation by stock/ETF
- Color-coded segments
- Legend with percentage labels
- Dark mode compatible colors

## 6. File Structure (target)

```
src/
├── app/
│   ├── layout.tsx          # Root layout with TabBar
│   ├── page.tsx            # Home: market + AI + portfolio (RSC)
│   ├── explore/
│   │   ├── page.tsx        # Stock search (RSC wrapper)
│   │   └── loading.tsx     # Skeleton
│   ├── portfolio/
│   │   ├── page.tsx        # ETF + DCA + Tax (RSC wrapper)
│   │   └── loading.tsx
│   ├── more/
│   │   ├── page.tsx        # Gifts + Settings
│   │   └── loading.tsx
│   └── globals.css         # Keep existing (already HIG-compliant)
├── components/
│   ├── TabBar.tsx          # 4-tab bottom navigation
│   ├── KLineChart.tsx      # lightweight-charts wrapper
│   ├── PortfolioPie.tsx    # recharts PieChart
│   ├── SearchSheet.tsx     # iOS-style search overlay
│   ├── Skeleton.tsx        # Loading skeletons
│   ├── ChipHeatmap.tsx     # Institutional flow heatmap
│   ├── DCACalculator.tsx   # DCA/DRIP calculator (client)
│   ├── TaxMinimizer.tsx    # NHI tax calculator (client)
│   ├── StockDetail.tsx     # Stock detail panel (client)
│   ├── ETFXRay.tsx         # ETF overlap analysis
│   └── ui/                 # Keep existing shadcn components
├── hooks/
│   ├── useStock.ts         # Stock data fetching hook
│   └── useDarkMode.ts      # Dark mode toggle hook
├── lib/
│   ├── api.ts              # FinMind + TWSE API (add caching)
│   ├── cache.ts            # TTL cache utility
│   └── utils.ts            # Keep existing
```

## 7. Implementation Order

1. **Phase 1: Structure** - New layout + TabBar + route consolidation
2. **Phase 2: Visual** - KLineChart + PortfolioPie + Skeletons
3. **Phase 3: Data** - Delete data.ts, add cache, RSC optimization
4. **Phase 4: Polish** - Dark mode toggle, SearchSheet, haptic, animations

## 8. Constraints

- Keep all existing shadcn/ui components (badge, button, card, input, table)
- Keep `tailwindcss` v4 and `@tailwindcss/postcss` setup
- Keep `components.json` for shadcn
- Keep `docker-compose.yml` and `sql/init.sql` unchanged
- Keep `pipelines/` Python scripts unchanged
- Font: Keep using `-apple-system` / SF Pro (already in globals.css)
- Colors: Keep existing iOS HSL color tokens (already in globals.css)
- No new dependencies beyond: `lightweight-charts`, `recharts`
- Must work with `npm run dev` after changes
