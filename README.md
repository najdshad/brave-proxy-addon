# Brave Proxy Addon

A minimal, resource-friendly Brave browser extension for switching between local proxy servers with modern design and system theme support.

## Features

- 🔄 **Proxy Switching**: Direct, HTTP, SOCKS5 proxy modes
- 🌐 **URL Editing**: Inline editing and configuration panel for custom proxy URLs
- 🌙 **System Theme**: Automatic dark/light mode detection
- 🎨 **Minimal Design**: Grayscale color palette with modern UI
- 💾 **Persistent Storage**: Settings saved across browser sessions
- 🚀 **Lightweight**: No build tools, minimal resource usage

## Installation

### From Source
1. Clone this repository:
```bash
git clone https://github.com/najdshad/brave-proxy-addon.git
cd brave-proxy-addon
```

2. Load in Brave/Chrome:
   - Open `brave://extensions/` (or `chrome://extensions/`)
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the project directory

### From Chrome Web Store
*Coming soon*

## Usage

1. **Click the proxy icon** in your browser toolbar
2. **Select proxy type**: Direct, HTTP, or SOCKS5
3. **Edit proxy URL** (optional): Click on the URL to edit inline
4. **Settings auto-save** for future sessions

### Default Configuration
- **Proxy URL**: `127.0.0.1:10808`
- **Types**: Direct, HTTP, SOCKS5

## Development

### Project Structure
```
brave-proxy-addon/
├── manifest.json          # Extension configuration (Manifest V3)
├── popup.html             # Main popup interface
├── popup.css              # Themed styles with system support
├── popup.js               # UI logic and proxy management
├── background.js          # Service worker for background tasks
├── assets/                # Icon assets
│   ├── icon.svg           # Master scalable vector icon
│   └── icon256.png        # High-resolution PNG icon
├── AGENTS.md              # Development guidelines
└── README.md              # This file
```

### Building
This is a minimal project with no build process required. All files are ready to use as-is.

### Testing Changes
1. Make changes to source files
2. Go to `brave://extensions/`
3. Click refresh icon on the extension
4. Test functionality immediately

### Code Style
- **JavaScript**: Modern ES6+, 2-space indentation
- **CSS**: Grayscale palette, CSS custom properties for theming
- **HTML**: Semantic HTML5, minimal markup
- **Architecture**: Functional programming, minimal state management

## Configuration Options

### Proxy Types
- **Direct**: No proxy (default browser connection)
- **HTTP**: HTTP proxy server
- **SOCKS5**: SOCKS5 proxy server

### Custom Proxy URLs
Click on any proxy URL to edit inline. Custom URLs are automatically saved to browser storage. URLs are validated for format and port range (1-65535).

## Permissions

- **`proxy`**: Required for managing proxy settings
- **`storage`**: Required for saving user preferences and custom URLs

## Browser Compatibility

- ✅ **Brave Browser** (Primary)
- ✅ **Google Chrome** (Manifest V3)
- ⚠️ **Firefox** (May need manifest adjustments)

## Security & Privacy

- 🔒 **No external network requests**
- 🔒 **All data stored locally**
- 🔒 **Minimal permissions**
- 🔒 **No analytics or tracking**
- 🔒 **Open source and auditable**

## Contributing

1. Fork this repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly in Brave/Chrome
5. Commit changes: `git commit -m "Add feature"`
6. Push to branch: `git push origin feature-name`
7. Open a Pull Request

## License

GPLv3 License - see [LICENSE](LICENSE) file for details.

## Changelog

### v1.1.0
- Removed authentication fields for improved security
- Added input validation for proxy URLs (format and port range)
- Added Content Security Policy for XSS protection
- Sanitized console logging to reduce information leakage

### v1.0.0
- Initial release with basic proxy switching
- Support for HTTP and SOCKS5 proxies
- Modern UI with system theme support
- Inline URL editing and configuration panel
- High-resolution circular icons

## Support

- **Issues**: [GitHub Issues](https://github.com/najdshad/brave-proxy-addon/issues)
- **Discussions**: [GitHub Discussions](https://github.com/najdshad/brave-proxy-addon/discussions)

## Acknowledgments

Built with modern web standards and Chrome Extension APIs for a minimal, efficient proxy management experience.
