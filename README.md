# Tablist Add-on for Firefox

Show all open tabs in a popup. Select or export multiple tabs.

At the moment all tabs of all windows are shown.

## Install

Get it fom [Firefox Add-ons](https://addons.mozilla.org/de/firefox/addon/tablist1/)

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

To create a build and sign

``` sh
$ web-ext build
$ web-ext sign --channel=listed --amo-metadata=./amo.json --api-key=$AMO_JWT_ISSUER --api-secret=$AMO_JWT_SECRET
```

### How to debug / inspect

1. Enable debugging in Firefox under `about:debugging`
2. Go to `This Firefox`
3. Check for `Tablist` and click `Inspect`
4. In the Inspect window go to the 3 dot menu and check `Disable Popup Auto-Hide`

## Misc

Icons from [Firefox Photon Icons](https://design.firefox.com/icons/viewer/)
