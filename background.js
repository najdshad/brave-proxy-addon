// Background script for proxy management
chrome.runtime.onInstalled.addListener(() => {
  console.log('Proxy Switcher extension installed');
  
  // Set default settings
  chrome.storage.local.set({
    activeProxy: 'direct',
    authCredentials: { username: '', password: '' }
  });
});

// Handle extension icon clicks (alternative to popup)
chrome.action.onClicked.addListener((tab) => {
  // Open popup - this is handled by manifest action property
  // This handler can be used for additional functionality if needed
});

// Monitor proxy settings changes
chrome.proxy.onProxyError.addListener((details) => {
  console.error('Proxy error:', details);
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.activeProxy) {
    console.log('Active proxy changed to:', changes.activeProxy.newValue);
  }
});