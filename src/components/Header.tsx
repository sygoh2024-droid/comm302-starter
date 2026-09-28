import React, { useState, useEffect } from 'react';
import { Search, Globe, User, Bell, ChevronDown, Check, Sparkles, Activity } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  isLiveUpdating: boolean;
  onToggleLive: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenAuth,
  isLiveUpdating,
  onToggleLive,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Close menus on outside click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'ES', name: 'Español' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'FR', name: 'Français' },
    { code: 'JA', name: '日本語' },
    { code: 'ZH', name: '繁體中文' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e0e3eb] px-4 lg:px-6 h-[64px] flex items-center justify-between transition-colors">
      {/* Left Navigation items & Logo */}
      <div className="flex items-center space-x-6">
        {/* TradingView Geometric Logo */}
        <a 
          href="#" 
          aria-label="TradingView Home"
          className="flex items-center gap-1.5 focus:outline-none group"
        >
          <svg className="w-8 h-8 fill-black transition-transform group-hover:scale-105" viewBox="0 0 36 28" fill="none">
            <path d="M14 22H7V10H14V22Z" fill="currentColor" />
            <path d="M0 6V0H36V6H23V28H16V6H0Z" fill="currentColor" />
            <path d="M29 28H36V14H29V28Z" fill="currentColor" />
          </svg>
        </a>

        {/* Quick Search Bar */}
        <div 
          onClick={onOpenSearch}
          className="relative hidden sm:block w-52 md:w-64 cursor-pointer group"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#787b86]">
            <Search className="w-4 h-4 transition-colors group-hover:text-[#2962ff]" />
          </div>
          <input
            type="text"
            readOnly
            placeholder="Search (Ctrl+K)"
            className="w-full bg-[#f0f3fa] text-xs font-medium text-[#131722] rounded-full pl-9 pr-3 py-2 border-transparent cursor-pointer hover:bg-[#e6ebf5] transition-all focus:outline-none"
          />
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-[14px] font-semibold text-[#131722]">
          <a href="#" className="hover:text-[#2962ff] transition-colors">Products</a>
          <a href="#" className="hover:text-[#2962ff] transition-colors">Community</a>
          <a href="#" className="text-[#2962ff] tab-active-indicator transition-colors">Markets</a>
          <a href="#" className="hover:text-[#2962ff] transition-colors">Brokers</a>
          <a href="#" className="hover:text-[#2962ff] transition-colors">More</a>
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Live Market Simulation Toggle */}
        <button
          onClick={onToggleLive}
          title={isLiveUpdating ? "Live updates active. Click to pause." : "Live updates paused. Click to resume."}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${
            isLiveUpdating 
              ? 'bg-emerald-50 text-[#089981] border-emerald-200 shadow-xs' 
              : 'bg-gray-100 text-gray-500 border-gray-200'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isLiveUpdating ? 'bg-[#089981] animate-pulse' : 'bg-gray-400'}`} />
          <span className="hidden sm:inline">{isLiveUpdating ? 'LIVE' : 'PAUSED'}</span>
        </button>

        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="sm:hidden p-2 text-[#131722] hover:bg-[#f0f3fa] rounded-full"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            aria-label="Select language"
            className="flex items-center space-x-1.5 text-[14px] font-semibold text-[#131722] hover:text-[#2962ff] px-2 py-1 rounded transition-colors"
          >
            <Globe className="w-5 h-5 text-[#131722]" />
            <span>{selectedLang}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-[#e0e3eb] rounded-xl shadow-lg py-1.5 z-50">
              <div className="px-3 py-1.5 text-[11px] font-bold text-[#787b86] uppercase tracking-wider">
                Language
              </div>
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setSelectedLang(l.code);
                    setShowLangMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-[#131722] hover:bg-[#f0f3fa] flex items-center justify-between"
                >
                  <span>{l.name}</span>
                  {selectedLang === l.code && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Icon Button */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User Account"
            className="p-1.5 text-[#131722] hover:text-[#2962ff] rounded-full hover:bg-[#f0f3fa] transition-colors"
          >
            <User className="w-6 h-6" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#e0e3eb] rounded-xl shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-[#e0e3eb]">
                <p className="text-xs font-bold text-[#131722]">Guest Trader</p>
                <p className="text-[11px] text-[#787b86]">Sign in to save watchlists</p>
              </div>
              <button 
                onClick={() => {
                  setShowUserMenu(false);
                  onOpenAuth('signin');
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#2962ff] hover:bg-[#f0f3fa]"
              >
                Sign In
              </button>
              <button 
                onClick={() => {
                  setShowUserMenu(false);
                  onOpenAuth('signup');
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#131722] hover:bg-[#f0f3fa]"
              >
                Create Account
              </button>
              <div className="border-t border-[#e0e3eb] my-1" />
              <button 
                onClick={() => {
                  setShowUserMenu(false);
                  alert('Watchlist is synced locally in your browser session.');
                }}
                className="w-full text-left px-4 py-2 text-xs text-[#131722] hover:bg-[#f0f3fa]"
              >
                My Watchlists
              </button>
              <button 
                onClick={() => {
                  setShowUserMenu(false);
                  alert('TradingView Market Alerts: Configure alert thresholds for S&P 500, Nasdaq, and NVDA.');
                }}
                className="w-full text-left px-4 py-2 text-xs text-[#131722] hover:bg-[#f0f3fa]"
              >
                Price Alerts
              </button>
            </div>
          )}
        </div>

        {/* Get Started Button */}
        <button
          onClick={() => onOpenAuth('signup')}
          className="tv-get-started-btn text-white text-[14px] font-semibold px-5 py-2 rounded-full shadow-sm cursor-pointer whitespace-nowrap"
        >
          Get started
        </button>
      </div>
    </header>
  );
};
