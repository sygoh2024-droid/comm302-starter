import React, { useState, useRef } from 'react';
import { Instrument, Timeframe, ChartPoint } from '../types/market';
import { ArrowRight, BarChart2, TrendingUp, Maximize2 } from 'lucide-react';

interface InteractiveChartProps {
  instrument: Instrument;
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  onOpenSupercharts: () => void;
}

const TIMEFRAMES: Timeframe[] = ['1D', '5D', '1M', '6M', 'YTD', '1Y', 'ALL'];

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  instrument,
  timeframe,
  onTimeframeChange,
  onOpenSupercharts,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const points: ChartPoint[] = instrument.chartData[timeframe] || [];
  const isPositive = instrument.changePercent >= 0;

  // Chart dimensions & scaling
  const width = 900;
  const height = 220;
  const paddingBottom = 20;
  const paddingTop = 15;

  const prices = points.map((p) => p.price);
  const minPrice = Math.min(...prices, instrument.low);
  const maxPrice = Math.max(...prices, instrument.high);
  const priceRange = maxPrice - minPrice || 1;

  // Compute coordinates
  const coords = points.map((p, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = paddingTop + (1 - (p.price - minPrice) / priceRange) * (height - paddingTop - paddingBottom);
    return { x, y, point: p };
  });

  // Build SVG path
  let pathD = '';
  if (coords.length > 0) {
    pathD = `M ${coords[0].x.toFixed(1)},${coords[0].y.toFixed(1)}`;
    for (let i = 1; i < coords.length; i++) {
      // Smooth cubic bezier
      const prev = coords[i - 1];
      const curr = coords[i];
      const cp1x = prev.x + (curr.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) / 2;
      const cp2y = curr.y;
      pathD += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${curr.x.toFixed(1)},${curr.y.toFixed(1)}`;
    }
  }

  const fillAreaD = pathD ? `${pathD} L ${width},${height} L 0,${height} Z` : '';

  // Current display point (either hovered or latest)
  const currentPoint = hoverIndex !== null && coords[hoverIndex] ? coords[hoverIndex].point : null;
  const displayPrice = currentPoint ? currentPoint.price : instrument.price;
  const displayDiff = currentPoint ? currentPoint.price - coords[0].point.price : instrument.change;
  const displayDiffPercent = currentPoint && coords[0]?.point.price
    ? ((displayDiff / coords[0].point.price) * 100)
    : instrument.changePercent;
  const isDisplayPositive = displayDiff >= 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || coords.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clientX / rect.width));
    const closestIdx = Math.round(ratio * (coords.length - 1));
    setHoverIndex(closestIdx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const strokeColor = isDisplayPositive ? '#089981' : '#f23645';

  return (
    <section className="bg-white rounded-2xl border border-[#e0e3eb] p-5 sm:p-6 shadow-xs">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#e0e3eb] gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xl sm:text-2xl font-bold text-[#131722] tracking-tight">
            {instrument.name} {instrument.symbol !== instrument.name ? `Index` : ''}
          </span>
          <span
            className={`text-xs sm:text-sm font-semibold px-2.5 py-0.5 rounded-md border ${
              isDisplayPositive
                ? 'bg-emerald-50 text-[#089981] border-emerald-200'
                : 'bg-rose-50 text-[#f23645] border-rose-200'
            }`}
          >
            {isDisplayPositive ? '+' : ''}{displayDiff.toFixed(2)} ({isDisplayPositive ? '+' : ''}{displayDiffPercent.toFixed(2)}%)
          </span>
          <span className="text-xs text-[#787b86] font-medium">Real-time {instrument.currency}</span>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center space-x-1 text-xs font-semibold text-[#787b86] bg-[#f0f3fa] p-1 rounded-lg self-start md:self-auto overflow-x-auto no-scrollbar">
          {TIMEFRAMES.map((tf) => {
            const isActive = timeframe === tf;
            return (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#131722] shadow-xs font-bold'
                    : 'hover:text-[#131722]'
                }`}
              >
                {tf}
              </button>
            );
          })}
        </div>
      </div>

      {/* Area Chart Visual Representation */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-60 sm:h-64 pt-4 cursor-crosshair select-none"
      >
        <svg
          className="w-full h-full overflow-visible"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.22" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke="#f0f3fa" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} stroke="#f0f3fa" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke="#f0f3fa" strokeWidth="1" strokeDasharray="3 3" />

          {/* Area Fill */}
          <path d={fillAreaD} fill="url(#chartGradient)" />

          {/* Main Curve */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Active Hover Marker & Guide Line */}
          {hoverIndex !== null && coords[hoverIndex] && (
            <g>
              <line
                x1={coords[hoverIndex].x}
                y1={0}
                x2={coords[hoverIndex].x}
                y2={height}
                stroke="#787b86"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.6"
              />
              <circle
                cx={coords[hoverIndex].x}
                cy={coords[hoverIndex].y}
                r="5"
                fill={strokeColor}
                stroke="#ffffff"
                strokeWidth="2.5"
              />
            </g>
          )}
        </svg>

        {/* Hover Floating Tooltip */}
        {hoverIndex !== null && coords[hoverIndex] && (
          <div
            className="absolute top-2 pointer-events-none bg-[#131722] text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-md transition-all -translate-x-1/2 flex items-center gap-2"
            style={{
              left: `${(coords[hoverIndex].x / width) * 100}%`,
            }}
          >
            <span className="text-gray-300 font-medium">{coords[hoverIndex].point.time}</span>
            <span className="font-bold text-white">${coords[hoverIndex].point.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        )}

        {/* Subtle overlay metadata bottom bar matching screenshot */}
        <div className="absolute bottom-2 right-2 sm:right-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#787b86] bg-white/80 backdrop-blur-xs px-2 py-1 rounded-md">
          <span>High: <strong className="text-[#131722]">{instrument.high.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
          <span>Low: <strong className="text-[#131722]">{instrument.low.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
          <button
            onClick={onOpenSupercharts}
            className="text-[#2962ff] font-semibold hover:underline flex items-center cursor-pointer ml-1"
          >
            <span>See more on Supercharts</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
};
