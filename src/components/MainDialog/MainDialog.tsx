import React, { useState } from 'react';
import { useDraggable } from '../../hooks/useDraggable';
import { CodeViewer } from '../CodeViewer/CodeViewer';
import { AnnotationTools } from '../AnnotationTools/AnnotationTools';
import ReactMarkdown from 'react-markdown';
import { CSSProperties } from 'react';

interface MainDialogProps {
  result: any;
  isProcessing: boolean;
  apiKey: string;
  onApiKeySave: (key: string) => void;
}





export const MainDialog: React.FC<MainDialogProps> = ({
  result,
  isProcessing,
  apiKey,
  onApiKeySave
}) => {
  const [activeTab, setActiveTab] = useState<'solution' | 'annotate' | 'settings'>('solution');
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const { ref } = useDraggable();

  const handleSaveApiKey = () => {
    onApiKeySave(localApiKey);
  };

  const dialogStyle: CSSProperties = {
    width: '100%',
    height: '500px',
    border: '1px solid #444',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'absolute'
  };

  return (
    <div 
      ref={ref}
      className="main-dialog"
      style={dialogStyle}
    >
      <div className="dialog-tabs">
        <button
          className={activeTab === 'solution' ? 'active' : ''}
          onClick={() => setActiveTab('solution')}
        >
          Solution
        </button>
        <button
          className={activeTab === 'annotate' ? 'active' : ''}
          onClick={() => setActiveTab('annotate')}
          disabled={!result}
        >
          Annotate
        </button>
        <button
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="dialog-content">
        {isProcessing ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Processing screenshot...</p>
          </div>
        ) : activeTab === 'solution' ? (
          result ? (
            result.result.isCode ? (
              <CodeViewer 
                code={result.result.solution}
                language={result.result.language || 'text'}
              />
            ) : (
              <div className="solution-text">
                <ReactMarkdown>{result.result.solution}</ReactMarkdown>
                {result.result.steps && (
                  <div className="solution-steps">
                    <h4>Steps:</h4>
                    <ol>
                      {result.result.steps.map((step: string, i: number) => (
                        <li key={i}>
                          <ReactMarkdown>{step}</ReactMarkdown>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="empty-state">
              <p>Capture a screenshot to get started</p>
            </div>
          )
        ) : activeTab === 'annotate' ? (
          <AnnotationTools imageData={result?.imageData} />
        ) : (
          <div className="settings-tab">
            <div className="api-key-section">
              <h4>DeepSeek API Key</h4>
              <input
                type="password"
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
              <button onClick={handleSaveApiKey}>Save</button>
            </div>
            <div className="export-section">
              <h4>Export Options</h4>
              <button>Export as PNG</button>
              <button>Export as JSON</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};