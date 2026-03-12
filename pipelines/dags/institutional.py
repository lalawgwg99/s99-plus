import requests
import pandas as pd
from datetime import date
from sqlalchemy import create_engine

# TWSE Institutional Trades Crawler

def fetch_institutional_trades(trade_date: date):
    """Fetch Institutional Trades from TWSE and insert into DB"""
    url = f"https://www.twse.com.tw/rwd/zh/fund/T86"
    params = {
        "date": trade_date.strftime("%Y%m%d"),
        "selectType": "ALLBUT0999",
        "response": "json"
    }
    
    try:
        resp = requests.get(url, params=params, timeout=10)
        data = resp.json()
        
        if data.get("stat") != "OK":
            print(f"TWSE API Error/No Data: {data.get('stat')}")
            return 0
        
        df = pd.DataFrame(data["data"], columns=data["fields"])
        
        # Clean: remove commas and convert to float
        numeric_cols = df.columns[1:]
        for col in numeric_cols:
            df[col] = df[col].str.replace(",", "").astype(float)
            
        print(f"Fetched {len(df)} records for {trade_date}")
        
        # Database Insertion Layer (Mocked DB Engine)
        # engine = create_engine("postgresql://root:rootpassword@localhost:5432/stockmoat")
        # df.to_sql("institutional_trades", engine, if_exists="append", index=False)
        
        return len(df)
        
    except Exception as e:
        print(f"Crawl failed: {e}")
        return 0

if __name__ == "__main__":
    today = date.today()
    fetch_institutional_trades(today)
