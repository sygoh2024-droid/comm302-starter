import React, { useState } from 'react';
import { CategoryType } from '../types/market';
import { ChevronDown, Globe, MapPin, Check } from 'lucide-react';

interface HeroSectionProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

const CATEGORIES: CategoryType[] = [
  'US stocks',
  'World stocks',
  'Crypto',
  'Futures',
  'Forex',
  'Government bonds',
  'Corporate bonds',
  'ETFs',
  'Economy',
];

const REGIONS = [
  { id: 'global', label: 'Everywhere (Global)', icon: '🌍' },
  { id: 'us', label: 'United States', icon: '🇺🇸' },
  { id: 'eu', label: 'Europe', icon: '🇪🇺' },
  { id: 'asia', label: 'Asia & Pacific', icon: '🇯🇵' },
  { id: 'americas', label: 'Americas', icon: '🌎' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion,
}) => {
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);

  return (
    <section className="pt-10 sm:pt-12 pb-6 px-4 max-w-7xl mx-auto w-full text-center relative">
      {/* Main Dropdown Heading */}
      <div className="relative inline-block">
        <button
          onClick={() => setShowRegionDropdown(!showRegionDropdown)}
          className="inline-flex items-center justify-center gap-2 sm:gap-3 cursor-pointer group mb-6 select-none focus:outline-none"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#131722] hover:text-black transition-colors">
            Markets, {selectedRegion === 'Everywhere (Global)' ? 'everywhere' : selectedRegion.toLowerCase()}
          </h1>
          <ChevronDown
            className={`w-6 h-6 sm:w-8 sm:h-8 text-[#131722] transition-transform duration-200 ${
              showRegionDropdown ? 'rotate-180 text-[#2962ff]' : 'group-hover:translate-y-0.5'
            }`}
          />
        </button>

        {/* Region selector popover */}
        {showRegionDropdown && (
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-64 bg-white border border-[#e0e3eb] rounded-2xl shadow-xl p-2 z-30 text-left">
            <div className="px-3 py-1.5 text-[11px] font-bold text-[#787b86] uppercase tracking-wider">
              Filter by Region
            </div>
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  onSelectRegion(r.label);
                  setShowRegionDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between transition-colors ${
                  selectedRegion === r.label ? 'bg-[#f0f3fa] text-[#2962ff]' : 'text-[#131722] hover:bg-[#f8f9fd]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{r.icon}</span>
                  <span>{r.label}</span>
                </span>
                {selectedRegion === r.label && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Pill Filter Bar */}
      <div className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar gap-2 py-2 px-1">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#e9ecf2] text-[#131722] shadow-inner font-bold'
                  : 'text-[#868993] hover:text-[#131722] hover:bg-[#f0f3fa]'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </section>
  );
};
