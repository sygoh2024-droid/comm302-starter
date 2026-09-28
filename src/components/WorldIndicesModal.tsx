import React from 'react';
import { WorldIndex } from '../types/market';
import { X, Globe } from 'lucide-react';

interface WorldIndicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  worldIndices: WorldIndex[];
  onSelectIndex: (index: WorldIndex) => void;
}

export const WorldIndicesModal: React.FC<WorldIndicesModalProps> = ({
  isOpen,
  onClose,
  worldIndices,
  onSelectIndex,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl w-full max-w-3xl border border-[#e0e3eb] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-[#e0e3eb] flex items-center justify-between bg-[#f8f9fd]">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#2962ff]" />
            <div>
              <h2 className="text-xl font-extrabold text-[#131722] tracking-tight">
                Global Stock Indices
              </h2>
              <p className="text-xs text-[#787b86]">Track major regional benchmarks across Europe, Asia, and Americas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#787b86] hover:text-[#131722] hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-[#f8f9fd] border-b border-[#e0e3eb]">
              <tr className="text-[#787b86] font-semibold">
                <th className="py-3 px-4">Index / Country</th>
                <th className="py-3 px-4 text-right">Last Price</th>
                <th className="py-3 px-4 text-right">Change %</th>
                <th className="py-3 px-4 text-right">Points Trend</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e3eb] font-medium">
              {worldIndices.map((idx) => {
                const isPos = idx.isPositive;
                return (
                  <tr
                    key={idx.symbol}
                    onClick={() => {
                      onSelectIndex(idx);
                      onClose();
                    }}
                    className="hover:bg-[#f0f3fa]/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${idx.countryBg} ${idx.countryTextColor}`}>
                        {idx.countryCode}
                      </span>
                      <div>
                        <div className="font-bold text-sm text-[#131722]">{idx.symbol}</div>
                        <div className="text-[11px] text-[#787b86]">{idx.name}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#131722]">
                      {idx.last.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className={`py-3.5 px-4 text-right font-bold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isPos ? '+' : ''}{idx.changePercent.toFixed(2)}%
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`inline-block font-mono font-bold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isPos ? '↗ +' : '↘ '}{Math.abs(idx.trendValue).toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-xs font-semibold text-[#2962ff] hover:underline">
                        Open Chart →
                      </span>
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
