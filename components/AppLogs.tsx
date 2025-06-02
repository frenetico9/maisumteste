
import React from 'react';

interface AppLogsProps {
  logs: string[];
}

export const AppLogs: React.FC<AppLogsProps> = ({ logs }) => {
  if (logs.length === 0) {
    return <p className="text-sm text-secondary-500">No application logs yet.</p>;
  }

  return (
    <div className="space-y-1 text-xs font-mono">
      {logs.map((log, index) => (
        <p key={index} className="text-secondary-400 leading-tight">
          {log}
        </p>
      ))}
    </div>
  );
};
