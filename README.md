![logo-96](https://user-images.githubusercontent.com/9971847/31857881-e872b1e2-b6b6-11e7-9886-494e8a338a25.png)

# TabSearch

Easy tab search & switching. This WebExtension provides a keyboard-accessible search interface for managing your open tabs.

[Get it from Mozilla Addons!](https://addons.mozilla.org/en-US/firefox/addon/tab_search/)

![screenshot](https://user-images.githubusercontent.com/9971847/36081161-401e4af4-0f69-11e8-910f-ad89d44a7b5a.png)

## Features

- **Smart Tab Search**: Fuzzy search through open tabs, bookmarks, and history
- **Dark Mode**: Toggle between light and dark themes for better visibility in different lighting conditions
- **Customizable Popup Dimensions**: Adjust popup width and height (50% to 200% of default size)
- **Keyboard Navigation**: Full keyboard support for power users
- **Tab Management**: Pin, refresh, mute, and organize tabs efficiently
- **Cross-Window Support**: Search and manage tabs across all browser windows
- **Visual Customization**: Customize colors, fonts, and layout preferences

## Shortcuts

| Shortcut | Description |
| --- | --- |
| Win/Linux: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> / Mac: <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd> | Toggle extension |
| <kbd>Enter</kbd> | Open selected tab or first in list if not selected |
| <kbd>&#8593;</kbd> | Select previous tab |
| <kbd>&#8595;</kbd> | Select next tab |
| <kbd>Ctrl</kbd> + <kbd>Backspace</kbd> | Delete a tab |
| <kbd>Alt</kbd> + <kbd>R</kbd> | Refresh tab
| <kbd>Alt</kbd> + <kbd>P</kbd> | Pin tab
| <kbd>Ctrl</kbd> + <kbd>C</kbd> | Copy Tab URL
| <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd> | Delete all duplicate tabs
| <kbd>Alt</kbd> + <kbd>M</kbd> | Mute (only if tab is audible)

## Customization

### Dark Mode
Enable dark mode in the settings to switch between light and dark themes. Perfect for low-light environments or users who prefer dark interfaces.

### Popup Dimensions
Customize the popup size to fit your workflow:
- **Width**: Adjust from 50% to 200% of default size
- **Height**: Scale from 50% to 200% of default height
- **Responsive Layout**: Content automatically adapts to your chosen dimensions

### Appearance Settings
- Custom colors for different tab types
- Font size adjustments for tab titles and URLs
- Visual delete buttons for tab management
- One-line tab titles option

## Usage

These instructions should get you up to compiling with and/or developing with the source. If you just want to use the extension and are on Firefox, you should get the extension from [AMO](https://addons.mozilla.org/en-US/firefox/addon/tab_search/).

Compiling the source requires [node.js](https://nodejs.org/).

Step 0: If you plan on sending pull-request, you should fork the repository.

Step 1: Clone the [TabSearch](https://github.com/reblws/tab-search) repository.
```
git clone https://github.com/reblws/tab-search.git
```
If you forked the repo, just replace the clone url with your own.

Step 2: Navigate to the root of the directory you cloned and install the required dependencies.

```
npm install
```

Step 3: You'll need to compile the changes from `src/` into the `dist/` folder. The following scripts are available to help with this

```
# Starts a live server watching for changes in `src/` and outputs them to `dist/`
# NOTE: Need to restart this command if changing one of the manifest files
npm start

# Opens Firefox with add-on installed from the files in `dist/`, automatically reloads the extension on each change found in `dist/`
npm run watch:firefox
```

Step 4: Build for production
```
npm run build:firefox
```

If you want to build or watch for Chrome just use `start:chrome` or `build:chrome` instead. This just changes the manifest.json file so it doesn't raise any errors. There's no `watch` command  for Chrome yet.


## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License
MIT
