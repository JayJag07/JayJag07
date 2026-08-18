/**
 * JET Carshop - Application Logic
 * Demo functionality for internationalization features
 * 
 * Features:
 * - Locale-aware price formatting using Intl.NumberFormat
 * - Localized date/time display using Intl.DateTimeFormat
 * - Number formatting demonstration
 * - Language change event handling
 */

// Application state
const appState = {
  basePrice: 25000,
  baseNumber: 1234567.89,
  baseDate: new Date()
};

/**
 * Format currency based on current locale
 */
function formatCurrency(amount, locale) {
  try {
    // Map language codes to locale codes for currency formatting
    const localeMap = {
      en: 'en-US',
      pt: 'pt-PT',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      ar: 'ar-SA',
      zh: 'zh-CN'
    };
    
    const localeCode = localeMap[locale] || 'en-US';
    
    // Currency mapping based on locale
    const currencyMap = {
      'en-US': 'USD',
      'pt-PT': 'EUR',
      'es-ES': 'EUR',
      'fr-FR': 'EUR',
      'de-DE': 'EUR',
      'ar-SA': 'SAR',
      'zh-CN': 'CNY'
    };
    
    const currency = currencyMap[localeCode];
    
    return new Intl.NumberFormat(localeCode, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `$${amount.toFixed(2)}`;
  }
}

/**
 * Format date based on current locale
 */
function formatDate(date, locale) {
  try {
    const localeMap = {
      en: 'en-US',
      pt: 'pt-PT',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      ar: 'ar-SA',
      zh: 'zh-CN'
    };
    
    const localeCode = localeMap[locale] || 'en-US';
    
    return new Intl.DateTimeFormat(localeCode, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return date.toLocaleString();
  }
}

/**
 * Format numbers based on current locale
 */
function formatNumber(number, locale) {
  try {
    const localeMap = {
      en: 'en-US',
      pt: 'pt-PT',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      ar: 'ar-SA',
      zh: 'zh-CN'
    };
    
    const localeCode = localeMap[locale] || 'en-US';
    
    return new Intl.NumberFormat(localeCode, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    return number.toLocaleString();
  }
}

/**
 * Update all demo displays with current locale formatting
 */
function updateDemoDisplays(locale) {
  // Update price display
  const priceDisplay = document.getElementById('priceDisplay');
  if (priceDisplay) {
    priceDisplay.textContent = formatCurrency(appState.basePrice, locale);
  }
  
  // Update date display
  const dateDisplay = document.getElementById('dateDisplay');
  if (dateDisplay) {
    dateDisplay.textContent = formatDate(appState.baseDate, locale);
  }
  
  // Update number display
  const numberDisplay = document.getElementById('numberDisplay');
  if (numberDisplay) {
    numberDisplay.textContent = formatNumber(appState.baseNumber, locale);
  }
}

/**
 * Initialize the application
 */
function initApp() {
  // Set initial date display
  const dateDisplay = document.getElementById('dateDisplay');
  if (dateDisplay) {
    dateDisplay.textContent = formatDate(appState.baseDate, 'en');
  }
  
  // Listen for language changes
  window.addEventListener('languageChanged', (event) => {
    const { language } = event.detail;
    updateDemoDisplays(language);
    
    // Log language change for debugging
    console.log(`[App] Language changed to: ${language}`);
  });
  
  // Update displays on initial load
  const currentLang = document.documentElement.lang || 'en';
  updateDemoDisplays(currentLang);
  
  console.log('[App] Application initialized');
}

/**
 * Utility: Get browser's preferred language
 */
function getBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Check if we support this language
  const supportedLanguages = Object.keys(translations);
  
  if (supportedLanguages.includes(langCode)) {
    return langCode;
  }
  
  // Fallback to English
  return 'en';
}

/**
 * Utility: Add translation helper function for dynamic content
 */
function t(keyPath, lang = null) {
  const language = lang || document.documentElement.lang || 'en';
  const translation = translations[language];
  
  if (!translation) {
    console.warn(`Translation not found for language: ${language}`);
    return keyPath;
  }
  
  const keys = keyPath.split('.');
  let value = translation;
  
  for (const key of keys) {
    if (value && value[key] !== undefined) {
      value = value[key];
    } else {
      console.warn(`Translation key not found: ${keyPath}`);
      return keyPath;
    }
  }
  
  return value;
}

/**
 * Utility: Update a specific element's text by translation key
 */
function updateElementText(selector, keyPath) {
  const element = document.querySelector(selector);
  if (element) {
    const language = document.documentElement.lang || 'en';
    const text = t(keyPath, language);
    element.textContent = text;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export utilities for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatCurrency,
    formatDate,
    formatNumber,
    t,
    updateElementText,
    getBrowserLanguage
  };
}
