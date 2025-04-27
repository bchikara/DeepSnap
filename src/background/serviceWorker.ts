chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === 'process-selection') {
      if (!sender.tab?.windowId) {
        console.error('No window ID available')
        return
      }
      chrome.tabs.captureVisibleTab(sender.tab.windowId, { format: 'png' }, (dataUrl) => {
        chrome.runtime.sendMessage({ action: 'process-screenshot', dataUrl })
      })
    }
  })