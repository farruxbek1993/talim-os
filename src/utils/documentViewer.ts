import mammoth from 'mammoth';

/**
 * Converts a base64 Data URL to an ArrayBuffer
 */
export function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer {
  const base64Index = dataUrl.indexOf(';base64,');
  let base64 = dataUrl;
  if (base64Index !== -1) {
    base64 = dataUrl.substring(base64Index + 8);
  }
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Parses DOCX base64 data URL to HTML string using mammoth
 */
export async function convertDocxToHtml(dataUrl: string): Promise<{ html: string; warnings: string[] }> {
  try {
    const arrayBuffer = dataUrlToArrayBuffer(dataUrl);
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return {
      html: result.value,
      warnings: result.messages.map((m) => m.message),
    };
  } catch (err: any) {
    console.warn('DOCX convert error:', err);
    throw new Error(err?.message || 'DOCX faylini oʻqishda xatolik yuz berdi');
  }
}

/**
 * Extracts plain text from data URL (for text/markdown/csv or fallback)
 */
export function extractTextFromDataUrl(dataUrl: string): string {
  try {
    if (dataUrl.startsWith('data:text/') || dataUrl.startsWith('data:application/json')) {
      const base64Index = dataUrl.indexOf(';base64,');
      if (base64Index !== -1) {
        const base64 = dataUrl.substring(base64Index + 8);
        return decodeURIComponent(escape(window.atob(base64)));
      }
      const commaIndex = dataUrl.indexOf(',');
      if (commaIndex !== -1) {
        return decodeURIComponent(dataUrl.substring(commaIndex + 1));
      }
    }
  } catch (e) {
    console.warn('Text decode error:', e);
  }
  return '';
}

/**
 * Helper to download file from Data URL or Blob
 */
export function triggerFileDownload(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
