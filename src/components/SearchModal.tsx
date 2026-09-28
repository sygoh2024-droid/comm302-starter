import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, DollarSign, Globe, Layers, ArrowUpRight } from 'lucide-react';
import { Instrument } from '../types/market';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectInstrument: (symbol: string, name: string) => void;
  availableItems: { symbol: string; name: string; type: string; price: string; changePercent: number }[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectInstrument,
  availableItems,
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Stocks' | 'Indices' | 'Crypto' | 'Forex'>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = availableItems.filter((item) => {
    const matchesTab = activeTab === 'All' || item.type.toLowerCase().includes(activeTab.toLowerCase().slice(0, 4));
    const matchesQuery = item.symbol.toLowerCase().includes(query.toLowerCase()) ||
      item.name.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl border border-[#e0e3eb] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#e0e3eb] flex items-center gap-3 bg-[#f8f9fd]">
          <Search className="w-5 h-5 text-[#2962ff] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company, currency or crypto..."
            className="w-full bg-transparent text-sm sm:text-base font-semibold text-[#131722] placeholder-[#787b86] focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-[#787b86] bg-white border border-[#e0e3eb] rounded shadow-2xs">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#787b86] hover:text-[#131722] hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-[#e0e3eb] flex items-center gap-2 overflow-x-auto no-scrollbar bg-white">
          {(['All', 'Stocks', 'Indices', 'Crypto', 'Forex'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#131722] text-white'
                  : 'bg-[#f0f3fa] text-[#787b86] hover:text-[#131722]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#f0f3fa] p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#787b86] text-sm">
              No matching symbols found for "<span className="font-semibold text-[#131722]">{query}</span>"
            </div>
          ) : (
            filtered.map((item) => {
              const isPositive = item.changePercent >= 0;
              return (
                <div
                  key={item.symbol}
                  onClick={() => {
                    onSelectInstrument(item.symbol, item.name);
                    onClose();
                  }}
                  className="p-3 hover:bg-[#f0f3fa] rounded-xl cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f0f3fa] group-hover:bg-white text-[#131722] font-bold text-xs flex items-center justify-center border border-[#e0e3eb]">
                      {item.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff]">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-gray-100 text-[#787b86]">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-xs text-[#787b86] truncate max-w-xs sm:max-w-md">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-xs text-[#131722]">{item.price}</div>
                    <div
                      className={`text-[11px] font-semibold ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 bg-[#f8f9fd] border-t border-[#e0e3eb] text-center text-[11px] text-[#787b86]">
          Tip: Press <span className="font-semibold">Ctrl+K</span> anytime to search symbols
        </div>
      </div>
    </div>
  );
};
