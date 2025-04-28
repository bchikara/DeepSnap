import { DeepSeekService } from '../services/deepseekApi';
import { StorageService } from '../services/storage';
import { HistoryItem, ProcessingResult, ScreenshotData } from '../types/extension-types';

// Initialize services
const storage = new StorageService();
let deepSeek: DeepSeekService;

// Get API key from storage
chrome.runtime.onInstalled.addListener(async () => {
  deepSeek = new DeepSeekService(process.env.VITE_DEEPSEEK_API_KEY || '');

  // Create context menus
  chrome.contextMenus.create({
    id: 'capture-visible',
    title: 'Capture Visible Page',
    contexts: ['all']
  });

  chrome.contextMenus.create({
    id: 'capture-selection',
    title: 'Capture Selection Area',
    contexts: ['all']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;

  if (info.menuItemId === 'capture-visible') {
    await chrome.tabs.sendMessage(tab.id, {
      type: 'CAPTURE_VISIBLE'
    });
  } else if (info.menuItemId === 'capture-selection') {
    await chrome.tabs.sendMessage(tab.id, {
      type: 'CAPTURE_SELECTION'
    });
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  switch (request.type) {
    case 'PROCESS_SCREENSHOT':
      processScreenshot(request.data).then(sendResponse);
      return true;
    case 'SAVE_RESULT':
      storage.addToHistory(request.data).then(sendResponse);
      return true;
    case 'GET_HISTORY':
      storage.getHistory().then(sendResponse);
      return true;
  }
});

async function processScreenshot(data: ScreenshotData): Promise<ProcessingResult> {
  try {
    // Validate input
    if (!data.imageData) {
      throw new Error('No image data provided');
    }

    // Process with DeepSeek
    const result = await deepSeek.processScreenshot(data.imageData);

    // Store in history
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      imageData: data.imageData,
      result: result,
      url: data.url || ''
    };

    await storage.addToHistory(historyItem);

    return {
      success: true,
      data: historyItem
    };
  } catch (error) {
    console.error('Processing failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}