import React, { useState } from 'react';
import { ActiveStock } from '../types/market';
import { X, Search, ArrowUpDown, Filter, Download } from 'lucide-react';

interface ScreenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: ActiveStock[];
  onSelectStock: (stock: ActiveStock) => void;
}

export const ScreenerModal: React.FC<ScreenerModalProps> = ({
  isOpen,
  onClose,
  stocks,
  onSelectStock,
}) => {
  const [filterSector, setFilterSector] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'changePercent' | 'volume'>('volume');
  const [sortAsc, setSortAsc] = useState(false);

  if (!isOpen) return null;

  const sectors = ['All', 'Semiconductors', 'Consumer Electronics', 'Automotive', 'Software Infrastructure', 'Internet Retail', 'Internet Content'];

  const filtered = stocks
    .filter((s) => {
      const matchesSector = filterSector === 'All' || s.sector === filterSector;
      const matchesSearch = s.ticker.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase());
      return matchesSector && matchesSearch;
    })
    .sort((a, b) => {
      const factor = sortAsc ? 1 : -1;
      if (sortBy === 'price') return (a.price - b.price) * factor;
      if (sortBy === 'changePercent') return (a.changePercent - b.changePercent) * factor;
      // parse volume for comparison
      const volA = parseFloat(a.volume) || 0;
      const volB = parseFloat(b.volume) || 0;
      return (volA - volB) * factor;
    });

  const handleExportCSV = () => {
    const headers = ['Ticker', 'Name', 'Sector', 'Price', 'Chg %', 'Volume', 'Market Cap', 'P/E'];
    const rows = filtered.map((s) => [s.ticker, s.name, s.sector, s.price, s.changePercent, s.volume, s.marketCap, s.pe]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'tradingview_stocks_screener.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl w-full max-w-4xl border border-[#e0e3eb] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e0e3eb] flex items-center justify-between bg-[#f8f9fd]">
          <div>
            <h2 className="text-xl font-extrabold text-[#131722] tracking-tight">
              US Stocks Screener
            </h2>
            <p className="text-xs text-[#787b86]">Filter by performance, technicals, and valuation</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e0e3eb] bg-white text-xs font-semibold text-[#131722] hover:bg-[#f0f3fa] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#787b86] hover:text-[#131722] hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 border-b border-[#e0e3eb] flex flex-wrap items-center gap-3 bg-white">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#787b86]" />
            <input
              type="text"
              placeholder="Search ticker or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#f0f3fa] pl-9 pr-3 py-1.5 text-xs font-medium text-[#131722] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2962ff]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-semibold text-[#787b86] mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Sector:
            </span>
            {sectors.slice(0, 5).map((sec) => (
              <button
                key={sec}
                onClick={() => setFilterSector(sec)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  filterSector === sec
                    ? 'bg-[#131722] text-white'
                    : 'bg-[#f0f3fa] text-[#787b86] hover:text-[#131722]'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Screener Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-[#f8f9fd] border-b border-[#e0e3eb] z-10">
              <tr className="text-[#787b86] font-semibold">
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Sector</th>
                <th 
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#131722]"
                  onClick={() => {
                    if (sortBy === 'price') setSortAsc(!sortAsc);
                    else { setSortBy('price'); setSortAsc(false); }
                  }}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#131722]"
                  onClick={() => {
                    if (sortBy === 'changePercent') setSortAsc(!sortAsc);
                    else { setSortBy('changePercent'); setSortAsc(false); }
                  }}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Chg %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#131722]"
                  onClick={() => {
                    if (sortBy === 'volume') setSortAsc(!sortAsc);
                    else { setSortBy('volume'); setSortAsc(false); }
                  }}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Volume</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Market Cap</th>
                <th className="py-3 px-4 text-right">P/E</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e3eb]">
              {filtered.map((stock) => {
                const isPos = stock.changePercent >= 0;
                return (
                  <tr
                    key={stock.ticker}
                    onClick={() => {
                      onSelectStock(stock);
                      onClose();
                    }}
                    className="hover:bg-[#f0f3fa]/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 flex items-center space-x-2.5">
                      <div className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs ${stock.logoBg} ${stock.logoColor}`}>
                        {stock.logoText}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#131722] hover:text-[#2962ff]">{stock.ticker}</div>
                        <div className="text-[11px] text-[#787b86]">{stock.name}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-medium">{stock.sector}</td>
                    <td className="py-3 px-4 text-right font-bold text-[#131722]">${stock.price.toFixed(2)}</td>
                    <td className={`py-3 px-4 text-right font-bold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600 font-medium">{stock.volume}</td>
                    <td className="py-3 px-4 text-right text-gray-600 font-medium">{stock.marketCap}</td>
                    <td className="py-3 px-4 text-right text-gray-600 font-medium">{stock.pe}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-[#f8f9fd] border-t border-[#e0e3eb] text-center text-xs text-[#787b86]">
          Click any stock row to view its real-time chart and indicators.
        </div>
      </div>
    </div>
  );
};
