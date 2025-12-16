document.addEventListener('DOMContentLoaded', function() {
  initializeProxyToggle();
  initializeConfigSave();
  initializeProxyUrlInputs();
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
      } else if (!e.target.closest('.proxy-url')) {
        // Don't toggle if clicking on the URL input
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
  const authData = await chrome.storage.local.get(['authCredentials', 'proxyUrls']);
  const auth = authData.authCredentials || {};
  const proxyUrls = authData.proxyUrls || {
    http: '127.0.0.1:10808',
    socks5: '127.0.0.1:10808'
  };
  
  let config;
  
  switch (proxyType) {
    case 'direct':
      config = {
        mode: 'direct'
      };
      break;
      
    case 'http':
      const httpUrl = parseProxyUrl(proxyUrls.http || '127.0.0.1:10808');
      config = {
        mode: 'fixed_servers',
        rules: {
          singleProxy: {
            scheme: 'http',
            host: httpUrl.host,
            port: httpUrl.port
          }
        }
      };
      break;
      
    case 'socks5':
      const socks5Url = parseProxyUrl(proxyUrls.socks5 || '127.0.0.1:10808');
      config = {
        mode: 'fixed_servers',
        rules: {
          singleProxy: {
            scheme: 'socks5',
            host: socks5Url.host,
            port: socks5Url.port
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

async function updateStatus(proxyType) {
  const statusText = document.getElementById('status-text');
  statusText.style.color = '';
  
  try {
    const data = await chrome.storage.local.get(['proxyUrls']);
    const proxyUrls = data.proxyUrls || {
      http: '127.0.0.1:10808',
      socks5: '127.0.0.1:10808'
    };
    
    switch (proxyType) {
      case 'direct':
        statusText.textContent = 'Direct Connection';
        break;
      case 'http':
        statusText.textContent = `HTTP: ${proxyUrls.http}`;
        break;
      case 'socks5':
        statusText.textContent = `SOCKS5: ${proxyUrls.socks5}`;
        break;
      case 'error':
        statusText.textContent = 'Error Setting Proxy';
        statusText.style.color = '#d32f2f';
        break;
      default:
        statusText.textContent = 'Unknown Status';
    }
  } catch (error) {
    statusText.textContent = `${proxyType.toUpperCase()} Proxy Active`;
  }
}

async function loadSavedSettings() {
  try {
    const data = await chrome.storage.local.get(['activeProxy', 'authCredentials', 'proxyUrls']);
    
    // Load saved auth credentials
    if (data.authCredentials) {
      document.getElementById('username').value = data.authCredentials.username || '';
      document.getElementById('password').value = data.authCredentials.password || '';
    }
    
    // Load saved proxy URLs
    const proxyUrls = data.proxyUrls || {
      http: '127.0.0.1:10808',
      socks5: '127.0.0.1:10808'
    };
    
    // Update proxy URL inputs
    document.getElementById('http-url').value = proxyUrls.http;
    document.getElementById('socks5-url').value = proxyUrls.socks5;
    document.getElementById('http-url-config').value = proxyUrls.http;
    document.getElementById('socks5-url-config').value = proxyUrls.socks5;
    
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

function parseProxyUrl(url) {
  // Handle both host:port and full URL formats
  if (url.includes('://')) {
    const urlObj = new URL(url);
    return {
      host: urlObj.hostname,
      port: parseInt(urlObj.port) || 10808
    };
  } else {
    // Handle host:port format
    const [host, port] = url.split(':');
    return {
      host: host || '127.0.0.1',
      port: parseInt(port) || 10808
    };
  }
}

function initializeProxyUrlInputs() {
  const proxyUrlInputs = document.querySelectorAll('.proxy-url');
  
  proxyUrlInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      e.stopPropagation();
      const proxyType = e.target.dataset.proxyType;
      const newUrl = e.target.value;
      
      // Update corresponding config input
      const configInput = document.getElementById(`${proxyType}-url-config`);
      if (configInput) {
        configInput.value = newUrl;
      }
      
      // Save to storage
      saveProxyUrls();
    });
    
    input.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });
}

function initializeConfigSave() {
  const saveButton = document.getElementById('save-config');
  if (saveButton) {
    saveButton.addEventListener('click', async function() {
      await saveProxyUrlsFromConfig();
      showSaveFeedback();
    });
  }
}

async function saveProxyUrls() {
  const httpUrl = document.getElementById('http-url').value;
  const socks5Url = document.getElementById('socks5-url').value;
  
  const proxyUrls = {
    http: httpUrl || '127.0.0.1:10808',
    socks5: socks5Url || '127.0.0.1:10808'
  };
  
  await chrome.storage.local.set({ proxyUrls });
  
  // Update status display if proxy is currently active
  const currentProxy = await chrome.storage.local.get(['activeProxy']);
  if (currentProxy.activeProxy === 'http' || currentProxy.activeProxy === 'socks5') {
    updateStatus(currentProxy.activeProxy);
  }
}

async function saveProxyUrlsFromConfig() {
  const httpUrl = document.getElementById('http-url-config').value;
  const socks5Url = document.getElementById('socks5-url-config').value;
  
  const proxyUrls = {
    http: httpUrl || '127.0.0.1:10808',
    socks5: socks5Url || '127.0.0.1:10808'
  };
  
  await chrome.storage.local.set({ proxyUrls });
  
  // Update inline inputs
  document.getElementById('http-url').value = proxyUrls.http;
  document.getElementById('socks5-url').value = proxyUrls.socks5;
  
  // Update status if proxy is currently active
  const currentProxy = await chrome.storage.local.get(['activeProxy']);
  if (currentProxy.activeProxy === 'http' || currentProxy.activeProxy === 'socks5') {
    updateStatus(currentProxy.activeProxy);
  }
}

function showSaveFeedback() {
  const saveButton = document.getElementById('save-config');
  const originalText = saveButton.textContent;
  
  saveButton.textContent = 'Saved!';
  saveButton.style.backgroundColor = 'var(--success-color)';
  
  setTimeout(() => {
    saveButton.textContent = originalText;
    saveButton.style.backgroundColor = 'var(--accent-color)';
  }, 1500);
}