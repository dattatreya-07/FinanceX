import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  theme?: 'dark' | 'light';
  interval?: string;
  autosize?: boolean;
  height?: number | string;
}

export const TradingViewWidget: React.FC<TradingViewWidgetProps> = memo(({
  symbol,
  theme = 'dark',
  interval = 'D',
  autosize = true,
  height = 520
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Map local symbols to official TradingView exchange tickers
  const getTradingViewSymbol = (sym: string): string => {
    const s = sym.toUpperCase().trim();
    const map: Record<string, string> = {
      'NIFTY 50': 'NSE:NIFTY',
      'NIFTY': 'NSE:NIFTY',
      'SENSEX': 'BSE:SENSEX',
      'BANK NIFTY': 'NSE:BANKNIFTY',
      'BANKNIFTY': 'NSE:BANKNIFTY',
      'RELIANCE': 'NSE:RELIANCE',
      'TCS': 'NSE:TCS',
      'HDFCBANK': 'NSE:HDFCBANK',
      'INFY': 'NSE:INFY',
      'TATAMOTORS': 'NSE:TATAMOTORS',
      'USD/INR': 'FX_IDC:USDINR',
      'USDINR': 'FX_IDC:USDINR',
      'GOLD': 'MCX:GOLD1!',
      'CRUDE OIL': 'MCX:CRUDEOIL1!',
      'CRUDE': 'MCX:CRUDEOIL1!',
      'BTC': 'BINANCE:BTCUSDT',
      'BTC/USD': 'BINANCE:BTCUSDT',
      'NASDAQ': 'NASDAQ:NDX'
    };

    if (map[s]) return map[s];
    if (s.includes(':')) return s;
    return `NSE:${s}`;
  };

  const tvSymbol = getTradingViewSymbol(symbol);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous contents
    containerRef.current.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';
    widgetContainer.style.height = typeof height === 'number' ? `${height}px` : height;
    widgetContainer.style.width = '100%';
    containerRef.current.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: autosize,
      symbol: tvSymbol,
      interval: interval,
      timezone: 'Asia/Kolkata',
      theme: theme === 'dark' ? 'dark' : 'light',
      style: '1', // Candlesticks
      locale: 'in',
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      hide_side_toolbar: false,
      withdateranges: true,
      studies: [
        'STD;SMA',
        'STD;RSI',
        'STD;MACD'
      ],
      support_host: 'https://www.tradingview.com'
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [tvSymbol, theme, interval, autosize, height]);

  return (
    <div 
      className="tradingview-widget-container w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060911] shadow-inner" 
      ref={containerRef}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    />
  );
});

TradingViewWidget.displayName = 'TradingViewWidget';
