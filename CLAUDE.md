# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tablist is a Firefox WebExtension (manifest v2) that displays all open tabs in a popup, allowing users to select multiple tabs to close or export as links.

## Development Commands

```sh
# Run extension in Firefox with auto-reload
web-ext run

# Build for distribution
web-ext build

# Sign for AMO (requires API credentials)
web-ext sign --channel=listed --amo-metadata=./amo.json --api-key=$AMO_JWT_ISSUER --api-secret=$AMO_JWT_SECRET
```

## Debugging

1. Go to `about:debugging` → `This Firefox` → Find `Tablist` → Click `Inspect`
2. In the Inspector, use the 3-dot menu to enable `Disable Popup Auto-Hide`

## Architecture

### Popup (`popup/`)
- **popup.html**: Main popup structure with header (select all), scrollable content (tab list), and footer (export format + action buttons)
- **popup.js**: Handles tab querying via `browser.tabs.query()`, renders tab list, manages selection, close confirmation with 5s auto-revert, and export formatting
- **popup.css**: Uses CSS variables for theming (light/dark mode via `prefers-color-scheme`), Firefox Style Guide patterns

### Export Page (`tablist/`)
- **tablist.html/js/css**: Displays exported links retrieved from `browser.storage.local`

### Key Data Flow
1. Popup queries all tabs → renders checkboxes with `data-title` and `data-url` attributes
2. Export: formats selected tabs based on dropdown (markdown/orgmode/plain) → stores in `browser.storage.local` → opens tablist page
3. Close: shows inline confirmation bar → auto-reverts after 5 seconds if no action

### Storage
- `exportFormat`: Persisted user preference for export format
- `selectedTabs`: Temporary storage for passing links to export page

## Styling Conventions

CSS uses variables defined in `:root` for colors, spacing, and sizes. Dark mode overrides color variables in `@media (prefers-color-scheme: dark)`. Components follow Firefox Style Guide class naming (`.panel-*`, `.panel-section-*`).
