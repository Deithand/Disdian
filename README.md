# Disdian

A minimalist note-taking application with Discord Rich Presence integration, built with Electron and React.

[![Version](https://img.shields.io/badge/version-1.0.0-black?style=flat-square)](https://github.com/yourusername/disdian/releases)
[![License](https://img.shields.io/badge/license-MIT-black?style=flat-square)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-27.0.0-black?style=flat-square&logo=electron)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-black?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.0-black?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-RPC-black?style=flat-square&logo=discord)](https://discord.com/)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-black?style=flat-square)]()
[![Build](https://img.shields.io/badge/build-passing-black?style=flat-square)]()

---

## Features

- **Markdown Editor** with live preview
- **Elegant black and white design** in minimalist style
- **Discord Rich Presence** integration
- **Fast search** across all notes (Ctrl+F)
- **Hierarchical structure** for files and folders
- **Auto-save** functionality
- **Keyboard shortcuts** for efficient workflow
- **Context menu** for text formatting
- **Real-time document statistics**

---

## Quick Start

### Installation

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

### Build Application

```bash
npm run build
```

### Create Installer

```bash
npm run dist
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | Create new note |
| `Ctrl+F` | Search notes |
| `Ctrl+S` | Save note |
| `Ctrl+,` | Open settings |
| `Ctrl+B` | Toggle sidebar |

**Context Menu (on selected text):**
- **Bold** - Ctrl+B
- *Italic* - Ctrl+I
- `Code` - Ctrl+K
- ~~Strikethrough~~ - Ctrl+D

---

## Discord Rich Presence Setup

### Configuration

1. Navigate to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Copy the **Client ID**
4. Open settings in Disdian (Ctrl+,)
5. Paste the Client ID
6. Enable Discord Rich Presence

**Default test Client ID:** `1429861818960056501`

---

## Markdown Syntax

Disdian supports full Markdown syntax:

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic*
~~Strikethrough~~

- Unordered
- List

1. Numbered
2. List

`inline code`

```javascript
// Code block
function hello() {
  console.log("Hello!");
}
```

> Blockquote

[Link](https://example.com)

| Table | Header |
|-------|--------|
| Cell  | Cell   |
```

---

## Design System

### Color Palette
- **White** (#FFFFFF) - primary background
- **Black** (#000000) - accents and text
- **Gray shades** (#F5F5F5 - #212121) - depth and hierarchy

### Typography
- **Inter** (300-700) - UI elements
- **JetBrains Mono** - code and monospace elements

### Design Features
- Smooth animations (150-350ms)
- Subtle shadows for depth
- Rounded corners (8-16px)
- High contrast for readability

---

## Project Structure

```
disidian/
├── src/
│   ├── main/              # Electron main process
│   │   ├── main.ts        # Main application file
│   │   └── discordRPC.ts  # Discord integration
│   ├── renderer/          # React renderer process
│   │   ├── components/    # React components
│   │   ├── styles/        # CSS stylesheets
│   │   ├── App.tsx        # Main component
│   │   └── index.tsx      # Entry point
│   └── shared/            # Shared types
│       └── types.ts
├── public/                # Static files
├── dist/                  # Built application
└── package.json
```

---

## Technology Stack

- **Electron** - Desktop application framework
- **React** - UI library
- **TypeScript** - Type safety
- **Webpack** - Module bundler
- **Markdown-it** - Markdown parser
- **Highlight.js** - Syntax highlighting
- **Discord RPC** - Discord integration
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

---

## Dependencies

### Core Dependencies

```json
{
  "electron": "^27.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.3.0",
  "markdown-it": "^14.0.0",
  "highlight.js": "^11.9.0",
  "discord-rpc": "^4.0.1",
  "lucide-react": "^0.300.0",
  "framer-motion": "^11.0.0"
}
```

---

## Troubleshooting

### Application Won't Start

```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Discord RPC Not Working

1. Ensure Discord is running
2. Verify Client ID is correct
3. Enable RPC in application settings

### Black Screen Issue

```bash
# Open DevTools (Ctrl+Shift+I) to check for errors
# Usually resolved by rebuilding
npm run build
npm run dev
```

---

## Build Configuration

### Electron Builder

The application uses `electron-builder` for packaging. Configuration is in `package.json`:

```json
{
  "build": {
    "appId": "com.disdian.app",
    "productName": "Disdian",
    "win": {
      "target": "nsis",
      "icon": "public/icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "public/icon.icns"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "public/icon.png"
    }
  }
}
```

---

## Development

### Scripts

- `npm run dev` - Start development mode with hot reload
- `npm run build` - Build for production
- `npm run dist` - Create installer packages
- `npm run lint` - Run linter

### Code Style

- Use TypeScript for type safety
- Follow React functional component patterns
- Maintain consistent formatting
- Write descriptive commit messages

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## License

MIT License

Copyright (c) 2024 Disdian

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## Links

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev)
- [Discord Developer Portal](https://discord.com/developers)
- [Markdown Guide](https://www.markdownguide.org)

---

**Version:** 1.0.0  
**Last Updated:** 2024
