
import React from 'react';
import type { Asset } from '../types';
import { Select } from './shared/Select';

interface AssetSelectorProps {
  assets: Asset[];
  selectedAsset: Asset;
  onSelectAsset: (asset: Asset) => void;
}

export const AssetSelector: React.FC<AssetSelectorProps> = ({ assets, selectedAsset, onSelectAsset }) => {
  const options = assets.map(asset => ({ value: asset.id, label: `${asset.name} (${asset.symbol})` }));

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const asset = assets.find(a => a.id === selectedValue);
    if (asset) {
      onSelectAsset(asset);
    }
  };

  return (
    <div>
      <label htmlFor="asset-select" className="block text-sm font-medium text-secondary-300 mb-1">
        Select Asset
      </label>
      <Select
        id="asset-select"
        options={options}
        value={selectedAsset.id}
        onChange={handleChange}
      />
    </div>
  );
};
