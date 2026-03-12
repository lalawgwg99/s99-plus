import requests
import pandas as pd
from datetime import date

# FinMind Historical Data Fetcher

def fetch_finmind_monthly_revenue(stock_id: str, start_date: str):
    """Fetch Monthly Revenue via FinMind Open API"""
    url = "https://api.finmindtrade.com/api/v4/data"
    params = {
        "dataset": "TaiwanStockMonthRevenue",
        "data_id": stock_id,
        "start_date": start_date
    }
    
    try:
        resp = requests.get(url, params=params, timeout=10)
        data = resp.json()
        
        if data.get("msg") != "success":
            print(f"FinMind API error: {data.get('msg')}")
            return 0
            
        df = pd.DataFrame(data["data"])
        print(f"Fetched {len(df)} monthly revenue records for {stock_id} from FinMind.")
        
        # Insert to DB (mocked for now)
        # df.to_sql("monthly_revenue", engine, if_exists="append", index=False)
        
        return len(df)
    
    except Exception as e:
        print(f"FinMind fetch failed: {e}")
        return 0

if __name__ == "__main__":
    fetch_finmind_monthly_revenue("2330", "2023-01-01")
