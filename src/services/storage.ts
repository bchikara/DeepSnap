interface HistoryItem {
  id: string;
  timestamp: string;
  imageData: string;
  result: any;
  url: string;
}

interface Config {
  apiKey: string;
  maxHistoryItems: number;
}

const isChromeStorageAvailable = () =>
  typeof chrome !== 'undefined' && !!chrome.storage?.local;

export class StorageService {
  private readonly HISTORY_KEY = 'solutionHistory';
  private readonly CONFIG_KEY = 'userConfig';
  private readonly MAX_HISTORY = 10;

  public async addToHistory(item: Omit<HistoryItem, 'id'>): Promise<void> {
    if (!isChromeStorageAvailable()) return;

    const history = await this.getHistory();
    history.unshift({
      ...item,
      id: Date.now().toString()
    });

    const updatedHistory = history.slice(0, this.MAX_HISTORY);
    await chrome.storage.local.set({ [this.HISTORY_KEY]: updatedHistory });
  }

  public async getHistory(): Promise<HistoryItem[]> {
    if (!isChromeStorageAvailable()) return [];

    const result = await chrome.storage.local.get(this.HISTORY_KEY);
    return result[this.HISTORY_KEY] || [];
  }

  public async get<T>(key: string): Promise<T | undefined> {
    if (!isChromeStorageAvailable()) return undefined;

    const result = await chrome.storage.local.get(key);
    return result[key] as T | undefined;
  }

  public async clearHistory(): Promise<void> {
    if (!isChromeStorageAvailable()) return;

    await chrome.storage.local.remove(this.HISTORY_KEY);
  }

  public async getConfig(): Promise<Config> {
    if (!isChromeStorageAvailable()) {
      return { apiKey: '', maxHistoryItems: this.MAX_HISTORY };
    }

    const result = await chrome.storage.local.get(this.CONFIG_KEY);
    const config = result[this.CONFIG_KEY];

    if (!config) {
      return { apiKey: '', maxHistoryItems: this.MAX_HISTORY };
    }

    return config as Config;
  }

  public async updateConfig(newConfig: Partial<Config>): Promise<void> {
    if (!isChromeStorageAvailable()) return;

    const currentConfig = await this.getConfig();
    await chrome.storage.local.set({
      [this.CONFIG_KEY]: {
        ...currentConfig,
        ...newConfig
      }
    });
  }
}
