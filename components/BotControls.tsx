
import React from 'react';
import type { BotState } from '../types';
import { Button } from './shared/Button';

interface BotControlsProps {
  botState: BotState;
  onStart: (looping: boolean) => void;
  onStop: () => void;
  onRunBacktest: () => void;
  isBotLooping: boolean;
}

export const BotControls: React.FC<BotControlsProps> = ({ botState, onStart, onStop, onRunBacktest, isBotLooping }) => {
  return (
    <div className="mt-4 space-y-3 sm:space-y-0 sm:space-x-3 flex flex-col sm:flex-row items-center">
      {botState !== 'RUNNING' && (
        <>
          <Button 
            onClick={() => onStart(false)} 
            className="w-full sm:w-auto bg-success hover:bg-green-500"
            iconClass="fas fa-play"
          >
            Generate Signal
          </Button>
          <Button 
            onClick={() => onStart(true)} 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500"
            iconClass="fas fa-sync-alt"
          >
            Start Loop
          </Button>
        </>
      )}
      {botState === 'RUNNING' && (
        <Button 
          onClick={onStop} 
          className="w-full sm:w-auto bg-danger hover:bg-red-500"
          iconClass="fas fa-stop"
        >
          Stop Bot {isBotLooping ? "(Looping)" : ""}
        </Button>
      )}
      <Button 
        onClick={onRunBacktest} 
        className="w-full sm:w-auto bg-primary-600 hover:bg-primary-500"
        iconClass="fas fa-history"
        disabled={botState === 'RUNNING'}
      >
        Run Backtest (Sim)
      </Button>
      <div className="ml-0 sm:ml-4 mt-2 sm:mt-0 text-sm text-secondary-400">
        Status: <span className={`font-semibold ${botState === 'RUNNING' ? 'text-success' : 'text-warning'}`}>{botState}{isBotLooping && botState === 'RUNNING' ? ' (Looping)' : ''}</span>
      </div>
    </div>
  );
};
