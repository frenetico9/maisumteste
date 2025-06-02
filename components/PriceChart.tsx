
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { MarketData } from '../types';
import { CHART_HEIGHT } from '../constants';

interface PriceChartProps {
  data: MarketData[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="p-2 bg-secondary-700 border border-secondary-600 rounded shadow-lg text-sm">
        <p className="label text-secondary-100">{`Time: ${new Date(dataPoint.time).toLocaleString()}`}</p>
        <p className="intro text-secondary-200">{`Close: ${dataPoint.close.toFixed(2)}`}</p>
        <p className="text-secondary-300">{`Open: ${dataPoint.open.toFixed(2)}`}</p>
        <p className="text-secondary-300">{`High: ${dataPoint.high.toFixed(2)}`}</p>
        <p className="text-secondary-300">{`Low: ${dataPoint.low.toFixed(2)}`}</p>
        <p className="text-secondary-300">{`Volume: ${dataPoint.volume.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};


export const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-10 text-secondary-500">No data to display for chart.</div>;
  }
  
  const formattedData = data.map(d => ({
    ...d,
    timeFormatted: new Date(d.time).toLocaleTimeString(),
  }));

  return (
    <div style={{ width: '100%', height: CHART_HEIGHT }}>
      <ResponsiveContainer>
        <LineChart data={formattedData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} stroke="#475569" />
          <XAxis 
            dataKey="timeFormatted" 
            tick={{ fontSize: 10, fill: '#94a3b8' }} 
            axisLine={{ stroke: '#475569' }}
            tickLine={{ stroke: '#475569' }}
          />
          <YAxis 
            domain={['auto', 'auto']}
            tickFormatter={(value) => value.toFixed(2)} 
            tick={{ fontSize: 10, fill: '#94a3b8' }} 
            axisLine={{ stroke: '#475569' }}
            tickLine={{ stroke: '#475569' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{fontSize: '12px', color: '#e2e8f0'}}/>
          <Line type="monotone" dataKey="close" stroke="#3b82f6" strokeWidth={2} dot={false} name="Close Price" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
