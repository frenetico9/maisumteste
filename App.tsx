
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Dashboard } from './components/Dashboard';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { GeminiService } from './services/geminiService';
import { BinanceService } from './services/binanceService';
import type { Asset, Strategy, Trade, MarketData, PerformanceMetrics, GeminiSignalResponse } from './types';
import { BotState } from './types';
import { AVAILABLE_ASSETS, AVAILABLE_STRATEGIES, INITIAL_PERFORMANCE_METRICS } from './constants';

const App: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset>(AVAILABLE_ASSETS[0]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(AVAILABLE_STRATEGIES[0]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>(INITIAL_PERFORMANCE_METRICS);
  const [botState, setBotState] = useState<BotState>(BotState.STOPPED);
  const [geminiInsight, setGeminiInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBotLooping, setIsBotLooping] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Safely access API_KEY
  const apiKey = (typeof process !== 'undefined' && process.env && typeof process.env.API_KEY === 'string')
    ? process.env.API_KEY
    : undefined;

  const [geminiService, initializationError] = useMemo(() => {
    if (apiKey) {
      try {
        return [new GeminiService(apiKey), null];
      } catch (error) {
        console.error("Failed to initialize GeminiService:", error);
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error initializing Gemini Service.";
        return [null, errorMessage];
      }
    }
    // API key not present or not a string, service will be null, no error from this stage.
    // The !apiKey check below will handle displaying the primary configuration error.
    return [null, null];
  }, [apiKey]);

  const addLog = useCallback((message: string) => {
    setLogs(prevLogs => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prevLogs.slice(0, 99)]);
  }, []);

  const fetchMarketData = useCallback(async () => {
    if (!selectedAsset) return;
    addLog(`Fetching market data for ${selectedAsset.symbol}...`);
    try {
      const data = await BinanceService.fetchCandlestickData(selectedAsset.symbol, '1h', 50);
      setMarketData(data);
      addLog(`Market data for ${selectedAsset.symbol} updated.`);
      return data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      addLog(`Error fetching market data: ${(error as Error).message}`);
      setMarketData(prevData => prevData.length > 0 ? prevData : [{ time: Date.now(), open: 0, high: 0, low: 0, close: 0, volume: 0 }]);
      return null;
    }
  }, [selectedAsset, addLog]);

  const generateSignalAndSimulateTrade = useCallback(async () => {
    if (!geminiService || botState !== BotState.RUNNING || !selectedAsset || !selectedStrategy) {
        if (botState === BotState.RUNNING) addLog("Cannot generate signal: conditions not met (Gemini service, asset, or strategy missing).");
        return;
    }
    
    setIsLoading(true);
    setGeminiInsight('');
    addLog(`Generating signal for ${selectedAsset.symbol} using ${selectedStrategy.name}...`);

    const currentMarketData = await fetchMarketData();
    if (!currentMarketData || currentMarketData.length === 0) {
        addLog("Signal generation skipped: No market data available.");
        setIsLoading(false);
        return;
    }
    const latestPrice = currentMarketData[currentMarketData.length - 1].close;

    try {
      const prompt = `
        Analyze the following market context for ${selectedAsset.name} (${selectedAsset.symbol}) and generate a trading signal based on the ${selectedStrategy.name} strategy.
        Current Price: ${latestPrice} USD.
        Strategy Description: ${selectedStrategy.description}.
        Recent Market Data (last 5 periods, OHLCV): 
        ${currentMarketData.slice(-5).map(d => `Time: ${new Date(d.time).toISOString()}, Open: ${d.open}, High: ${d.high}, Low: ${d.low}, Close: ${d.close}, Volume: ${d.volume}`).join('\n')}
        
        Consider standard parameters for ${selectedStrategy.name}, for example:
        ${selectedStrategy.id === 'mean_reversion' ? 'RSI period: 14, Bollinger Bands period: 20, std dev: 2.' : ''}
        ${selectedStrategy.id === 'trend_following' ? 'Moving Average periods: 50 and 200.' : ''}
        ${selectedStrategy.id === 'arbitrage' && AVAILABLE_ASSETS.length > 1 ? `Compare with ${AVAILABLE_ASSETS[1].symbol}.` : ''}

        Output a JSON object with the following structure:
        {
          "signal": "BUY" | "SELL" | "HOLD",
          "confidence": number (0.0 to 1.0),
          "reasoning": "Brief explanation for the signal.",
          "suggestedParameters": { /* key-value pairs of suggested parameters if applicable */ }
        }
        Only provide the JSON object.
      `;
      
      const result: GeminiSignalResponse = await geminiService.generateJson(prompt);

      setGeminiInsight(`Signal: ${result.signal}, Confidence: ${result.confidence?.toFixed(2)}\nReasoning: ${result.reasoning}`);
      addLog(`Gemini insight: ${result.signal} signal for ${selectedAsset.symbol} with confidence ${result.confidence?.toFixed(2)}. Reasoning: ${result.reasoning}`);

      if (result.signal === 'BUY' || result.signal === 'SELL') {
        const newTrade: Trade = {
          id: `trade-${Date.now()}-${trades.length}`,
          asset: selectedAsset.symbol,
          strategy: selectedStrategy.name,
          type: result.signal,
          price: latestPrice,
          quantity: 1,
          timestamp: Date.now(),
          pnl: 0
        };
        setTrades(prev => [newTrade, ...prev]);
        addLog(`Simulated ${result.signal} trade for ${selectedAsset.symbol} at ${latestPrice}.`);
      }
    } catch (error) {
      console.error('Error generating signal or parsing Gemini response:', error);
      const errorMessage = `Error generating signal: ${(error as Error).message}`;
      setGeminiInsight(errorMessage);
      addLog(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [geminiService, botState, selectedAsset, selectedStrategy, trades.length, addLog, fetchMarketData]);


  useEffect(() => {
    fetchMarketData();
  }, [selectedAsset, fetchMarketData]);


  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (botState === BotState.RUNNING && isBotLooping && geminiService) { // Ensure geminiService is available for looping
      addLog("Bot started in looping mode. Generating signal every 30 seconds.");
      generateSignalAndSimulateTrade();
      intervalId = setInterval(generateSignalAndSimulateTrade, 30000);
    } else if (botState === BotState.STOPPED && intervalId) {
      addLog("Bot stopped. Clearing signal generation loop.");
      clearInterval(intervalId);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        addLog("Cleaned up bot loop on component unmount or state change.");
      }
    };
  }, [botState, isBotLooping, generateSignalAndSimulateTrade, addLog, geminiService]);

  const handleStartBot = useCallback((looping: boolean) => {
    if (!geminiService) {
      addLog("Cannot start bot: Gemini Service not available.");
      setGeminiInsight(initializationError || "Error: Gemini Service is not available. This usually means the API key is missing or invalid.");
      return;
    }
    setBotState(BotState.RUNNING);
    setIsBotLooping(looping);
    if (!looping) {
        addLog("Bot started for single signal generation.");
        generateSignalAndSimulateTrade();
    } else {
        addLog("Bot started in continuous looping mode.");
    }
  }, [geminiService, initializationError, addLog, generateSignalAndSimulateTrade]);

  const handleStopBot = () => {
    setBotState(BotState.STOPPED);
    setIsBotLooping(false);
    addLog("Bot stopped manually.");
  };

  const handleRunBacktest = useCallback(async () => {
    if (!geminiService || !selectedAsset || !selectedStrategy) {
      addLog("Cannot run backtest: Gemini service, asset, or strategy missing.");
      setGeminiInsight(initializationError || "Backtest requires Gemini Service. Check API Key and configuration.");
      return;
    }
    setIsLoading(true);
    setGeminiInsight('');
    addLog(`Running simulated backtest for ${selectedAsset.symbol} with ${selectedStrategy.name}...`);

    try {
      const prompt = `
        Provide a conceptual summary of a backtest for ${selectedAsset.name} (${selectedAsset.symbol}) using the ${selectedStrategy.name} strategy over a hypothetical past year.
        Strategy Description: ${selectedStrategy.description}.
        Assume typical market conditions for crypto.
        Include hypothetical performance metrics like:
        - Total Return (%)
        - Max Drawdown (%)
        - Sharpe Ratio
        - Sortino Ratio
        - Calmar Ratio
        - Number of Trades
        Also, briefly explain how Monte Carlo simulation could assess the robustness of these results and what Value at Risk (VaR) at 95% confidence might imply for this strategy.
        Keep the response concise and informative. Structure as a summary.
      `;
      const response = await geminiService.generateText(prompt);
      setGeminiInsight(response);
      addLog(`Backtest simulation summary received from Gemini for ${selectedAsset.symbol}.`);
    } catch (error) {
      console.error('Error running backtest:', error);
      const errorMessage = `Error running backtest: ${(error as Error).message}`;
      setGeminiInsight(errorMessage);
      addLog(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [geminiService, selectedAsset, selectedStrategy, addLog, initializationError]);

  if (!apiKey) {
    return (
        <div className="flex items-center justify-center h-screen bg-secondary-900 text-secondary-100">
            <div className="p-8 bg-secondary-800 rounded-lg shadow-xl text-center">
                <h1 className="text-2xl font-bold text-danger mb-4">Configuration Error</h1>
                <p className="text-lg">The Gemini API key (API_KEY) is not configured in your environment variables.</p>
                <p className="mt-2">Please set the API_KEY to use this application.</p>
            </div>
        </div>
    );
  }

  if (initializationError) {
    return (
        <div className="flex items-center justify-center h-screen bg-secondary-900 text-secondary-100">
            <div className="p-8 bg-secondary-800 rounded-lg shadow-xl text-center">
                <h1 className="text-2xl font-bold text-danger mb-4">Gemini Service Initialization Error</h1>
                <p className="text-lg">The application could not start due to an error initializing the Gemini API service:</p>
                <p className="mt-2 text-secondary-300">{initializationError}</p>
                <p className="mt-4">Please check your API key and the browser console for more details. The application cannot continue.</p>
            </div>
        </div>
    );
  }
  
  if (!geminiService) {
     // This state implies API key was present, no specific init error was caught by useMemo's catch block,
     // but service is still null. This should be rare if useMemo logic is correct.
     console.error("Critical: Gemini service is unexpectedly null despite API key and no explicit initialization error. This may indicate an issue with the environment or SDK.");
     return (
        <div className="flex items-center justify-center h-screen bg-secondary-900 text-secondary-100">
            {isLoading && <LoadingSpinner />} {/* Show spinner if some other loading is active */}
            <div className="p-8 bg-secondary-800 rounded-lg shadow-xl text-center">
                <h1 className="text-2xl font-bold text-danger mb-4">Application Error</h1>
                <p className="text-lg">A critical error occurred: Gemini service could not be established.</p>
                <p className="mt-2">Please check the console for details or try refreshing the application.</p>
            </div>
        </div>
     );
  }


  return (
    <div className="min-h-screen bg-secondary-900 text-secondary-100 p-4 sm:p-6 lg:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary-400">Crypto Quant Trading Bot</h1>
        <p className="text-secondary-400">AI-Powered Trading Insights & Simulation</p>
      </header>

      {isLoading && <LoadingSpinner />}

      <Dashboard
        selectedAsset={selectedAsset}
        setSelectedAsset={setSelectedAsset}
        availableAssets={AVAILABLE_ASSETS}
        selectedStrategy={selectedStrategy}
        setSelectedStrategy={setSelectedStrategy}
        availableStrategies={AVAILABLE_STRATEGIES}
        marketData={marketData}
        trades={trades}
        performanceMetrics={performanceMetrics}
        botState={botState}
        geminiInsight={geminiInsight}
        onStartBot={handleStartBot}
        onStopBot={handleStopBot}
        onRunBacktest={handleRunBacktest}
        logs={logs}
        isBotLooping={isBotLooping}
      />
       <footer className="mt-12 text-center text-sm text-secondary-500">
        <p>&copy; {new Date().getFullYear()} Advanced Crypto Analytics. For simulation purposes only.</p>
        <p>Ensure your API_KEY environment variable is set to use Gemini features.</p>
      </footer>
    </div>
  );
};

export default App;
