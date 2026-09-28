import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#e0e3eb] bg-white py-6 text-xs text-[#787b86]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span>© 2024 TradingView</span>
          <span>•</span>
          <a href="#" className="hover:text-[#131722] transition-colors">Terms of service</a>
          <span>•</span>
          <a href="#" className="hover:text-[#131722] transition-colors">Privacy policy</a>
        </div>
        <div>
          <span className="text-[#787b86]">Market quotes are real-time or delayed by at least 15 minutes.</span>
        </div>
      </div>
    </footer>
  );
};
