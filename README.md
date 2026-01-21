# Tablist Add-on for Firefox

Show all open tabs in a popup. Select or export multiple tabs.

At the moment all tabs of all windows are shown.

## Screenshots

![Tablist popup](screenshots/tablist.jpg)
![Close confirmation](screenshots/tablist-delete.jpg)

## Features

- Close selected tabs (with confirmation dialog)
- Export selected tab URLs in new tab as Markdown, Org-mode, or plain URLs
- Dark and light mode support
- Components styled after [Firefox Style Guide](https://firefoxux.github.io/StyleGuide/#/welcome)

## Permissions

- tabs: Read and close tabs
- storage: Cache list for exported tabs
- activeTab: Open new active tab to display all exported links

## Development

Install the [web-ext](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Getting_started_with_web-ext) command line tool

```sh
$ npm install --global web-ext
$ web-ext run
```

Enable debugging in Firefox under `about:debugging`

## Misc

Icons from [Firefox Photon Icons](https://design.firefox.com/icons/viewer/)

## Todo

- [x] Fix missing tab fallback icon
- [x] Export links as plain list, Markdown, or Org-mode
- [x] Cleanup CSS, move values to variables
- [ ] Fix overflowing long link names

### Maybe

- [ ] Update to Acorn design system: https://acorn.firefox.com/latest/home/acorn-aRSAh0Sp
- [ ] Update to manifest v3
