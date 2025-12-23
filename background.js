chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    activeProxy: 'direct',
    proxyUrls: {
      http: '127.0.0.1:10808',
      socks5: '127.0.0.1:10808'
    }
  });
});

chrome.action.onClicked.addListener((tab) => {
});

chrome.proxy.onProxyError.addListener((details) => {
  console.error('Proxy error occurred');
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.activeProxy) {
  }
});