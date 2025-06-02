
export interface Asset {
  id: string;
  name: string;
  symbol: string; // e.g., BTCUSDT for Binance
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  parameters?: Record<string, any>; // e.g., { period: 14, threshold: 70 }
}

export interface MarketData {
  time: number; // Unix timestamp (ms)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TradeType = 'BUY' | 'SELL';

export interface Trade {
  id: string;
  asset: string;
  strategy: string;
  type: TradeType;
  price: number;
  quantity: number;
  timestamp: number;
  pnl?: number; // Profit and Loss
}

export interface PerformanceMetrics {
  totalReturn: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  tradesCount: number;
  winningTrades: number;
  losingTrades: number;
}

export enum BotState {
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
  IDLE = 'IDLE', // Could be used if bot is on but not actively trading
}

export interface CandleStickData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

// For Gemini generateContent response parsing
export interface GeminiSignalResponse {
  signal: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reasoning: string;
  suggestedParameters?: Record<string, any>;
}
