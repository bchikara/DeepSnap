const selectionOverlay = document.createElement('div')
Object.assign(selectionOverlay.style, {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 255, 0.1)',
  zIndex: '99999',
  cursor: 'crosshair'
})

let startX = 0
let startY = 0
let selectionBox: HTMLDivElement | null = null

selectionOverlay.onmousedown = (e) => {
  startX = e.clientX
  startY = e.clientY
  
  selectionBox = document.createElement('div')
  Object.assign(selectionBox.style, {
    position: 'absolute',
    border: '2px dashed #3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    pointerEvents: 'none'
  })
  
  selectionOverlay.appendChild(selectionBox)
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp, { once: true })
}

function onMouseMove(e: MouseEvent) {
  if (!selectionBox) return
  
  const width = Math.abs(e.clientX - startX)
  const height = Math.abs(e.clientY - startY)
  const left = Math.min(e.clientX, startX)
  const top = Math.min(e.clientY, startY)
  
  Object.assign(selectionBox.style, {
    width: `${width}px`,
    height: `${height}px`,
    left: `${left}px`,
    top: `${top}px`
  })
}

async function onMouseUp(_e: MouseEvent) {
  document.removeEventListener('mousemove', onMouseMove)
  
  if (selectionBox) {
    const rect = selectionBox.getBoundingClientRect()
    chrome.runtime.sendMessage({
      action: 'process-selection',
      coordinates: {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      }
    })
  }
  
  document.body.removeChild(selectionOverlay)
}

document.body.appendChild(selectionOverlay)