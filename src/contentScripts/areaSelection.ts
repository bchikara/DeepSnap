let selectionActive = false;
let startX = 0;
let startY = 0;
let selectionBox: HTMLDivElement | null = null;

// Listen for messages from background
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'CAPTURE_SELECTION') {
    startSelection();
    sendResponse({ status: 'selection_started' });
  }
  return true;
});

function startSelection() {
  if (selectionActive) return;
  selectionActive = true;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '999999';
  overlay.style.cursor = 'crosshair';
  overlay.id = 'selection-overlay';

  // Create selection box
  selectionBox = document.createElement('div');
  selectionBox.style.position = 'absolute';
  selectionBox.style.border = '2px dashed #ffffff';
  selectionBox.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  selectionBox.style.display = 'none';
  overlay.appendChild(selectionBox);

  // Add to document
  document.body.appendChild(overlay);

  // Event listeners
  overlay.addEventListener('mousedown', handleMouseDown);
  overlay.addEventListener('mousemove', handleMouseMove);
  overlay.addEventListener('mouseup', handleMouseUp);
  overlay.addEventListener('keydown', handleKeyDown);
  overlay.focus();
}

function handleMouseDown(e: MouseEvent) {
  if (!selectionBox || !selectionActive) return;
  
  startX = e.clientX;
  startY = e.clientY;
  
  selectionBox.style.left = `${startX}px`;
  selectionBox.style.top = `${startY}px`;
  selectionBox.style.width = '0px';
  selectionBox.style.height = '0px';
  selectionBox.style.display = 'block';
}

function handleMouseMove(e: MouseEvent) {
  if (!selectionBox || !selectionActive) return;
  
  const width = e.clientX - startX;
  const height = e.clientY - startY;
  
  selectionBox.style.width = `${Math.abs(width)}px`;
  selectionBox.style.height = `${Math.abs(height)}px`;
  selectionBox.style.left = `${width > 0 ? startX : e.clientX}px`;
  selectionBox.style.top = `${height > 0 ? startY : e.clientY}px`;
}

async function handleMouseUp(e: MouseEvent) {
  if (!selectionActive) return;
  
  const overlay = document.getElementById('selection-overlay');
  if (overlay) overlay.remove();
  
  selectionActive = false;
  
  const endX = e.clientX;
  const endY = e.clientY;
  
  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);
  
  if (width < 10 || height < 10) {
    chrome.runtime.sendMessage({ type: 'SELECTION_CANCELLED' });
    return;
  }
  
  // Capture the selected area
  const screenshotUrl = await chrome.runtime.sendMessage({
    type: 'CAPTURE_AREA',
    data: { left, top, width, height }
  });
  
  // Process the screenshot
  chrome.runtime.sendMessage({
    type: 'PROCESS_SCREENSHOT',
    data: {
      imageData: screenshotUrl,
      url: window.location.href
    }
  });
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && selectionActive) {
    const overlay = document.getElementById('selection-overlay');
    if (overlay) overlay.remove();
    selectionActive = false;
    chrome.runtime.sendMessage({ type: 'SELECTION_CANCELLED' });
  }
}