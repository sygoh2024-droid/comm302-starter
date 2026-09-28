import React from 'react';
import { Instrument } from '../types/market';
import { ChevronRight } from 'lucide-react';

interface IndexCardsProps {
  indices: Instrument[];
  selectedInstrumentId: string;
  onSelectInstrument: (instrument: Instrument) => void;
  onViewAllIndices: () => void;
  flashingTicker?: string | null;
}

export const IndexCards: React.FC<IndexCardsProps> = ({
  indices,
  selectedInstrumentId,
  onSelectInstrument,
  onViewAllIndices,
  flashingTicker,
}) => {
  return (
    <section>
      {/* Title Link */}
      <button
        onClick={onViewAllIndices}
        className="inline-flex items-center text-2xl sm:text-3xl font-extrabold text-[#131722] tracking-tight hover:underline mb-6 group cursor-pointer"
      >
        <span>Indices</span>
        <ChevronRight className="w-6 h-6 ml-1 transform group-hover:translate-x-1.5 transition-transform text-[#131722]" strokeWidth={2.5} />
      </button>

      {/* Major Indices Cards Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indices.map((item) => {
          const isSelected = selectedInstrumentId === item.id;
          const isPositive = item.changePercent >= 0;
          const isFlashing = flashingTicker === item.symbol;

          return (
            <div
              key={item.id}
              onClick={() => onSelectInstrument(item)}
              className={`rounded-[24px] p-4 flex items-center justify-between cursor-pointer border transition-all duration-200 select-none ${
                isSelected
                  ? 'bg-[#f0f3fa] border-[#e0e3eb] shadow-sm ring-1 ring-[#e0e3eb]'
                  : 'bg-white hover:bg-[#f0f3fa]/50 border-[#e0e3eb] hover:shadow-xs'
              } ${isFlashing ? (isPositive ? 'ring-2 ring-[#089981]/50 bg-emerald-50/40' : 'ring-2 ring-[#f23645]/50 bg-rose-50/40') : ''}`}
            >
              <div className="flex items-center space-x-3.5">
                {/* Number Badge */}
                <div
                  className="w-11 h-11 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0"
                  style={{ backgroundColor: item.badgeBgColor || '#333' }}
                >
                  {item.badgeText || item.symbol.slice(0, 3)}
                </div>

                <div>
                  <div className="font-bold text-[15px] text-[#131722] flex items-center gap-1.5">
                    {item.name}
                  </div>
                  <div className="text-xs text-[#787b86] flex items-center gap-1.5 font-medium mt-0.5">
                    <span className="font-semibold text-[#131722]">
                      {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`font-semibold ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Sparkline Mini SVG */}
              <div className="w-20 h-8 flex items-center shrink-0">
                <svg className="w-full h-full" viewBox="0 0 80 32" fill="none">
                  {item.sparkline && item.sparkline.length >= 2 ? (
                    <polyline
                      points={item.sparkline
                        .map((val, idx) => {
                          const x = 2 + (idx / (item.sparkline.length - 1)) * 76;
                          const y = 32 - ((val - Math.min(...item.sparkline)) / (Math.max(...item.sparkline) - Math.min(...item.sparkline) || 1)) * 26 - 3;
                          return `${x.toFixed(1)},${y.toFixed(1)}`;
                        })
                        .join(' ')}
                      stroke={isPositive ? '#089981' : '#f23645'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d={isPositive ? "M2 24 L 18 20 L 32 23 L 48 12 L 62 14 L 78 4" : "M2 6 L 22 10 L 40 8 L 55 18 L 68 15 L 78 24"}
                      stroke={isPositive ? '#089981' : '#f23645'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
