
import React from 'react';

interface GeminiInsightBoxProps {
  insight: string;
}

export const GeminiInsightBox: React.FC<GeminiInsightBoxProps> = ({ insight }) => {
  return (
    <div className="h-full max-h-80 overflow-y-auto p-4 bg-secondary-900 rounded-lg border border-secondary-700">
      {insight ? (
        <pre className="whitespace-pre-wrap text-sm text-secondary-300 leading-relaxed">
          {insight}
        </pre>
      ) : (
        <p className="text-sm text-secondary-500">No insights to display. Generate a signal or run a backtest.</p>
      )}
    </div>
  );
};
