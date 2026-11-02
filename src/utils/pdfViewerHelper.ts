import * as pdfjsLib from 'pdfjs-dist';
// Import local worker via Vite ?url to ensure same-origin execution without cross-origin SecurityError
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  } catch (err) {
    console.warn('Could not set local PDF worker:', err);
  }
}

/**
 * Robustly converts any data URL, blob URL, or base64 string to a Uint8Array
 * Uses native fetch() for fast, memory-safe, non-blocking C++ conversion
 */
export async function dataUrlToUint8ArrayAsync(dataUrl: string): Promise<Uint8Array> {
  if (!dataUrl) return new Uint8Array(0);

  // Use native browser fetch if data: or blob:
  if (dataUrl.startsWith('data:') || dataUrl.startsWith('blob:')) {
    try {
      const res = await fetch(dataUrl);
      const buffer = await res.arrayBuffer();
      return new Uint8Array(buffer);
    } catch (e) {
      console.warn('Native fetch decode failed, falling back to clean decode:', e);
    }
  }

  // Safe fallback for raw base64 or custom string
  let base64 = dataUrl;
  const base64Index = dataUrl.indexOf(';base64,');
  if (base64Index !== -1) {
    base64 = dataUrl.substring(base64Index + 8);
  }

  // Remove any whitespace, newlines, carriage returns
  base64 = base64.replace(/[\s\r\n]+/g, '');

  try {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (err) {
    console.error('Base64 decode error:', err);
    return new Uint8Array(0);
  }
}

/**
 * Synchronous version for backwards compatibility
 */
export function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  if (!dataUrl) return new Uint8Array(0);
  let base64 = dataUrl;
  const base64Index = dataUrl.indexOf(';base64,');
  if (base64Index !== -1) {
    base64 = dataUrl.substring(base64Index + 8);
  }
  base64 = base64.replace(/[\s\r\n]+/g, '');
  try {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (e) {
    console.error('Synchronous dataUrlToUint8Array error:', e);
    return new Uint8Array(0);
  }
}

/**
 * Converts a data URL to a Blob safely
 */
export async function dataUrlToBlobAsync(dataUrl: string, defaultMime = 'application/pdf'): Promise<Blob> {
  if (!dataUrl) return new Blob([], { type: defaultMime });
  try {
    const res = await fetch(dataUrl);
    return await res.blob();
  } catch {
    const uint8 = dataUrlToUint8Array(dataUrl);
    return new Blob([uint8.buffer as ArrayBuffer], { type: defaultMime });
  }
}

export function dataUrlToBlob(dataUrl: string, defaultMime = 'application/pdf'): Blob {
  let mimeType = defaultMime;
  const mimeMatch = dataUrl.match(/^data:([^;]+);base64,/);
  if (mimeMatch && mimeMatch[1]) {
    mimeType = mimeMatch[1];
  }
  const uint8 = dataUrlToUint8Array(dataUrl);
  return new Blob([uint8.buffer as ArrayBuffer], { type: mimeType });
}
