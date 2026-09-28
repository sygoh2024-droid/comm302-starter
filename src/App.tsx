/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IndexCards } from './components/IndexCards';
import { InteractiveChart } from './components/InteractiveChart';
import { MarketTables } from './components/MarketTables';
import { CryptoCurrencyStrip } from './components/CryptoCurrencyStrip';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { SuperchartsModal } from './components/SuperchartsModal';
import { ScreenerModal } from './components/ScreenerModal';
import { WorldIndicesModal } from './components/WorldIndicesModal';
import { AuthModal } from './components/AuthModal';

import {
  INITIAL_INDICES,
  WORLD_INDICES,
  ACTIVE_US_STOCKS,
  CRYPTO_CURRENCIES,
  CATEGORY_INSTRUMENTS,
} from './data/marketData';
import { Instrument, CategoryType, Timeframe, ActiveStock, WorldIndex, QuickTicker } from './types/market';

export default function App() {
  // State
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('US stocks');
  const [selectedRegion, setSelectedRegion] = useState('Everywhere (Global)');
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1D');
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [flashingTicker, setFlashingTicker] = useState<string | null>(null);

  // Dynamic Data Lists
  const [indices, setIndices] = useState<Instrument[]>(INITIAL_INDICES);
  const [worldIndices, setWorldIndices] = useState<WorldIndex[]>(WORLD_INDICES);
  const [activeStocks, setActiveStocks] = useState<ActiveStock[]>(ACTIVE_US_STOCKS);
  const [cryptoCurrencies, setCryptoCurrencies] = useState<QuickTicker[]>(CRYPTO_CURRENCIES);

  // Active Selected Instrument for Main Chart
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument>(INITIAL_INDICES[0]);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSuperchartsOpen, setIsSuperchartsOpen] = useState(false);
  const [isScreenerOpen, setIsScreenerOpen] = useState(false);
  const [isWorldIndicesOpen, setIsWorldIndicesOpen] = useState(false);
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signup',
  });

  // Handle Category Switching
  const handleCategoryChange = (category: CategoryType) => {
    setSelectedCategory(category);
    const categoryItems = CATEGORY_INSTRUMENTS[category];
    if (categoryItems && categoryItems.length > 0) {
      setIndices(categoryItems);
      setSelectedInstrument(categoryItems[0]);
    }
  };

  // Real-time market tick simulation
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      // Pick random target to nudge
      const rand = Math.random();

      if (rand < 0.4) {
        // Nudge one of the top indices
        setIndices((prev) => {
          const targetIdx = Math.floor(Math.random() * prev.length);
          const item = prev[targetIdx];
          const delta = (Math.random() - 0.49) * (item.price * 0.0004);
          const newPrice = Number((item.price + delta).toFixed(2));
          const newChg = Number((item.change + delta).toFixed(2));
          const newPct = Number(((newChg / (item.price - item.change)) * 100).toFixed(2));

          setFlashingTicker(item.symbol);
          setTimeout(() => setFlashingTicker(null), 800);

          const updated = [...prev];
          updated[targetIdx] = {
            ...item,
            price: newPrice,
            change: newChg,
            changePercent: newPct,
            high: Math.max(item.high, newPrice),
            low: Math.min(item.low, newPrice),
          };

          // If this is currently the selected instrument, keep in sync
          if (selectedInstrument.id === item.id) {
            setSelectedInstrument(updated[targetIdx]);
          }

          return updated;
        });
      } else if (rand < 0.75) {
        // Nudge one of the active stocks
        setActiveStocks((prev) => {
          const targetIdx = Math.floor(Math.random() * prev.length);
          const stock = prev[targetIdx];
          const delta = (Math.random() - 0.49) * 0.15;
          const newPrice = Math.max(1, Number((stock.price + delta).toFixed(2)));
          const newPct = Number((stock.changePercent + (delta / stock.price) * 100).toFixed(2));

          setFlashingTicker(stock.ticker);
          setTimeout(() => setFlashingTicker(null), 800);

          const updated = [...prev];
          updated[targetIdx] = {
            ...stock,
            price: newPrice,
            changePercent: newPct,
          };
          return updated;
        });
      } else {
        // Nudge crypto
        setCryptoCurrencies((prev) => {
          const targetIdx = Math.floor(Math.random() * prev.length);
          const item = prev[targetIdx];
          const deltaPct = (Math.random() - 0.48) * 0.12;
          const newPct = Number((item.changePercent + deltaPct).toFixed(2));

          setFlashingTicker(item.symbol);
          setTimeout(() => setFlashingTicker(null), 800);

          const updated = [...prev];
          updated[targetIdx] = {
            ...item,
            changePercent: newPct,
          };
          return updated;
        });
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveUpdating, selectedInstrument.id]);

  // Handle Selecting Stock from Table
  const handleSelectStock = (stock: ActiveStock) => {
    // Generate synthetic instrument from stock
    const stockInstrument: Instrument = {
      id: stock.ticker.toLowerCase(),
      symbol: stock.ticker,
      name: stock.name,
      category: 'US stocks',
      price: stock.price,
      change: Number(((stock.price * stock.changePercent) / 100).toFixed(2)),
      changePercent: stock.changePercent,
      currency: 'USD',
      badgeText: stock.logoText,
      badgeBgColor: stock.logoBg.replace('bg-[', '').replace(']', ''),
      badgeTextColor: stock.logoColor === 'text-white' ? '#ffffff' : '#000000',
      high: Number((stock.price * 1.015).toFixed(2)),
      low: Number((stock.price * 0.985).toFixed(2)),
      volume: stock.volume,
      sparkline: [12, 16, 14, 20, 24, 28],
      chartData: {
        '1D': Array.from({ length: 25 }, (_, i) => ({
          time: `${10 + Math.floor(i / 4)}:${(i * 15) % 60}`,
          price: Number((stock.price * (0.98 + (i / 25) * 0.04 + (Math.random() - 0.5) * 0.01)).toFixed(2)),
        })),
        '5D': [],
        '1M': [],
        '6M': [],
        'YTD': [],
        '1Y': [],
        'ALL': [],
      },
    };
    setSelectedInstrument(stockInstrument);
    window.scrollTo({ top: 260, behavior: 'smooth' });
  };

  // Handle Selecting World Index
  const handleSelectWorldIndex = (index: WorldIndex) => {
    const indexInstrument: Instrument = {
      id: index.symbol.toLowerCase(),
      symbol: index.symbol,
      name: index.name,
      category: 'World stocks',
      price: index.last,
      change: index.trendValue,
      changePercent: index.changePercent,
      currency: 'Local',
      badgeText: index.countryCode,
      badgeBgColor: '#1e3a8a',
      badgeTextColor: '#ffffff',
      high: Number((index.last * 1.008).toFixed(2)),
      low: Number((index.last * 0.992).toFixed(2)),
      volume: '180M',
      sparkline: [10, 14, 18, 22, 25, 29],
      chartData: {
        '1D': Array.from({ length: 25 }, (_, i) => ({
          time: `${10 + Math.floor(i / 4)}:${(i * 15) % 60}`,
          price: Number((index.last * (0.99 + (i / 25) * 0.02 + (Math.random() - 0.5) * 0.005)).toFixed(2)),
        })),
        '5D': [],
        '1M': [],
        '6M': [],
        'YTD': [],
        '1Y': [],
        'ALL': [],
      },
    };
    setSelectedInstrument(indexInstrument);
    window.scrollTo({ top: 260, behavior: 'smooth' });
  };

  // Handle Selecting Crypto Item
  const handleSelectCryptoItem = (item: QuickTicker) => {
    const rawPrice = parseFloat(item.price.replace(/[$,]/g, '')) || 1000;
    const cryptoInstrument: Instrument = {
      id: item.symbol.toLowerCase(),
      symbol: item.symbol,
      name: item.name,
      category: 'Crypto',
      price: rawPrice,
      change: Number(((rawPrice * item.changePercent) / 100).toFixed(2)),
      changePercent: item.changePercent,
      currency: 'USD',
      badgeText: item.symbol.slice(0, 3),
      badgeBgColor: '#f7931a',
      badgeTextColor: '#ffffff',
      high: Number((rawPrice * 1.02).toFixed(2)),
      low: Number((rawPrice * 0.98).toFixed(2)),
      volume: '$12.4B',
      sparkline: [10, 15, 12, 19, 23, 28],
      chartData: {
        '1D': Array.from({ length: 25 }, (_, i) => ({
          time: `${10 + Math.floor(i / 4)}:${(i * 15) % 60}`,
          price: Number((rawPrice * (0.97 + (i / 25) * 0.06 + (Math.random() - 0.5) * 0.01)).toFixed(2)),
        })),
        '5D': [],
        '1M': [],
        '6M': [],
        'YTD': [],
        '1Y': [],
        'ALL': [],
      },
    };
    setSelectedInstrument(cryptoInstrument);
    window.scrollTo({ top: 260, behavior: 'smooth' });
  };

  // Search items list
  const searchItems = useMemo(() => {
    const list: { symbol: string; name: string; type: string; price: string; changePercent: number }[] = [];
    indices.forEach((idx) => {
      list.push({
        symbol: idx.symbol,
        name: idx.name,
        type: 'Index',
        price: idx.price.toLocaleString(),
        changePercent: idx.changePercent,
      });
    });
    activeStocks.forEach((st) => {
      list.push({
        symbol: st.ticker,
        name: st.name,
        type: 'Stock',
        price: `$${st.price.toFixed(2)}`,
        changePercent: st.changePercent,
      });
    });
    worldIndices.forEach((w) => {
      list.push({
        symbol: w.symbol,
        name: w.name,
        type: 'World Index',
        price: w.last.toLocaleString(),
        changePercent: w.changePercent,
      });
    });
    cryptoCurrencies.forEach((c) => {
      list.push({
        symbol: c.symbol,
        name: c.name,
        type: c.symbol.includes('USD') && !c.symbol.includes('BTC') && !c.symbol.includes('ETH') ? 'Forex' : 'Crypto',
        price: c.price,
        changePercent: c.changePercent,
      });
    });
    return list;
  }, [indices, activeStocks, worldIndices, cryptoCurrencies]);

  // Handle Search Result Selection
  const handleSearchResultSelect = (symbol: string) => {
    // Check if in activeStocks
    const foundStock = activeStocks.find((s) => s.ticker === symbol);
    if (foundStock) {
      handleSelectStock(foundStock);
      return;
    }
    // Check if in indices
    const foundIdx = indices.find((i) => i.symbol === symbol);
    if (foundIdx) {
      setSelectedInstrument(foundIdx);
      window.scrollTo({ top: 260, behavior: 'smooth' });
      return;
    }
    // Check in world indices
    const foundWorld = worldIndices.find((w) => w.symbol === symbol);
    if (foundWorld) {
      handleSelectWorldIndex(foundWorld);
      return;
    }
    // Check in crypto
    const foundCrypto = cryptoCurrencies.find((c) => c.symbol === symbol);
    if (foundCrypto) {
      handleSelectCryptoItem(foundCrypto);
      return;
    }
  };

  // Watchlist items for Supercharts
  const watchlistItems = useMemo(() => {
    return [
      { symbol: 'SPX', name: 'S&P 500', price: 5864.67, changePercent: 0.40 },
      { symbol: 'NDX', name: 'Nasdaq 100', price: 20324.50, changePercent: 0.68 },
      { symbol: 'DJI', name: 'Dow 30', price: 43275.91, changePercent: -0.09 },
      ...activeStocks.map((s) => ({
        symbol: s.ticker,
        name: s.name,
        price: s.price,
        changePercent: s.changePercent,
      })),
      { symbol: 'BTCUSD', name: 'Bitcoin', price: 68410.00, changePercent: 1.94 },
      { symbol: 'ETHUSD', name: 'Ethereum', price: 2642.30, changePercent: 2.41 },
    ];
  }, [activeStocks]);

  return (
    <div className="bg-white text-[#131722] font-sans antialiased min-h-screen flex flex-col selection:bg-[#2962ff] selection:text-white">
      {/* Navigation Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={(mode) => setAuthModalState({ isOpen: true, mode: mode || 'signup' })}
        isLiveUpdating={isLiveUpdating}
        onToggleLive={() => setIsLiveUpdating(!isLiveUpdating)}
      />

      {/* Hero Section */}
      <HeroSection
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-20 space-y-10 sm:space-y-12">
        {/* Top 3 Indices Cards Bar */}
        <IndexCards
          indices={indices}
          selectedInstrumentId={selectedInstrument.id}
          onSelectInstrument={(item) => setSelectedInstrument(item)}
          onViewAllIndices={() => setIsWorldIndicesOpen(true)}
          flashingTicker={flashingTicker}
        />

        {/* Interactive Chart Preview */}
        <InteractiveChart
          instrument={selectedInstrument}
          timeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
          onOpenSupercharts={() => setIsSuperchartsOpen(true)}
        />

        {/* Two-Column Financial Tables */}
        <MarketTables
          worldIndices={worldIndices}
          activeStocks={activeStocks}
          onSelectStock={handleSelectStock}
          onSelectWorldIndex={handleSelectWorldIndex}
          onOpenScreener={() => setIsScreenerOpen(true)}
          onOpenWorldIndicesModal={() => setIsWorldIndicesOpen(true)}
          flashingTicker={flashingTicker}
        />

        {/* Crypto Leaders & Currencies Strip */}
        <CryptoCurrencyStrip
          items={cryptoCurrencies}
          onSelectItem={handleSelectCryptoItem}
          flashingTicker={flashingTicker}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Full Screen Overlays */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectInstrument={handleSearchResultSelect}
        availableItems={searchItems}
      />

      <SuperchartsModal
        isOpen={isSuperchartsOpen}
        onClose={() => setIsSuperchartsOpen(false)}
        instrument={selectedInstrument}
        onSelectInstrument={handleSearchResultSelect}
        watchlistItems={watchlistItems}
      />

      <ScreenerModal
        isOpen={isScreenerOpen}
        onClose={() => setIsScreenerOpen(false)}
        stocks={activeStocks}
        onSelectStock={handleSelectStock}
      />

      <WorldIndicesModal
        isOpen={isWorldIndicesOpen}
        onClose={() => setIsWorldIndicesOpen(false)}
        worldIndices={worldIndices}
        onSelectIndex={handleSelectWorldIndex}
      />

      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        onClose={() => setAuthModalState({ isOpen: false, mode: 'signup' })}
      />
    </div>
  );
}
