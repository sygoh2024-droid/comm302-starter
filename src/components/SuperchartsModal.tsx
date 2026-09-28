import React, { useState, useRef, useMemo } from 'react';
import { Instrument, ChartPoint } from '../types/market';
import { 
  X, Maximize2, Minimize2, TrendingUp, BarChart2, CandlestickChart, 
  LineChart, Activity, Sliders, Layers, Plus, ArrowUpRight, ArrowDownRight, 
  RotateCcw, Check, Sparkles, AlertCircle
} from 'lucide-react';

interface SuperchartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  instrument: Instrument;
  onSelectInstrument: (symbol: string) => void;
  watchlistItems: { symbol: string; name: string; price: number; changePercent: number }[];
}

type ChartStyle = 'candles' | 'area' | 'line';
type Interval = '1m' | '5m' | '15m' | '1h' | '4h' | '1D' | '1W';

export const SuperchartsModal: React.FC<SuperchartsModalProps> = ({
  isOpen,
  onClose,
  instrument,
  onSelectInstrument,
  watchlistItems,
}) => {
  const [chartStyle, setChartStyle] = useState<ChartStyle>('candles');
  const [interval, setInterval] = useState<Interval>('1D');
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(false);
  const [showRSI, setShowRSI] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [showWatchlist, setShowWatchlist] = useState(true);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // Paper Trading State
  const [paperBalance, setPaperBalance] = useState(100000);
  const [sharesQty, setSharesQty] = useState(10);
  const [tradeNotice, setTradeNotice] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Derive candlestick data points
  const points: ChartPoint[] = useMemo(() => {
    // Generate 40-50 realistic candlesticks based on instrument price
    const count = 48;
    const base = instrument.price;
    const items: ChartPoint[] = [];
    let currentClose = base * 0.96;

    for (let i = 0; i < count; i++) {
      const isUp = (Math.sin(i * 0.45) + (Math.random() - 0.45)) > 0;
      const changeMag = (base * 0.005) * (0.5 + Math.random());
      const open = currentClose;
      const close = isUp ? open + changeMag : open - changeMag;
      const high = Math.max(open, close) + Math.random() * (base * 0.003);
      const low = Math.min(open, close) - Math.random() * (base * 0.003);
      const volume = Math.floor(20000 + Math.random() * 120000);

      items.push({
        time: `Bar ${i + 1}`,
        price: close,
        open,
        high,
        low,
        close,
        volume,
      });
      currentClose = close;
    }
    // Final point matches live instrument price
    if (items.length > 0) {
      items[items.length - 1].close = instrument.price;
      items[items.length - 1].price = instrument.price;
    }
    return items;
  }, [instrument.id, instrument.price, interval]);

  if (!isOpen) return null;

  // Chart Dimensions
  const chartWidth = 900;
  const chartHeight = 340;
  const rsiHeight = 90;

  const highs = points.map((p) => p.high ?? p.price);
  const lows = points.map((p) => p.low ?? p.price);
  const maxPrice = Math.max(...highs);
  const minPrice = Math.min(...lows);
  const priceRange = maxPrice - minPrice || 1;

  const maxVol = Math.max(...points.map((p) => p.volume || 1));

  // Compute Moving Averages
  const smaPoints = points.map((_, i) => {
    const period = 10;
    if (i < period) return null;
    const slice = points.slice(i - period, i);
    const avg = slice.reduce((acc, curr) => acc + (curr.close ?? curr.price), 0) / period;
    return avg;
  });

  const emaPoints = points.map((_, i) => {
    const period = 20;
    if (i < period) return null;
    const slice = points.slice(i - period, i);
    const avg = slice.reduce((acc, curr) => acc + (curr.close ?? curr.price), 0) / period;
    return avg;
  });

  // Calculate Mock RSI
  const rsiValues = points.map((_, i) => {
    const val = 50 + Math.sin(i * 0.3) * 22 + (Math.random() - 0.5) * 6;
    return Math.max(10, Math.min(90, val));
  });

  const activePoint = hoverIdx !== null ? points[hoverIdx] : points[points.length - 1];

  const handleExecuteTrade = (type: 'BUY' | 'SELL') => {
    const cost = instrument.price * sharesQty;
    if (type === 'BUY') {
      if (cost > paperBalance) {
        setTradeNotice('Insufficient paper funds');
        return;
      }
      setPaperBalance((prev) => prev - cost);
      setTradeNotice(`Bought ${sharesQty} shares of ${instrument.symbol} at $${instrument.price.toFixed(2)}`);
    } else {
      setPaperBalance((prev) => prev + cost);
      setTradeNotice(`Sold ${sharesQty} shares of ${instrument.symbol} at $${instrument.price.toFixed(2)}`);
    }
    setTimeout(() => setTradeNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#131722] text-white overflow-hidden animate-in fade-in duration-200">
      {/* Top Navbar */}
      <div className="h-14 border-b border-[#2a2e39] bg-[#1e222d] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3 sm:space-x-4 overflow-x-auto no-scrollbar">
          {/* Symbol Info */}
          <div className="flex items-center gap-2 pr-2 border-r border-[#2a2e39]">
            <span className="font-extrabold text-base tracking-tight text-white">
              {instrument.symbol}
            </span>
            <span className="text-xs text-gray-400 hidden sm:inline">
              {instrument.name}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded ${
                instrument.changePercent >= 0 ? 'bg-[#089981]/20 text-[#089981]' : 'bg-[#f23645]/20 text-[#f23645]'
              }`}
            >
              {instrument.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              {' '}({instrument.changePercent >= 0 ? '+' : ''}{instrument.changePercent.toFixed(2)}%)
            </span>
          </div>

          {/* Time intervals */}
          <div className="flex items-center space-x-1 text-xs font-medium">
            {(['1m', '5m', '15m', '1h', '4h', '1D', '1W'] as Interval[]).map((int) => (
              <button
                key={int}
                onClick={() => setInterval(int)}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  interval === int ? 'bg-[#2962ff] text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-[#2a2e39]'
                }`}
              >
                {int}
              </button>
            ))}
          </div>

          {/* Chart Style Toggle */}
          <div className="flex items-center space-x-1 pl-2 border-l border-[#2a2e39]">
            <button
              onClick={() => setChartStyle('candles')}
              title="Candlestick Chart"
              className={`p-1.5 rounded transition-colors ${
                chartStyle === 'candles' ? 'bg-[#2962ff] text-white' : 'text-gray-400 hover:text-white hover:bg-[#2a2e39]'
              }`}
            >
              <CandlestickChart className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartStyle('area')}
              title="Area Chart"
              className={`p-1.5 rounded transition-colors ${
                chartStyle === 'area' ? 'bg-[#2962ff] text-white' : 'text-gray-400 hover:text-white hover:bg-[#2a2e39]'
              }`}
            >
              <Activity className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartStyle('line')}
              title="Line Chart"
              className={`p-1.5 rounded transition-colors ${
                chartStyle === 'line' ? 'bg-[#2962ff] text-white' : 'text-gray-400 hover:text-white hover:bg-[#2a2e39]'
              }`}
            >
              <LineChart className="w-4 h-4" />
            </button>
          </div>

          {/* Indicators dropdown buttons */}
          <div className="hidden md:flex items-center space-x-1.5 pl-2 border-l border-[#2a2e39] text-xs">
            <button
              onClick={() => setShowSMA(!showSMA)}
              className={`px-2 py-1 rounded border transition-colors ${
                showSMA ? 'border-amber-400 text-amber-400 bg-amber-400/10' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              SMA 10
            </button>
            <button
              onClick={() => setShowEMA(!showEMA)}
              className={`px-2 py-1 rounded border transition-colors ${
                showEMA ? 'border-sky-400 text-sky-400 bg-sky-400/10' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              EMA 20
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2 py-1 rounded border transition-colors ${
                showRSI ? 'border-purple-400 text-purple-400 bg-purple-400/10' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              RSI (14)
            </button>
          </div>
        </div>

        {/* Top Right Tools & Exit */}
        <div className="flex items-center space-x-3 shrink-0">
          {/* Paper Trading balance badge */}
          <div className="hidden lg:flex items-center gap-2 bg-[#2a2e39] px-2.5 py-1 rounded-lg text-xs">
            <span className="text-gray-400">Paper Bal:</span>
            <span className="font-bold text-emerald-400">${paperBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>

          <button
            onClick={() => setShowWatchlist(!showWatchlist)}
            className="text-xs font-semibold px-2.5 py-1 bg-[#2a2e39] hover:bg-[#363a45] rounded-lg transition-colors"
          >
            {showWatchlist ? 'Hide Watchlist' : 'Watchlist'}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2a2e39] rounded-lg transition-colors cursor-pointer"
            aria-label="Close Supercharts"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Chart Body + Watchlist layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Drawing / Tool Ribbon */}
        <div className="w-12 border-r border-[#2a2e39] bg-[#1e222d] hidden sm:flex flex-col items-center py-3 space-y-3 shrink-0 text-gray-400">
          <button className="p-2 hover:bg-[#2a2e39] hover:text-white rounded-lg transition-colors cursor-pointer" title="Crosshair">
            <Sliders className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-[#2a2e39] hover:text-white rounded-lg transition-colors cursor-pointer" title="Trend Lines">
            <TrendingUp className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-[#2a2e39] hover:text-white rounded-lg transition-colors cursor-pointer" title="Patterns">
            <Layers className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-[#2a2e39] hover:text-white rounded-lg transition-colors cursor-pointer" title="Indicators">
            <Activity className="w-4 h-4" />
          </button>
        </div>

        {/* Center Chart Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#131722] relative">
          {/* Live Bar OHLCV Header */}
          <div className="px-4 py-2 bg-[#181c27] border-b border-[#2a2e39] flex flex-wrap items-center gap-4 text-xs font-mono text-gray-300">
            <span>O: <strong className="text-white">{(activePoint?.open ?? activePoint?.price).toFixed(2)}</strong></span>
            <span>H: <strong className="text-[#089981]">{(activePoint?.high ?? activePoint?.price).toFixed(2)}</strong></span>
            <span>L: <strong className="text-[#f23645]">{(activePoint?.low ?? activePoint?.price).toFixed(2)}</strong></span>
            <span>C: <strong className="text-white">{(activePoint?.close ?? activePoint?.price).toFixed(2)}</strong></span>
            <span>Vol: <strong className="text-white">{(activePoint?.volume || 0).toLocaleString()}</strong></span>

            {/* Quick Paper Trading Execution Inline */}
            <div className="ml-auto flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="1000"
                value={sharesQty}
                onChange={(e) => setSharesQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-14 bg-[#2a2e39] text-white text-xs px-2 py-1 rounded border border-[#363a45] text-center"
              />
              <button
                onClick={() => handleExecuteTrade('BUY')}
                className="px-3 py-1 bg-[#089981] hover:bg-[#078570] text-white font-bold rounded text-xs transition-colors cursor-pointer"
              >
                BUY
              </button>
              <button
                onClick={() => handleExecuteTrade('SELL')}
                className="px-3 py-1 bg-[#f23645] hover:bg-[#d82a39] text-white font-bold rounded text-xs transition-colors cursor-pointer"
              >
                SELL
              </button>
            </div>
          </div>

          {/* Trade Notification Toast */}
          {tradeNotice && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 bg-[#2962ff] text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2 animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{tradeNotice}</span>
            </div>
          )}

          {/* Chart Canvas Area */}
          <div
            ref={containerRef}
            onMouseMove={(e) => {
              if (!containerRef.current) return;
              const rect = containerRef.current.getBoundingClientRect();
              const clientX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clientX / rect.width));
              setHoverIdx(Math.round(ratio * (points.length - 1)));
            }}
            onMouseLeave={() => setHoverIdx(null)}
            className="flex-1 relative cursor-crosshair overflow-hidden p-2 select-none"
          >
            <svg
              className="w-full h-full"
              viewBox={`0 0 ${chartWidth} ${showRSI ? chartHeight + rsiHeight : chartHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="superAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2962ff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0.2, 0.4, 0.6, 0.8].map((pct, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={chartHeight * pct}
                  x2={chartWidth}
                  y2={chartHeight * pct}
                  stroke="#1e222d"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Volume Bars */}
              {showVolume && points.map((p, idx) => {
                const candleWidth = chartWidth / points.length;
                const x = idx * candleWidth;
                const vHeight = ((p.volume || 0) / maxVol) * (chartHeight * 0.22);
                const isBull = (p.close ?? p.price) >= (p.open ?? p.price);
                return (
                  <rect
                    key={`vol-${idx}`}
                    x={x + 1}
                    y={chartHeight - vHeight}
                    width={Math.max(1, candleWidth - 2)}
                    height={vHeight}
                    fill={isBull ? '#089981' : '#f23645'}
                    opacity="0.3"
                  />
                );
              })}

              {/* Candlesticks Rendering */}
              {chartStyle === 'candles' && points.map((p, idx) => {
                const candleWidth = chartWidth / points.length;
                const centerX = idx * candleWidth + candleWidth / 2;
                const openY = chartHeight - (( (p.open ?? p.price) - minPrice) / priceRange) * (chartHeight - 40) - 20;
                const closeY = chartHeight - (( (p.close ?? p.price) - minPrice) / priceRange) * (chartHeight - 40) - 20;
                const highY = chartHeight - (( (p.high ?? p.price) - minPrice) / priceRange) * (chartHeight - 40) - 20;
                const lowY = chartHeight - (( (p.low ?? p.price) - minPrice) / priceRange) * (chartHeight - 40) - 20;

                const isBull = (p.close ?? p.price) >= (p.open ?? p.price);
                const bodyTop = Math.min(openY, closeY);
                const bodyHeight = Math.max(2, Math.abs(closeY - openY));
                const color = isBull ? '#089981' : '#f23645';

                return (
                  <g key={`candle-${idx}`}>
                    {/* Wick */}
                    <line
                      x1={centerX}
                      y1={highY}
                      x2={centerX}
                      y2={lowY}
                      stroke={color}
                      strokeWidth="1.2"
                    />
                    {/* Body */}
                    <rect
                      x={centerX - candleWidth * 0.35}
                      y={bodyTop}
                      width={candleWidth * 0.7}
                      height={bodyHeight}
                      fill={color}
                      stroke={color}
                      strokeWidth="1"
                    />
                  </g>
                );
              })}

              {/* Area / Line Style */}
              {chartStyle !== 'candles' && (
                <>
                  <path
                    d={`M 0,${chartHeight - ((points[0].price - minPrice) / priceRange) * (chartHeight - 40) - 20} ` +
                      points
                        .slice(1)
                        .map((p, idx) => {
                          const x = ((idx + 1) / (points.length - 1)) * chartWidth;
                          const y = chartHeight - ((p.price - minPrice) / priceRange) * (chartHeight - 40) - 20;
                          return `L ${x},${y}`;
                        })
                        .join(' ')
                    }
                    fill="none"
                    stroke="#2962ff"
                    strokeWidth="2.5"
                  />
                  {chartStyle === 'area' && (
                    <path
                      d={`M 0,${chartHeight - ((points[0].price - minPrice) / priceRange) * (chartHeight - 40) - 20} ` +
                        points
                          .slice(1)
                          .map((p, idx) => {
                            const x = ((idx + 1) / (points.length - 1)) * chartWidth;
                            const y = chartHeight - ((p.price - minPrice) / priceRange) * (chartHeight - 40) - 20;
                            return `L ${x},${y}`;
                          })
                          .join(' ') + ` L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`
                      }
                      fill="url(#superAreaGrad)"
                    />
                  )}
                </>
              )}

              {/* SMA Line */}
              {showSMA && (
                <path
                  d={smaPoints
                    .map((val, idx) => {
                      if (val === null) return '';
                      const x = (idx / (points.length - 1)) * chartWidth;
                      const y = chartHeight - ((val - minPrice) / priceRange) * (chartHeight - 40) - 20;
                      return `${idx === 10 ? 'M' : 'L'} ${x},${y}`;
                    })
                    .filter(Boolean)
                    .join(' ')}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1.8"
                />
              )}

              {/* EMA Line */}
              {showEMA && (
                <path
                  d={emaPoints
                    .map((val, idx) => {
                      if (val === null) return '';
                      const x = (idx / (points.length - 1)) * chartWidth;
                      const y = chartHeight - ((val - minPrice) / priceRange) * (chartHeight - 40) - 20;
                      return `${idx === 20 ? 'M' : 'L'} ${x},${y}`;
                    })
                    .filter(Boolean)
                    .join(' ')}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.8"
                />
              )}

              {/* RSI Subchart */}
              {showRSI && (
                <g transform={`translate(0, ${chartHeight + 10})`}>
                  {/* RSI background & border */}
                  <rect x="0" y="0" width={chartWidth} height={rsiHeight - 15} fill="#181c27" stroke="#2a2e39" />
                  {/* 70 / 30 guide lines */}
                  <line x1="0" y1={(rsiHeight - 15) * 0.3} x2={chartWidth} y2={(rsiHeight - 15) * 0.3} stroke="#f23645" strokeDasharray="3 3" opacity="0.5" />
                  <line x1="0" y1={(rsiHeight - 15) * 0.7} x2={chartWidth} y2={(rsiHeight - 15) * 0.7} stroke="#089981" strokeDasharray="3 3" opacity="0.5" />
                  <text x="5" y="14" fill="#a855f7" fontSize="10" fontFamily="monospace">RSI (14): {rsiValues[hoverIdx ?? rsiValues.length - 1]?.toFixed(1)}</text>

                  {/* RSI curve */}
                  <path
                    d={rsiValues
                      .map((val, idx) => {
                        const x = (idx / (rsiValues.length - 1)) * chartWidth;
                        const y = (1 - (val / 100)) * (rsiHeight - 15);
                        return `${idx === 0 ? 'M' : 'L'} ${x},${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="1.5"
                  />
                </g>
              )}

              {/* Crosshair Cursor */}
              {hoverIdx !== null && (
                <g>
                  <line
                    x1={(hoverIdx / (points.length - 1)) * chartWidth}
                    y1={0}
                    x2={(hoverIdx / (points.length - 1)) * chartWidth}
                    y2={showRSI ? chartHeight + rsiHeight : chartHeight}
                    stroke="#787b86"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Right Watchlist Sidebar */}
        {showWatchlist && (
          <div className="w-64 border-l border-[#2a2e39] bg-[#181c27] flex flex-col shrink-0">
            <div className="p-3 border-b border-[#2a2e39] flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-gray-400">
                Watchlist
              </span>
              <span className="text-[11px] text-[#2962ff] font-semibold cursor-pointer">
                + Add Symbol
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#222634]">
              {watchlistItems.map((item) => {
                const isSelected = item.symbol === instrument.symbol;
                const isPos = item.changePercent >= 0;
                return (
                  <div
                    key={item.symbol}
                    onClick={() => onSelectInstrument(item.symbol)}
                    className={`p-3 hover:bg-[#222634] cursor-pointer transition-colors flex items-center justify-between ${
                      isSelected ? 'bg-[#2a2e39] border-l-2 border-[#2962ff]' : ''
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-white">{item.symbol}</div>
                      <div className="text-[10px] text-gray-400 truncate max-w-[100px]">{item.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-xs text-white">
                        ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className={`text-[10px] font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isPos ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
