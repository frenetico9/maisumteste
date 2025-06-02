
import React from 'react';
import type { Trade } from '../types';

interface TradesLogProps {
  trades: Trade[];
}

export const TradesLog: React.FC<TradesLogProps> = ({ trades }) => {
  if (trades.length === 0) {
    return <p className="text-sm text-secondary-500">No simulated trades yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-secondary-300">
        <thead className="text-xs text-secondary-400 uppercase bg-secondary-700">
          <tr>
            <th scope="col" className="px-4 py-2">Time</th>
            <th scope="col" className="px-4 py-2">Asset</th>
            <th scope="col" className="px-4 py-2">Strategy</th>
            <th scope="col" className="px-4 py-2">Type</th>
            <th scope="col" className="px-4 py-2">Price</th>
            <th scope="col" className="px-4 py-2">Qty</th>
            {/* <th scope="col" className="px-4 py-2">P&L</th> */}
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={trade.id} className="bg-secondary-800 border-b border-secondary-700 hover:bg-secondary-600/50">
              <td className="px-4 py-2">{new Date(trade.timestamp).toLocaleString()}</td>
              <td className="px-4 py-2">{trade.asset}</td>
              <td className="px-4 py-2">{trade.strategy}</td>
              <td className={`px-4 py-2 font-semibold ${trade.type === 'BUY' ? 'text-success' : 'text-danger'}`}>
                {trade.type}
              </td>
              <td className="px-4 py-2">${trade.price.toFixed(2)}</td>
              <td className="px-4 py-2">{trade.quantity}</td>
              {/* <td className={`px-4 py-2 ${trade.pnl && trade.pnl > 0 ? 'text-success' : trade.pnl && trade.pnl < 0 ? 'text-danger' : ''}`}>
                {trade.pnl !== undefined ? trade.pnl.toFixed(2) : '-'}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
