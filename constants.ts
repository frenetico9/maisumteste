
import type { Asset, Strategy, PerformanceMetrics } from './types';

export const AVAILABLE_ASSETS: Asset[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTCUSDT' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETHUSDT' },
  { id: 'solana', name: 'Solana', symbol: 'SOLUSDT' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADAUSDT' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGEUSDT' },
];

export const AVAILABLE_STRATEGIES: Strategy[] = [
  {
    id: 'mean_reversion',
    name: 'Mean Reversion',
    description: 'Identifies assets deviating from their historical mean and bets on their return. Often uses Bollinger Bands and RSI.',
    parameters: { rsiPeriod: 14, bbPeriod: 20, bbStdDev: 2 }
  },
  {
    id: 'trend_following',
    name: 'Trend Following',
    description: 'Capitalizes on sustained price movements. Often uses moving average crossovers.',
    parameters: { shortMAPeriod: 50, longMAPeriod: 200 }
  },
  {
    id: 'arbitrage',
    name: 'Arbitrage (Conceptual)',
    description: 'Exploits price differences of the same asset across different markets or related assets. (Conceptual for this simulation)',
  },
  {
    id: 'ml_prediction',
    name: 'Machine Learning Prediction (Conceptual)',
    description: 'Uses ML models (e.g., Random Forest, SVM) to predict returns or volatility. (Conceptual for this simulation)'
  },
  {
    id: 'garch_volatility',
    name: 'GARCH Volatility Trading (Conceptual)',
    description: 'Trades based on GARCH model predictions of volatility changes. (Conceptual for this simulation)'
  }
];

export const INITIAL_PERFORMANCE_METRICS: PerformanceMetrics = {
  totalReturn: 0,
  sharpeRatio: 0,
  sortinoRatio: 0,
  calmarRatio: 0,
  maxDrawdown: 0,
  tradesCount: 0,
  winningTrades: 0,
  losingTrades: 0,
};

export const BINANCE_API_BASE_URL = 'https://api.binance.com/api/v3';
// For klines: /api/v3/klines?symbol=BTCUSDT&interval=1h&limit=100
// For ticker: /api/v3/ticker/24hr?symbol=BTCUSDT

// Chart constants
export const CHART_HEIGHT = 400;
export const CHART_ASPECT = 3; // width / height
