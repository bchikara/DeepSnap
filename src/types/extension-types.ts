export interface ScreenshotData {
    imageData: string;
    url?: string;
    tabId?: number;
    bounds?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }
  
  export interface ProcessingResult {
    success: boolean;
    data?: HistoryItem;
    error?: string;
  }
  
  export interface HistoryItem {
    id: string;
    timestamp: string;
    imageData: string;
    result: SolutionResponse;
    url: string;
  }
  
  export interface SolutionResponse {
    solution: string;
    steps?: string[];
    isCode: boolean;
    language?: string;
  }
  
  export interface OcrResult {
    text: string;
    confidence: number;
    hocr?: string;
  }