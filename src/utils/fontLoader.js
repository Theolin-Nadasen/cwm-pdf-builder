// Font loading utility with caching
const loadedFonts = new Set();

/**
 * Load a font from Google Fonts with loading detection
 * @param {string} fontFamily - The font family name to load
 * @param {number} timeout - Maximum time to wait in ms (default: 5000)
 * @returns {Promise<boolean>} - True if font loaded successfully
 */
export const loadFont = async (fontFamily, timeout = 5000) => {
  // Check if already loaded
  if (loadedFonts.has(fontFamily)) {
    return true;
  }

  try {
    // Use Font Loading API if available (modern browsers)
    if (document.fonts && document.fonts.load) {
      // Load the font with a timeout
      const fontLoadPromise = document.fonts.load(`400 16px "${fontFamily}"`);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Font load timeout')), timeout)
      );
      
      await Promise.race([fontLoadPromise, timeoutPromise]);
      loadedFonts.add(fontFamily);
      return true;
    }
    
    // Fallback for older browsers: use a test element
    return new Promise((resolve) => {
      const testElement = document.createElement('span');
      testElement.style.fontFamily = `"${fontFamily}", monospace`;
      testElement.style.position = 'absolute';
      testElement.style.left = '-9999px';
      testElement.textContent = 'Testing font load';
      document.body.appendChild(testElement);
      
      // Check if font applied by comparing dimensions
      const initialWidth = testElement.offsetWidth;
      testElement.style.fontFamily = 'monospace';
      const fallbackWidth = testElement.offsetWidth;
      testElement.style.fontFamily = `"${fontFamily}", monospace`;
      
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds at 100ms intervals
      
      const checkFont = () => {
        attempts++;
        const currentWidth = testElement.offsetWidth;
        
        if (currentWidth !== fallbackWidth || attempts >= maxAttempts) {
          document.body.removeChild(testElement);
          loadedFonts.add(fontFamily);
          resolve(true);
        } else {
          setTimeout(checkFont, 100);
        }
      };
      
      setTimeout(checkFont, 100);
    });
  } catch (error) {
    console.warn(`Font "${fontFamily}" failed to load:`, error);
    return false;
  }
};

/**
 * Check if a font is already loaded
 * @param {string} fontFamily - The font family name
 * @returns {boolean} - True if font is cached
 */
export const isFontLoaded = (fontFamily) => {
  return loadedFonts.has(fontFamily);
};

/**
 * Get list of all loaded fonts
 * @returns {Array<string>} - Array of loaded font names
 */
export const getLoadedFonts = () => {
  return Array.from(loadedFonts);
};