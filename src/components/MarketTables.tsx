import React from 'react';
import { WorldIndex, ActiveStock, Instrument } from '../types/market';

interface MarketTablesProps {
  worldIndices: WorldIndex[];
  activeStocks: ActiveStock[];
  onSelectStock: (stock: ActiveStock) => void;
  onSelectWorldIndex: (index: WorldIndex) => void;
  onOpenScreener: () => void;
  onOpenWorldIndicesModal: () => void;
  flashingTicker?: string | null;
}

export const MarketTables: React.FC<MarketTablesProps> = ({
  worldIndices,
  activeStocks,
  onSelectStock,
  onSelectWorldIndex,
  onOpenScreener,
  onOpenWorldIndicesModal,
  flashingTicker,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Table 1: World Markets */}
      <div className="bg-white rounded-2xl border border-[#e0e3eb] p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-lg font-bold text-[#131722]">World stock indices</h2>
          <button
            onClick={onOpenWorldIndicesModal}
            className="text-xs font-semibold text-[#2962ff] hover:underline cursor-pointer"
          >
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#787b86] border-b border-[#e0e3eb] font-medium">
                <th className="pb-2.5 font-semibold">Symbol</th>
                <th className="pb-2.5 text-right font-semibold">Last</th>
                <th className="pb-2.5 text-right font-semibold">Chg %</th>
                <th className="pb-2.5 text-right font-semibold">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e3eb] font-medium">
              {worldIndices.slice(0, 5).map((row) => {
                const isPositive = row.isPositive;
                const isFlashing = flashingTicker === row.symbol;

                return (
                  <tr
                    key={row.symbol}
                    onClick={() => onSelectWorldIndex(row)}
                    className={`hover:bg-[#f0f3fa]/70 cursor-pointer transition-colors ${
                      isFlashing ? (isPositive ? 'bg-emerald-50/70' : 'bg-rose-50/70') : ''
                    }`}
                  >
                    <td className="py-3 flex items-center space-x-2.5">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${row.countryBg} ${row.countryTextColor}`}
                      >
                        {row.countryCode}
                      </span>
                      <div>
                        <div className="font-bold text-[#131722]">{row.symbol}</div>
                        <div className="text-[11px] text-[#787b86]">{row.name}</div>
                      </div>
                    </td>
                    <td className="py-3 text-right font-semibold text-[#131722]">
                      {row.last.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td
                      className={`py-3 text-right font-semibold ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}{row.changePercent.toFixed(2)}%
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`inline-block font-mono text-xs font-semibold ${
                          isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPositive ? '↗ +' : '↘ '}{Math.abs(row.trendValue).toFixed(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: US High Volume Stocks */}
      <div className="bg-white rounded-2xl border border-[#e0e3eb] p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-lg font-bold text-[#131722]">Most active US stocks</h2>
          <button
            onClick={onOpenScreener}
            className="text-xs font-semibold text-[#2962ff] hover:underline cursor-pointer"
          >
            Screener
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#787b86] border-b border-[#e0e3eb] font-medium">
                <th className="pb-2.5 font-semibold">Ticker</th>
                <th className="pb-2.5 text-right font-semibold">Price</th>
                <th className="pb-2.5 text-right font-semibold">Chg %</th>
                <th className="pb-2.5 text-right font-semibold">Vol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e3eb] font-medium">
              {activeStocks.slice(0, 5).map((stock) => {
                const isPositive = stock.changePercent >= 0;
                const isFlashing = flashingTicker === stock.ticker;

                return (
                  <tr
                    key={stock.ticker}
                    onClick={() => onSelectStock(stock)}
                    className={`hover:bg-[#f0f3fa]/70 cursor-pointer transition-colors ${
                      isFlashing ? (isPositive ? 'bg-emerald-50/70' : 'bg-rose-50/70') : ''
                    }`}
                  >
                    <td className="py-3 flex items-center space-x-2.5">
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center font-black text-[9px] shadow-2xs ${stock.logoBg} ${stock.logoColor}`}
                      >
                        {stock.logoText}
                      </div>
                      <div>
                        <div className="font-bold text-[#131722]">{stock.ticker}</div>
                        <div className="text-[11px] text-[#787b86]">{stock.name}</div>
                      </div>
                    </td>
                    <td className="py-3 text-right font-semibold text-[#131722]">
                      ${stock.price.toFixed(2)}
                    </td>
                    <td
                      className={`py-3 text-right font-semibold ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </td>
                    <td className="py-3 text-right text-[#787b86] font-medium">
                      {stock.volume}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
