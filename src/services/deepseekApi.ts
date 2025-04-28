import Tesseract from 'tesseract.js';

interface OcrResult {
  text: string;
  confidence: number;
  hocr?: string;
}

interface SolutionResponse {
  solution: string;
  steps?: string[];
  isCode: boolean;
  language?: string;
}

export class DeepSeekService {
  private readonly apiUrl = 'https://api.deepseek.com/v1';
  
  constructor(private apiKey: string) {
    if (!apiKey) {
      console.error('DeepSeek API key is missing. Please set VITE_DEEPSEEK_API_KEY in your .env file');
    }
  }

  public async processScreenshot(imageData: string): Promise<SolutionResponse> {
    const ocrResult = await this.performOcr(imageData);
    return this.analyzeWithDeepSeek(imageData, ocrResult.text);
  }

  private async performOcr(imageData: string): Promise<OcrResult> {
    const result = await Tesseract.recognize(
      imageData,
      'eng+code',
      {
        logger: progress => console.debug('OCR Progress:', progress)
      }
    );

    return {
      text: result.data.text,
      confidence: result.data.confidence,
      hocr: result.data.hocr || undefined
    };
  }

  private async analyzeWithDeepSeek(imageData: string, text: string): Promise<SolutionResponse> {
    const response = await fetch(`${this.apiUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        image: imageData,
        text: text,
        options: {
          detail_level: 'high',
          include_steps: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  public updateApiKey(newKey: string): void {
    this.apiKey = newKey;
  }
}