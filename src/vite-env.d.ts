/// <reference types="vite/client" />

declare module 'papaparse' {
  export interface ParseConfig {
    header?: boolean;
    dynamicTyping?: boolean;
    skipEmptyLines?: boolean;
    [key: string]: any;
  }

  export interface ParseResult {
    data: any[];
    errors: any[];
    meta: any;
  }

  export function parse(input: string | File, config?: ParseConfig): ParseResult;
  export function unparse(data: any[], config?: any): string;
}

declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';
  
  interface AutoTableOptions {
    head?: string[][];
    body?: (string | number)[][];
    startY?: number;
    margin?: number;
    styles?: any;
    headStyles?: any;
    alternateRowStyles?: any;
    didDrawPage?: () => void;
    [key: string]: any;
  }

  function autoTable(doc: jsPDF, options: AutoTableOptions): void;
  export default autoTable;
}
