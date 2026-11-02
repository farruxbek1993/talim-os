declare module 'mammoth' {
  export interface MammothResult {
    value: string;
    messages: Array<{
      type: string;
      message: string;
    }>;
  }

  export interface Options {
    arrayBuffer?: ArrayBuffer;
    buffer?: any;
    path?: string;
    styleMap?: string[];
  }

  export function convertToHtml(input: { arrayBuffer: ArrayBuffer }, options?: Options): Promise<MammothResult>;
  export function extractRawText(input: { arrayBuffer: ArrayBuffer }, options?: Options): Promise<MammothResult>;
}
