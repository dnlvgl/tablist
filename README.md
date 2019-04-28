# Tablist Add-on for Firefox

Show all open tabs in a popup. Select or export multiple tabs.

At the moment all tabs of all windows are shown.

## Features

- Delete selected tabs
- Export selected tab URLs in new tab as list
- Components styled after [Firefox Style Guide](https://firefoxux.github.io/StyleGuide/#/welcome)

### Todo

- [ ] Replace placeholder icons (multiple sizes)

## Pemissions

- tabs: Read and close tabs
- storage: Cache list for new tab
- activeTab: Open new active tab

## Development

Install the [web-ext](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Getting_started_with_web-ext) command line tool
```sh
$ npm install --global web-ext
$ web-ext run
```

Enable debugging in Firefox under `about:debugging`

## Misc

Temporary icon placeholder from: https://icons8.com/
Icons from [Firefox Photon Icons](https://design.firefox.com/icons/viewer/)