import React from 'react';

interface HistoryItem {
  id: string;
  timestamp: string;
  imageData: string;
  result: any;
  url: string;
}

interface HistoryPanelProps {
  items: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ items, onSelectItem }) => {
  return (
    <div className="history-panel">
      <h3>Recent Solutions</h3>
      {items.length === 0 ? (
        <p className="empty-history">No history yet</p>
      ) : (
        <ul className="history-list">
          {items.map((item) => (
            <li key={item.id} onClick={() => onSelectItem(item)}>
              <div className="history-item">
                <img 
                  src={item.imageData} 
                  alt="Screenshot thumbnail" 
                  className="thumbnail" 
                />
                <div className="item-info">
                  <span className="time">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                  <span className="url">
                    {new URL(item.url).hostname}
                  </span>
                  <span className="preview">
                    {item.result.solution.substring(0, 50)}...
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};