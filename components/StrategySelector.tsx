
import React from 'react';
import type { Strategy } from '../types';
import { Select } from './shared/Select';

interface StrategySelectorProps {
  strategies: Strategy[];
  selectedStrategy: Strategy;
  onSelectStrategy: (strategy: Strategy) => void;
}

export const StrategySelector: React.FC<StrategySelectorProps> = ({ strategies, selectedStrategy, onSelectStrategy }) => {
  const options = strategies.map(strategy => ({ value: strategy.id, label: strategy.name }));

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const strategy = strategies.find(s => s.id === selectedValue);
    if (strategy) {
      onSelectStrategy(strategy);
    }
  };

  return (
    <div>
      <label htmlFor="strategy-select" className="block text-sm font-medium text-secondary-300 mb-1">
        Select Strategy
      </label>
      <Select
        id="strategy-select"
        options={options}
        value={selectedStrategy.id}
        onChange={handleChange}
      />
      {selectedStrategy && (
        <p className="mt-2 text-xs text-secondary-400">{selectedStrategy.description}</p>
      )}
    </div>
  );
};
