
import type { MarketData, CandleStickData } from '../types';
import { BINANCE_API_BASE_URL } from '../constants';

// This is a simplified client-side service. In a real app, this would be on a backend or use a proxy for CORS.
// For now, we'll use mocked data for candlestick and allow some basic real calls that might work.

export class BinanceService {
  /**
   * Fetches historical candlestick data.
   * @param symbol e.g., BTCUSDT
   * @param interval e.g., 1h, 4h, 1d
   * @param limit Number of data points
   */
  static async fetchCandlestickData(symbol: string, interval: string = '1h', limit: number = 100): Promise<MarketData[]> {
    const url = `${BINANCE_API_BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    try {
      // NOTE: Direct API calls from browser might be blocked by CORS.
      // This is more for demonstration. A backend proxy is usually needed.
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Binance API error for ${symbol}: ${response.status} ${response.statusText}`);
        // Fallback to mock data on error
        return this.getMockCandlestickData(symbol, limit);
      }
      const data: any[] = await response.json();
      return data.map(k => ({
        time: k[0],
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5]),
      }));
    } catch (error) {
      console.warn(`Failed to fetch live data for ${symbol} from Binance due to: ${(error as Error).message}. Using mock data.`);
      return this.getMockCandlestickData(symbol, limit);
    }
  }

  static getMockCandlestickData(symbol: string, limit: number = 100): MarketData[] {
    const mockData: MarketData[] = [];
    let lastClose = Math.random() * 50000 + 10000; // Start with a random price
    const now = Date.now();

    for (let i = 0; i < limit; i++) {
      const time = now - (limit - 1 - i) * 60 * 60 * 1000; // Hourly data
      const open = lastClose;
      const high = open * (1 + (Math.random() - 0.45) * 0.05); // +/- 5% fluctuation
      const low = open * (1 - (Math.random() - 0.45) * 0.05);
      const close = (high + low) / 2 * (1 + (Math.random() - 0.5) * 0.02);
      const volume = Math.random() * 1000 + 100;
      
      mockData.push({ time, open, high, low, close, volume });
      lastClose = close;
    }
    return mockData;
  }

  // Example of fetching current price ticker (might also face CORS)
  static async fetchCurrentPrice(symbol: string): Promise<{ price: number } | null> {
    const url = `${BINANCE_API_BASE_URL}/ticker/price?symbol=${symbol}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Binance API error: ${response.status}`);
      }
      const data = await response.json();
      return { price: parseFloat(data.price) };
    } catch (error) {
      console.error('Error fetching current price from Binance:', error);
      return null;
    }
  }
}
