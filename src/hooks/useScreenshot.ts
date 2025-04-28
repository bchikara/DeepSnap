import { useState } from 'react';

export const useScreenshot = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureVisibleTab = async (): Promise<string> => {
    setIsCapturing(true);
    setError(null);
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error('No active tab found');

      const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
        format: 'png',
        quality: 100
      });

      return dataUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to capture tab');
      throw err;
    } finally {
      setIsCapturing(false);
    }
  };

  const captureSelectionArea = async (_bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): Promise<string> => {
    setIsCapturing(true);
    setError(null);

    try {
      // For now, we'll just capture the visible tab
      // In a real implementation, you'd use html2canvas or similar
      console.warn('Selection capture not fully implemented - capturing visible tab instead');
      return await captureVisibleTab();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to capture selection');
      throw err;
    } finally {
      setIsCapturing(false);
    }
  };

  return {
    captureVisibleTab,
    captureSelectionArea,
    isCapturing,
    error
  };
};