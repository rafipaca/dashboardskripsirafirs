export const accessibilityUtils = {
  // Keyboard navigation
  keyboardNavigation: {
    tabIndex: (index: number) => index + 1,
    arrowKeys: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
    enterKey: ['Enter', ' '],
    escapeKey: ['Escape']
  },

  // ARIA labels
  ariaLabels: {
    map: 'Peta interaktif sebaran pneumonia',
    region: (region: string) => `Wilayah ${region} - klik untuk detail`,
    chart: (title: string) => `Grafik ${title}`,
    button: (action: string) => `Tombol untuk ${action}`,
    loading: 'Memuat data...',
    error: 'Terjadi kesalahan saat memuat data'
  },

  // Screen reader support
  screenReader: {
    announce: (message: string) => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
    },
    
    focusTrap: (container: HTMLElement) => {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      return { firstElement, lastElement, focusableElements };
    }
  },

  // Color contrast utilities
  colorContrast: {
    isLight: (color: string) => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128;
    },
    
    getContrastColor: (backgroundColor: string) => {
      return accessibilityUtils.colorContrast.isLight(backgroundColor) ? '#000000' : '#ffffff';
    }
  },

  // High contrast mode
  highContrastMode: {
    enabled: () => {
      return window.matchMedia('(prefers-contrast: high)').matches;
    },
    
    styles: {
      border: '2px solid',
      outline: '2px solid',
      boxShadow: 'none'
    }
  }
};

// Hook untuk keyboard navigation
export function useKeyboardNavigation() {
  const handleKeyPress = (event: React.KeyboardEvent, callback: () => void) => {
    if (accessibilityUtils.keyboardNavigation.enterKey.includes(event.key)) {
      event.preventDefault();
      callback();
    }
  };

  return { handleKeyPress };
}
