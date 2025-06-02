
import React from 'react';
import type { PerformanceMetrics } from '../types';

interface PerformanceMetricsDisplayProps {
  metrics: PerformanceMetrics;
}

const MetricItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-secondary-700 last:border-b-0">
    <span className="text-secondary-400">{label}:</span>
    <span className="font-semibold text-secondary-100">{value}</span>
  </div>
);

export const PerformanceMetricsDisplay: React.FC<PerformanceMetricsDisplayProps> = ({ metrics }) => {
  return (
    <div className="space-y-2 text-sm">
      <MetricItem label="Total Return" value={`${metrics.totalReturn.toFixed(2)}%`} />
      <MetricItem label="Sharpe Ratio" value={metrics.sharpeRatio.toFixed(3)} />
      <MetricItem label="Sortino Ratio" value={metrics.sortinoRatio.toFixed(3)} />
      <MetricItem label="Calmar Ratio" value={metrics.calmarRatio.toFixed(3)} />
      <MetricItem label="Max Drawdown" value={`${metrics.maxDrawdown.toFixed(2)}%`} />
      <MetricItem label="Total Trades" value={metrics.tradesCount} />
      <MetricItem label="Winning Trades" value={metrics.winningTrades} />
      <MetricItem label="Losing Trades" value={metrics.losingTrades} />
    </div>
  );
};
