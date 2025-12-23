# Proxy Addon - Development Guidelines

## Build/Test Commands
- **Development**: Load unpacked in `brave://extensions/` (Developer mode → Load unpacked)
- **Testing**: Manual testing only - verify proxy switching, theme switching, error handling
- **No build process**: Direct file editing, refresh extension after changes

## Code Style Guidelines
### JavaScript
- **Format**: 2-space indentation, no trailing whitespace
- **Imports**: None - use browser APIs directly (`chrome.*`)
- **Types**: Plain JavaScript, no type system
- **Naming**: camelCase for variables/functions, async prefix for async functions
- **Error Handling**: Try-catch blocks with `console.error('description:', error)`

### CSS
- **Colors**: Grayscale palette only (#1a1a1a, #404040, #808080, #cccccc)
- **Theming**: CSS custom properties in `:root` with `prefers-color-scheme: dark`
- **Layout**: Flexbox, pixels for spacing, rems for typography

### HTML
- **Structure**: Semantic HTML5, proper labels, minimal markup
- **Forms**: Input validation, inline editing for proxy URLs
