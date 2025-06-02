
import React from 'react';
import type { Asset, Strategy, Trade, MarketData, PerformanceMetrics, BotState } from '../types';
import { AssetSelector } from './AssetSelector';
import { StrategySelector } from './StrategySelector';
import { PriceChart } from './PriceChart';
import { TradesLog } from './TradesLog';
import { PerformanceMetricsDisplay } from './PerformanceMetricsDisplay';
import { BotControls } from './BotControls';
import { GeminiInsightBox } from './GeminiInsightBox';
import { AppLogs } from './AppLogs';

interface DashboardProps {
  selectedAsset: Asset;
  setSelectedAsset: (asset: Asset) => void;
  availableAssets: Asset[];
  selectedStrategy: Strategy;
  setSelectedStrategy: (strategy: Strategy) => void;
  availableStrategies: Strategy[];
  marketData: MarketData[];
  trades: Trade[];
  performanceMetrics: PerformanceMetrics;
  botState: BotState;
  geminiInsight: string;
  onStartBot: (looping: boolean) => void;
  onStopBot: () => void;
  onRunBacktest: () => void;
  logs: string[];
  isBotLooping: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  selectedAsset,
  setSelectedAsset,
  availableAssets,
  selectedStrategy,
  setSelectedStrategy,
  availableStrategies,
  marketData,
  trades,
  performanceMetrics,
  botState,
  geminiInsight,
  onStartBot,
  onStopBot,
  onRunBacktest,
  logs,
  isBotLooping,
}) => {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Top Row: Controls & Bot Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-secondary-800 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-semibold text-primary-400 mb-4">Configuration & Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <AssetSelector
              assets={availableAssets}
              selectedAsset={selectedAsset}
              onSelectAsset={setSelectedAsset}
            />
            <StrategySelector
              strategies={availableStrategies}
              selectedStrategy={selectedStrategy}
              onSelectStrategy={setSelectedStrategy}
            />
          </div>
          <BotControls
            botState={botState}
            onStart={onStartBot}
            onStop={onStopBot}
            onRunBacktest={onRunBacktest}
            isBotLooping={isBotLooping}
          />
        </div>
        <div className="p-6 bg-secondary-800 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-semibold text-primary-400 mb-4">Performance Overview</h2>
          <PerformanceMetricsDisplay metrics={performanceMetrics} />
        </div>
      </div>

      {/* Middle Row: Chart & Gemini Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-secondary-800 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-semibold text-primary-400 mb-4">
            Market Data: {selectedAsset.name} ({selectedAsset.symbol})
          </h2>
          {marketData.length > 0 ? (
             <PriceChart data={marketData} />
          ) : (
            <div className="flex items-center justify-center h-64 text-secondary-500">
                No market data available or error fetching data.
            </div>
          )}
        </div>
        <div className="p-6 bg-secondary-800 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-semibold text-primary-400 mb-4">Gemini AI Insights</h2>
          <GeminiInsightBox insight={geminiInsight} />
        </div>
      </div>

      {/* Bottom Row: Trade Logs & App Logs */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-secondary-800 rounded-xl shadow-2xl h-96 overflow-y-auto">
          <h2 className="text-2xl font-semibold text-primary-400 mb-4">Simulated Trades Log</h2>
          <TradesLog trades={trades} />
        </div>
        <div className="p-6 bg-secondary-800 rounded-xl shadow-2xl h-96 overflow-y-auto">
            <h2 className="text-2xl font-semibold text-primary-400 mb-4">Application Logs</h2>
            <AppLogs logs={logs} />
        </div>
      </div>
    </div>
  );
};
