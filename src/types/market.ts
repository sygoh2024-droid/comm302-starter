export type CategoryType = 
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy';

export type Timeframe = '1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | 'ALL';

export interface ChartPoint {
  time: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

export interface Instrument {
  id: string;
  symbol: string;
  name: string;
  category: CategoryType;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  badgeText?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  high: number;
  low: number;
  volume?: string;
  sparkline: number[];
  chartData: Record<Timeframe, ChartPoint[]>;
  marketCap?: string;
  peRatio?: number;
  country?: string;
}

export interface WorldIndex {
  symbol: string;
  name: string;
  countryCode: string;
  countryBg: string;
  countryTextColor: string;
  last: number;
  changePercent: number;
  trendValue: number;
  isPositive: boolean;
}

export interface ActiveStock {
  ticker: string;
  name: string;
  logoText: string;
  logoBg: string;
  logoColor: string;
  price: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  pe: string;
  sector: string;
}

export interface QuickTicker {
  symbol: string;
  name: string;
  price: string;
  changePercent: number;
}
