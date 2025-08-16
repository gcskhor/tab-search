import { initialColorSettings } from 'core/reducers/defaults';
import {
  searchInput,
  deleteButton,
  d,
  prefsBtn,
  TYPE_COLOR_PROPERTY_MAP,
  COLOR_PROPERTY_TYPE_MAP,
} from './constants';
import {
  scrollIfNeeded,
  populateTabList,
  overrideFontStylesWithSansSerif,
  appendSearchInputPlaceholderText,
  setStyleSheetRule,
} from './utils/dom';
import {
  getOsShortcut,
  createTab,
} from './utils/browser';
import {
  keydownHandler,
  configureSearch,
  clearInput,
  handleTabClick,
  updateLastQueryOnKeydown,
} from './event-callbacks';

function openSettingsPage() {
  createTab({
    url: browser.runtime.getURL('../settings/index.html'),
    active: true,
  }).then(() => window.close());
}

function applyPopupDimensions(store) {
  const { popupWidthPercentage, popupHeightPercentage } = store.getState().general;
  
  const baseWidth = 355;
  const baseHeight = 450;
  const headerHeight = 48;
  
  const newWidth = Math.round((baseWidth * popupWidthPercentage) / 100);
  const newHeight = Math.round((baseHeight * popupHeightPercentage) / 100);
  
  setStyleSheetRule(':root', '--bodyWidth', `${newWidth}px`);
  setStyleSheetRule(':root', '--headerHeight', `${headerHeight}px`);
  
  setStyleSheetRule('body', 'width', `${newWidth}px`);
  
  setStyleSheetRule('header', 'width', `${newWidth}px`);
  
  setStyleSheetRule('.tab-list', 'height', `${newHeight}px`);
  
  const searchFormWidth = Math.min(300, newWidth - 20);
  setStyleSheetRule('.search-form', 'width', `${searchFormWidth}px`);
  
  setStyleSheetRule('.search', 'width', `${searchFormWidth}px`);
  
  const noResultWidth = Math.min(320, newWidth - 35);
  setStyleSheetRule('.no-result', 'width', `${noResultWidth}px`);
  
  // Update tab-info paragraph width (proportional to popup width)
  // This is the container for tab titles and URLs - make it use most of the available width
  const tabInfoWidth = Math.max(225, newWidth - 150); // Ensure minimum width but scale with popup
  setStyleSheetRule('.tab-info > p', 'width', `${tabInfoWidth}px`);
  
  // Update tab-title width to use more space when popup is wider
  const tabTitleWidth = Math.max(225, newWidth - 150);
  setStyleSheetRule('.tab-title', 'max-width', `${tabTitleWidth}px`);
  
  // Update tab-info container width to accommodate the expanded content
  const tabInfoContainerWidth = Math.max(225, newWidth - 150);
  setStyleSheetRule('.tab-info', 'min-width', `${tabInfoContainerWidth}px`);
  
  // Allow text wrapping when popup is wide enough
  if (newWidth > 400) {
    setStyleSheetRule('.tab-info > p', 'white-space', 'normal');
    setStyleSheetRule('.tab-title', 'white-space', 'normal');
  } else {
    setStyleSheetRule('.tab-info > p', 'white-space', 'nowrap');
    setStyleSheetRule('.tab-title', 'white-space', 'nowrap');
  }
}

export function overrideDomStyleSheets(store) {
  const colorState = store.getState().color;
  const typeClassName = type => `.${type}`;
  const setColor = type =>
    setStyleSheetRule(
      typeClassName(type),
      'border-left-color',
      colorState[TYPE_COLOR_PROPERTY_MAP[type]],
    );
  Object.keys(colorState)
    .filter(key =>
      initialColorSettings[key] !== colorState[key]
        && key in COLOR_PROPERTY_TYPE_MAP,
    )
    .map(key => COLOR_PROPERTY_TYPE_MAP[key])
    .forEach(setColor);
  
  applyPopupDimensions(store);
  
  return store;
}

export function addEventListeners(store) {
  const { showLastQueryOnPopup } = store.getState().general;
  const updateSearchResults = configureSearch(store);
  const handleKeydown = keydownHandler(store);
  
  store.subscribe(() => {
    const { enableDarkMode } = store.getState().general;
    if (enableDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });
  
  // Subscribe to popup dimension changes
  store.subscribe(() => {
    const { popupWidthPercentage, popupHeightPercentage } = store.getState().general;
    const currentDimensions = {
      width: popupWidthPercentage,
      height: popupHeightPercentage
    };
    
    if (!store._lastDimensions || 
        store._lastDimensions.width !== currentDimensions.width ||
        store._lastDimensions.height !== currentDimensions.height) {
      store._lastDimensions = currentDimensions;
      applyPopupDimensions(store);
    }
  });
  
  window.addEventListener('keydown', handleKeydown);
  deleteButton.addEventListener('click', clearInput);
  searchInput.addEventListener('input', updateSearchResults);
  prefsBtn.addEventListener('click', openSettingsPage);

  if (showLastQueryOnPopup) {
    searchInput.addEventListener('input', updateLastQueryOnKeydown(store));
  }

  // Populate store with current search fn
  return Object.assign(
    {},
    store,
    { updateSearchResults },
  );
}

export function addTabListeners(getState) {
  return function doAddTabListeners(tabNode) {
    tabNode.addEventListener('click', handleTabClick(getState), true);
    tabNode.addEventListener('focus', scrollIfNeeded);
  };
}

export function doFinalSideEffects(store) {
  const { updateSearchResults } = store;
  const {
    useFallbackFont,
    showLastQueryOnPopup,
    enableDarkMode,
  } = store.getState().general;

  // Apply dark mode if enabled
  if (enableDarkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  if (showLastQueryOnPopup) {
    const { lastQuery } = store.getState().state;
    searchInput.value = lastQuery;
  }
  // Give a shortcut hint
  updatePlaceholderTextWithShortcutHint()
    .catch((err) => {
      // TODO: Find a place to put these error messages away so people can
      //       c/p logged errors
      console.error(`Can't update search input placeholder text! ${err.stack}`);
    });
  // Populate the initial tab list here.
  populateTabList(updateSearchResults())
    .catch((err) => {
      console.error(`Can't populate initial tabList. ${err.stack}`);
    });


  if (useFallbackFont) {
    // Lazy for now: Just override the css styles specifying a font-family
    overrideFontStylesWithSansSerif();
  }

  return store;
}

// Possible input focus workaround
// https://bugzilla.mozilla.org/show_bug.cgi?id=1324255#c14
export function focusSearchInputWorkaround() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      searchInput.focus();
    }, 100);
  });
  d.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => searchInput.focus(), 150);
  });
}

function updatePlaceholderTextWithShortcutHint() {
  const hintText = shortcut => `(${shortcut} opens this)`;
  return getOsShortcut()
    .then(hintText)
    .then(appendSearchInputPlaceholderText);
}
