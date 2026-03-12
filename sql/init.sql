CREATE TABLE stocks (
    stock_id VARCHAR(10) PRIMARY KEY,
    stock_name VARCHAR(50) NOT NULL,
    market_type VARCHAR(10), -- TWSE / TPEx
    industry VARCHAR(30),
    capital BIGINT,
    is_etf BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE daily_prices (
    id SERIAL PRIMARY KEY,
    stock_id VARCHAR(10) REFERENCES stocks(stock_id),
    trade_date DATE NOT NULL,
    open_price DECIMAL(10,2),
    high_price DECIMAL(10,2),
    low_price DECIMAL(10,2),
    close_price DECIMAL(10,2),
    volume BIGINT,
    turnover BIGINT,
    UNIQUE(stock_id, trade_date)
);

CREATE TABLE institutional_trades (
    id SERIAL PRIMARY KEY,
    stock_id VARCHAR(10) REFERENCES stocks(stock_id),
    trade_date DATE NOT NULL,
    foreign_buy BIGINT,
    foreign_sell BIGINT,
    foreign_net BIGINT,
    trust_net BIGINT,
    dealer_net BIGINT,
    UNIQUE(stock_id, trade_date)
);

CREATE TABLE margin_trading (
    id SERIAL PRIMARY KEY,
    stock_id VARCHAR(10) REFERENCES stocks(stock_id),
    trade_date DATE NOT NULL,
    margin_buy BIGINT,
    margin_sell BIGINT,
    margin_balance BIGINT,
    short_balance BIGINT,
    UNIQUE(stock_id, trade_date)
);

CREATE TABLE monthly_revenue (
    id SERIAL PRIMARY KEY,
    stock_id VARCHAR(10) REFERENCES stocks(stock_id),
    year_month DATE NOT NULL,
    revenue BIGINT,
    mom_change DECIMAL(8,4),
    yoy_change DECIMAL(8,4),
    accumulated_rev BIGINT,
    UNIQUE(stock_id, year_month)
);

CREATE TABLE financials (
    id SERIAL PRIMARY KEY,
    stock_id VARCHAR(10) REFERENCES stocks(stock_id),
    year SMALLINT NOT NULL,
    quarter SMALLINT NOT NULL,
    revenue BIGINT,
    gross_margin DECIMAL(6,2),
    operating_income BIGINT,
    net_income BIGINT,
    eps DECIMAL(8,2),
    free_cash_flow BIGINT,
    UNIQUE(stock_id, year, quarter)
);

CREATE TABLE dividends (
    id SERIAL PRIMARY KEY,
    stock_id VARCHAR(10) REFERENCES stocks(stock_id),
    year SMALLINT NOT NULL,
    cash_dividend DECIMAL(8,4),
    stock_dividend DECIMAL(8,4),
    capital_reserve_div DECIMAL(8,4),
    ex_dividend_date DATE,
    payment_date DATE,
    fill_gap_days SMALLINT,
    yield_rate DECIMAL(5,2),
    UNIQUE(stock_id, year)
);

CREATE TABLE etf_components (
    id SERIAL PRIMARY KEY,
    etf_id VARCHAR(10) REFERENCES stocks(stock_id),
    component_id VARCHAR(10) REFERENCES stocks(stock_id),
    weight_pct DECIMAL(6,3),
    report_date DATE NOT NULL,
    UNIQUE(etf_id, component_id, report_date)
);

CREATE TABLE ai_risk_alerts (
    id SERIAL PRIMARY KEY,
    stock_id VARCHAR(10) REFERENCES stocks(stock_id),
    alert_date DATE DEFAULT CURRENT_DATE,
    source_type VARCHAR(20), -- 'financial' or 'news' or 'conference'
    risk_level VARCHAR(10), -- HIGH, MED, LOW
    summary TEXT,
    UNIQUE(stock_id, alert_date, source_type)
);

CREATE TABLE agm_gifts (
    id SERIAL PRIMARY KEY,
    stock_id VARCHAR(10) REFERENCES stocks(stock_id),
    year SMALLINT NOT NULL,
    gift_name VARCHAR(100),
    gift_value_est DECIMAL(8,2),
    agm_date DATE,
    last_buy_date DATE,
    e_vote_required BOOLEAN,
    roi_pct DECIMAL(8,2),
    UNIQUE(stock_id, year)
);

CREATE TABLE user_portfolio (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    stock_id VARCHAR(10) REFERENCES stocks(stock_id),
    shares DECIMAL(10,4),
    avg_cost DECIMAL(10,2),
    buy_date DATE,
    is_dca BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
