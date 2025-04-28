import React from 'react';

interface CaptureModeSelectorProps {
  onCapture: (mode: 'visible' | 'selection') => void;
  isProcessing: boolean;
}

export const CaptureModeSelector: React.FC<CaptureModeSelectorProps> = ({
  onCapture,
  isProcessing
}) => {
  return (
    <div className="capture-mode-selector">
      <button
        onClick={() => onCapture('visible')}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Capture Visible Page'}
      </button>
      <button
        onClick={() => onCapture('selection')}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Capture Selection Area'}
      </button>
    </div>
  );
};