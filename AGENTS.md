# Brave Proxy Addon - Development Guidelines

## Project Overview
Minimal Brave browser extension for switching between local proxy servers with modern design and system theme support.

## Build Commands
This is a minimal project with no build process required:
- **Development**: Load unpacked extension in Brave developer mode
- **Testing**: Manual testing in Brave browser
- **Packaging**: Manual zip of project directory for distribution

To test changes:
1. Open Brave browser
2. Navigate to `brave://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select project directory
5. Click refresh icon after making changes

## Code Style Guidelines

### JavaScript
- **Language**: Modern ES6+ (async/await, arrow functions, destructuring)
- **Format**: 2-space indentation, no trailing whitespace
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **Style**: Functional programming where possible, minimal state management
- **Error Handling**: Try-catch blocks with descriptive console errors

### CSS
- **Architecture**: CSS custom properties for theming
- **Colors**: Grayscale palette only (#1a1a1a, #404040, #808080, #cccccc)
- **Layout**: Flexbox for responsive layouts
- **Media Queries**: `prefers-color-scheme: dark` for system theme support
- **Units**: Pixels for precise control, rem for typography
- **Form Styling**: Consistent input styling with focus states

### HTML
- **Structure**: Semantic HTML5 elements only
- **Accessibility**: Proper labels, ARIA attributes where needed
- **Minimalism**: Clean, simple markup with no unnecessary elements
- **Forms**: Input fields for proxy URL editing with proper validation

## File Structure
```
brave-proxy-addon/
├── manifest.json          # Extension configuration
├── popup.html             # Main popup interface
├── popup.css              # Themed styles
├── popup.js               # UI logic and proxy management
├── background.js          # Service worker for background tasks
├── assets/                # Icon assets
└── AGENTS.md             # This file
```

## Proxy Configuration
- **Default**: 127.0.0.1:10808 for both HTTP and SOCKS5
- **Types**: Direct, HTTP, SOCKS5
- **Authentication**: Optional (stored in local storage)
- **URL Editing**: Inline editing and configuration panel for custom proxy URLs
- **Persistence**: Proxy URLs saved to Chrome storage
- **API**: Chrome proxy.settings API

## Theme Support
- **System Detection**: `prefers-color-scheme` media queries
- **Color Scheme**: CSS custom properties in :root
- **Transitions**: Smooth 0.2s ease transitions for theme changes
- **Contrast**: Ensure readability in both light and dark modes

## Permissions & Security
- **Required**: `proxy`, `storage`
- **Security**: No external network requests, minimal permissions
- **Privacy**: All data stored locally, no analytics or tracking

## Testing Guidelines
- **Manual Testing**: Test proxy switching functionality
- **Theme Testing**: Verify light/dark mode switching
- **Proxy Testing**: Connect through different proxy types
- **Error Handling**: Test invalid proxy configurations

## Resource Optimization
- **Bundle Size**: Keep total size under 100KB
- **Performance**: Minimal JavaScript execution, efficient DOM updates
- **Memory**: Clean up event listeners, avoid memory leaks
- **Network**: No external dependencies or resources

## Browser Compatibility
- **Primary**: Brave/Chrome (Manifest V3)
- **Secondary**: Firefox (may need manifest adjustments)
- **Modern**: Requires modern browser with extension support