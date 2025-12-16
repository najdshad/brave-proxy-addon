document.addEventListener('DOMContentLoaded', function() {
  initializeProxyToggle();
  loadSavedSettings();
  updateActiveProxy();
});

function initializeProxyToggle() {
  const proxyItems = document.querySelectorAll('.proxy-item');
  
  proxyItems.forEach(item => {
    item.addEventListener('click', function(e) {
      if (e.target.closest('.proxy-toggle')) {
        e.stopPropagation();
        toggleProxy(item);
      } else {
        toggleProxy(item);
      }
    });
  });
}

async function toggleProxy(item) {
  const proxyType = item.dataset.proxy;
  const toggle = item.querySelector('.proxy-toggle');
  
  try {
    // Save auth credentials if provided
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username || password) {
      await chrome.storage.local.set({
        authCredentials: { username, password }
      });
    }
    
    // Set proxy configuration
    await setProxy(proxyType);
    
    // Update UI
    updateActiveProxyUI(proxyType);
    updateStatus(proxyType);
    
    // Save active proxy
    await chrome.storage.local.set({ activeProxy: proxyType });
    
  } catch (error) {
    console.error('Failed to set proxy:', error);
    updateStatus('error');
  }
}

async function setProxy(proxyType) {
  const authData = await chrome.storage.local.get('authCredentials');
  const auth = authData.authCredentials || {};
  
  let config;
  
  switch (proxyType) {
    case 'direct':
      config = {
        mode: 'direct'
      };
      break;
      
    case 'http':
      config = {
        mode: 'fixed_servers',
        rules: {
          singleProxy: {
            scheme: 'http',
            host: '127.0.0.1',
            port: 10808
          }
        }
      };
      break;
      
    case 'socks5':
      config = {
        mode: 'fixed_servers',
        rules: {
          singleProxy: {
            scheme: 'socks5',
            host: '127.0.0.1',
            port: 10808
          }
        }
      };
      break;
      
    default:
      throw new Error(`Unknown proxy type: ${proxyType}`);
  }
  
  // Set proxy settings
  await chrome.proxy.settings.set({
    value: config,
    scope: 'regular'
  });
  
  // Handle authentication if needed
  if ((proxyType === 'http' || proxyType === 'socks5') && auth.username) {
    // Note: Chrome extensions cannot directly handle proxy authentication
    // This would need to be handled by the proxy server or user intervention
    console.log('Proxy authentication required:', auth.username);
  }
}

function updateActiveProxyUI(activeProxy) {
  const proxyItems = document.querySelectorAll('.proxy-item');
  
  proxyItems.forEach(item => {
    const toggle = item.querySelector('.proxy-toggle');
    const isActive = item.dataset.proxy === activeProxy;
    
    toggle.setAttribute('data-active', isActive.toString());
  });
}

function updateStatus(proxyType) {
  const statusText = document.getElementById('status-text');
  
  switch (proxyType) {
    case 'direct':
      statusText.textContent = 'Direct Connection';
      break;
    case 'http':
      statusText.textContent = 'HTTP Proxy Active';
      break;
    case 'socks5':
      statusText.textContent = 'SOCKS5 Proxy Active';
      break;
    case 'error':
      statusText.textContent = 'Error Setting Proxy';
      statusText.style.color = '#d32f2f';
      break;
    default:
      statusText.textContent = 'Unknown Status';
  }
}

async function loadSavedSettings() {
  try {
    const data = await chrome.storage.local.get(['activeProxy', 'authCredentials']);
    
    // Load saved auth credentials
    if (data.authCredentials) {
      document.getElementById('username').value = data.authCredentials.username || '';
      document.getElementById('password').value = data.authCredentials.password || '';
    }
    
    return data.activeProxy || 'direct';
  } catch (error) {
    console.error('Failed to load settings:', error);
    return 'direct';
  }
}

async function updateActiveProxy() {
  try {
    const currentProxy = await chrome.proxy.settings.get({'incognito': false});
    let activeProxy = 'direct';
    
    if (currentProxy.value.mode === 'fixed_servers') {
      const proxyConfig = currentProxy.value.rules.singleProxy;
      if (proxyConfig.scheme === 'http') {
        activeProxy = 'http';
      } else if (proxyConfig.scheme === 'socks5') {
        activeProxy = 'socks5';
      }
    }
    
    updateActiveProxyUI(activeProxy);
    updateStatus(activeProxy);
    
    // Save active proxy for persistence
    await chrome.storage.local.set({ activeProxy });
    
  } catch (error) {
    console.error('Failed to get current proxy settings:', error);
    updateStatus('error');
  }
}