/**
 * JET Carshop - Language Switcher Component
 * Accessible, keyboard-navigable language selection with ARIA support
 * 
 * Features:
 * - WAI-ARIA compliant listbox pattern
 * - Full keyboard navigation (Arrow keys, Enter, Escape, Home, End)
 * - Click outside to close
 * - localStorage persistence
 * - RTL layout support
 * - Focus management
 */

class LanguageSwitcher {
  constructor(options = {}) {
    // Configuration
    this.config = {
      defaultLanguage: options.defaultLanguage || 'en',
      storageKey: options.storageKey || 'jet-carshop-language',
      debug: options.debug || false
    };
    
    // State
    this.currentLanguage = this.config.defaultLanguage;
    this.isOpen = false;
    this.focusedIndex = -1;
    
    // DOM Elements
    this.elements = {};
    
    // Bind methods
    this.toggle = this.toggle.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.selectLanguage = this.selectLanguage.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);
    this.handleOptionFocus = this.handleOptionFocus.bind(this);
    
    // Initialize
    this.init();
  }
  
  /**
   * Initialize the language switcher
   */
  init() {
    try {
      // Get DOM elements
      this.elements.toggle = document.getElementById('languageToggle');
      this.elements.listbox = document.getElementById('languageListbox');
      this.elements.currentDisplay = document.getElementById('currentLanguageDisplay');
      this.elements.options = Array.from(
        this.elements.listbox.querySelectorAll('.language-option')
      );
      
      if (!this.elements.toggle || !this.elements.listbox) {
        throw new Error('Required DOM elements not found');
      }
      
      // Restore saved language or use default
      const savedLanguage = this.getSavedLanguage();
      this.currentLanguage = savedLanguage || this.config.defaultLanguage;
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Apply initial language
      this.applyLanguage(this.currentLanguage, false);
      
      // Update focused index to match current selection
      this.focusedIndex = this.elements.options.findIndex(
        opt => opt.dataset.lang === this.currentLanguage
      );
      
      this.log('Language switcher initialized', this.currentLanguage);
    } catch (error) {
      console.error('Failed to initialize language switcher:', error);
    }
  }
  
  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Toggle button click
    this.elements.toggle.addEventListener('click', this.toggle);
    
    // Keyboard navigation on toggle button
    this.elements.toggle.addEventListener('keydown', this.handleKeyDown);
    
    // Option clicks
    this.elements.options.forEach((option, index) => {
      option.addEventListener('click', this.handleOptionClick);
      option.addEventListener('mouseenter', () => this.handleOptionFocus(index));
    });
    
    // Close on outside click
    document.addEventListener('click', this.handleClickOutside);
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
        this.elements.toggle.focus();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (this.isOpen) {
        this.close();
      }
    });
  }
  
  /**
   * Toggle dropdown open/closed state
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  /**
   * Open the dropdown
   */
  open() {
    this.isOpen = true;
    this.elements.listbox.hidden = false;
    this.elements.toggle.setAttribute('aria-expanded', 'true');
    
    // Focus the currently selected option or first option
    const selectedIndex = this.elements.options.findIndex(
      opt => opt.getAttribute('aria-selected') === 'true'
    );
    const focusIndex = selectedIndex !== -1 ? selectedIndex : 0;
    this.focusOption(focusIndex);
    
    this.log('Dropdown opened');
  }
  
  /**
   * Close the dropdown
   */
  close() {
    this.isOpen = false;
    this.elements.listbox.hidden = true;
    this.elements.toggle.setAttribute('aria-expanded', 'false');
    this.focusedIndex = -1;
    
    // Reset focus on all options
    this.elements.options.forEach(opt => {
      opt.setAttribute('tabindex', '-1');
    });
    
    this.log('Dropdown closed');
  }
  
  /**
   * Select a language by code
   */
  selectLanguage(langCode) {
    const option = this.elements.options.find(
      opt => opt.dataset.lang === langCode
    );
    
    if (option) {
      this.applyLanguage(langCode, true);
      this.close();
      this.elements.toggle.focus();
    } else {
      console.warn(`Language "${langCode}" not found`);
    }
  }
  
  /**
   * Apply language change
   */
  applyLanguage(langCode, save = true) {
    const translation = translations[langCode];
    
    if (!translation) {
      console.error(`Translation for "${langCode}" not found`);
      return;
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = langCode;
    
    // Update direction for RTL languages
    const direction = translation.meta.direction || 'ltr';
    document.documentElement.dir = direction;
    
    // Update all translatable elements
    const translatableElements = document.querySelectorAll('[data-i18n]');
    translatableElements.forEach(element => {
      const keyPath = element.dataset.i18n.split('.');
      const text = this.getNestedValue(translation, keyPath);
      
      if (text !== undefined) {
        // Preserve HTML content if present
        if (element.innerHTML.includes('<')) {
          // For elements with HTML, only update text nodes
          element.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
              node.textContent = text;
            }
          });
        } else {
          element.textContent = text;
        }
      }
    });
    
    // Update placeholders for inputs
    const inputsWithI18n = document.querySelectorAll('[data-i18n-placeholder]');
    inputsWithI18n.forEach(input => {
      const keyPath = input.dataset.i18nPlaceholder.split('.');
      const placeholder = this.getNestedValue(translation, keyPath);
      if (placeholder !== undefined) {
        input.placeholder = placeholder;
      }
    });
    
    // Update page title if available
    if (translation.pageTitle) {
      document.title = translation.pageTitle;
    }
    
    // Update current language display
    this.elements.currentDisplay.textContent = translation.meta.code;
    
    // Update aria-selected on options
    this.elements.options.forEach(option => {
      const isSelected = option.dataset.lang === langCode;
      option.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });
    
    // Save to localStorage
    if (save) {
      this.saveLanguage(langCode);
      
      // Dispatch custom event for other components to react
      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: langCode, translation }
      }));
    }
    
    this.currentLanguage = langCode;
    this.log('Language applied', langCode);
  }
  
  /**
   * Handle keyboard navigation
   */
  handleKeyDown(event) {
    if (!this.isOpen) {
      // Open on ArrowDown, ArrowUp, Enter, or Space when closed
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        this.open();
      }
      return;
    }
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusNextOption();
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousOption();
        break;
        
      case 'Home':
        event.preventDefault();
        this.focusOption(0);
        break;
        
      case 'End':
        event.preventDefault();
        this.focusOption(this.elements.options.length - 1);
        break;
        
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.focusedIndex >= 0) {
          const focusedOption = this.elements.options[this.focusedIndex];
          this.selectLanguage(focusedOption.dataset.lang);
        }
        break;
        
      case 'Tab':
        this.close();
        break;
    }
  }
  
  /**
   * Focus next option in list
   */
  focusNextOption() {
    const nextIndex = (this.focusedIndex + 1) % this.elements.options.length;
    this.focusOption(nextIndex);
  }
  
  /**
   * Focus previous option in list
   */
  focusPreviousOption() {
    const prevIndex = this.focusedIndex - 1 < 0 
      ? this.elements.options.length - 1 
      : this.focusedIndex - 1;
    this.focusOption(prevIndex);
  }
  
  /**
   * Focus a specific option by index
   */
  focusOption(index) {
    if (index < 0 || index >= this.elements.options.length) return;
    
    // Remove tabindex from all options
    this.elements.options.forEach(opt => {
      opt.setAttribute('tabindex', '-1');
    });
    
    // Set focus and tabindex on target option
    const targetOption = this.elements.options[index];
    targetOption.setAttribute('tabindex', '0');
    targetOption.focus();
    this.focusedIndex = index;
  }
  
  /**
   * Handle option click
   */
  handleOptionClick(event) {
    const option = event.currentTarget;
    const langCode = option.dataset.lang;
    this.selectLanguage(langCode);
  }
  
  /**
   * Handle option focus on mouse enter
   */
  handleOptionFocus(index) {
    if (this.isOpen) {
      this.focusedIndex = index;
    }
  }
  
  /**
   * Handle click outside to close dropdown
   */
  handleClickOutside(event) {
    if (this.isOpen && 
        !this.elements.toggle.contains(event.target) && 
        !this.elements.listbox.contains(event.target)) {
      this.close();
    }
  }
  
  /**
   * Get nested value from object using key path array
   */
  getNestedValue(obj, keyPath) {
    return keyPath.reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }
  
  /**
   * Save language preference to localStorage
   */
  saveLanguage(langCode) {
    try {
      localStorage.setItem(this.config.storageKey, langCode);
    } catch (error) {
      this.log('Failed to save language to localStorage', error);
    }
  }
  
  /**
   * Get saved language from localStorage
   */
  getSavedLanguage() {
    try {
      return localStorage.getItem(this.config.storageKey);
    } catch (error) {
      this.log('Failed to read language from localStorage', error);
      return null;
    }
  }
  
  /**
   * Debug logging
   */
  log(...args) {
    if (this.config.debug) {
      console.log('[LanguageSwitcher]', ...args);
    }
  }
  
  /**
   * Public method to programmatically change language
   */
  setLanguage(langCode) {
    this.selectLanguage(langCode);
  }
  
  /**
   * Get current language code
   */
  getLanguage() {
    return this.currentLanguage;
  }
  
  /**
   * Destroy instance and clean up event listeners
   */
  destroy() {
    document.removeEventListener('click', this.handleClickOutside);
    this.elements.toggle.removeEventListener('click', this.toggle);
    this.elements.toggle.removeEventListener('keydown', this.handleKeyDown);
    
    this.elements.options.forEach(option => {
      option.removeEventListener('click', this.handleOptionClick);
      option.removeEventListener('mouseenter', this.handleOptionFocus);
    });
    
    this.log('Instance destroyed');
  }
}

// Auto-initialize when DOM is ready
let languageSwitcherInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  languageSwitcherInstance = new LanguageSwitcher({
    defaultLanguage: 'en',
    debug: false
  });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LanguageSwitcher;
}
