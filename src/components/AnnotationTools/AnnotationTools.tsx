import React, { useRef, useEffect, useState } from 'react';

interface AnnotationToolsProps {
  imageData?: string;
}

export const AnnotationTools: React.FC<AnnotationToolsProps> = ({ imageData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<'rectangle' | 'arrow' | 'text' | 'freehand'>('rectangle');
  const [color, setColor] = useState('#ff0000');
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [textInput, setTextInput] = useState('');
  const [textPos, setTextPos] = useState({ x: 0, y: 0 });
  const [showTextInput, setShowTextInput] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !imageData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageData;
  }, [imageData]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPos({ x, y });
    setDrawing(true);

    if (tool === 'text') {
      setTextPos({ x, y });
      setShowTextInput(true);
      setDrawing(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Redraw the base image
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Draw the current shape
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.fillStyle = color + '40'; // Add transparency

      switch (tool) {
        case 'rectangle':
          ctx.beginPath();
          ctx.rect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
          ctx.stroke();
          ctx.fill();
          break;
        case 'arrow':
          drawArrow(ctx, startPos.x, startPos.y, x, y);
          break;
        case 'freehand':
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(startPos.x, startPos.y);
          ctx.lineTo(x, y);
          ctx.stroke();
          setStartPos({ x, y });
          break;
      }
    };
    img.src = imageData || '';
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) => {
    const headLength = 15;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    // Arrow head
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const handleTextSubmit = () => {
    if (!canvasRef.current || !textInput) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.font = '16px Arial';
    ctx.fillStyle = color;
    ctx.fillText(textInput, textPos.x, textPos.y);

    setTextInput('');
    setShowTextInput(false);
  };

  return (
    <div className="annotation-tools">
      <div className="toolbar">
        <button
          className={tool === 'rectangle' ? 'active' : ''}
          onClick={() => setTool('rectangle')}
        >
          ▢
        </button>
        <button
          className={tool === 'arrow' ? 'active' : ''}
          onClick={() => setTool('arrow')}
        >
          →
        </button>
        <button
          className={tool === 'text' ? 'active' : ''}
          onClick={() => setTool('text')}
        >
          T
        </button>
        <button
          className={tool === 'freehand' ? 'active' : ''}
          onClick={() => setTool('freehand')}
        >
          ✎
        </button>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <button>Clear</button>
        <button>Save</button>
      </div>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {showTextInput && (
        <div
          className="text-input-modal"
          style={{
            position: 'absolute',
            left: `${textPos.x}px`,
            top: `${textPos.y}px`
          }}
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            autoFocus
          />
          <button onClick={handleTextSubmit}>Add</button>
          <button onClick={() => setShowTextInput(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};