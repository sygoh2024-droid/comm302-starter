import React from 'react';
import { QuickTicker } from '../types/market';

interface CryptoCurrencyStripProps {
  items: QuickTicker[];
  onSelectItem: (item: QuickTicker) => void;
  flashingTicker?: string | null;
}

export const CryptoCurrencyStrip: React.FC<CryptoCurrencyStripProps> = ({
  items,
  onSelectItem,
  flashingTicker,
}) => {
  return (
    <section className="bg-[#f8f9fd] border border-[#e0e3eb] rounded-2xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold tracking-tight text-[#131722] uppercase">
          Crypto Leaders &amp; Currencies
        </h3>
        <span className="text-xs text-[#787b86] font-medium">24h volume basis</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const isPositive = item.changePercent >= 0;
          const isFlashing = flashingTicker === item.symbol;

          return (
            <div
              key={item.symbol}
              onClick={() => onSelectItem(item)}
              className={`bg-white p-3.5 rounded-xl border border-[#e0e3eb] hover:border-[#2962ff]/40 hover:shadow-xs cursor-pointer transition-all duration-150 select-none ${
                isFlashing ? (isPositive ? 'ring-2 ring-[#089981]/50 bg-emerald-50/30' : 'ring-2 ring-[#f23645]/50 bg-rose-50/30') : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#131722]">{item.symbol}</span>
                <span
                  className={`text-xs font-semibold ${
                    isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                </span>
              </div>
              <div className="text-lg font-extrabold text-[#131722] mt-1 tracking-tight">
                {item.price}
              </div>
              <div className="text-[11px] text-[#787b86] font-medium mt-0.5">
                {item.name}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
