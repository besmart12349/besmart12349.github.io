
import React from 'react';

const MOCK_STOCKS = [
  { ticker: 'AAPL', name: 'Apple Inc.', price: 172.25, change: 2.52, changePercent: 1.48 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 2835.47, change: -12.88, changePercent: -0.45 },
  { ticker: 'MSFT', name: 'Microsoft Corp.', price: 305.22, change: 1.01, changePercent: 0.33 },
  { ticker: 'AMZN', name: 'Amazon.com, Inc.', price: 3304.14, change: -21.45, changePercent: -0.64 },
  { ticker: 'TSLA', name: 'Tesla, Inc.', price: 909.68, change: 31.91, changePercent: 3.63 },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', price: 226.96, change: 7.82, changePercent: 3.57 },
];

const Stocks: React.FC = () => {
  return (
    <div className="w-full h-full bg-gray-900 text-white p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">My Watchlist</h1>
      <ul>
        {MOCK_STOCKS.map(stock => {
          const isPositive = stock.change >= 0;
          return (
            <li key={stock.ticker} className="flex justify-between items-center py-3 border-b border-gray-800 last:border-b-0">
              <div>
                <p className="font-bold text-lg">{stock.ticker}</p>
                <p className="text-sm text-gray-400 truncate">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">${stock.price.toFixed(2)}</p>
                <span className={`px-2 py-1 rounded-md text-sm ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Stocks;
