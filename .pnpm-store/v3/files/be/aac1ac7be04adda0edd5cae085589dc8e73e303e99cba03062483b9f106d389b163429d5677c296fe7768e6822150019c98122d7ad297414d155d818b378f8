import {Table, Formatter, Header, Options} from "./factory";

export = TtyTable;

declare function TtyTable(headers: (string | Header | Formatter)[], body: string[][] | object[], footers: (string | Header | Formatter)[], config?: Options): Table;
declare function TtyTable(header: (string | Header | Formatter)[], body: any[], config?: Options): Table;
declare function TtyTable(body: any[], config?: Options): Table;

declare namespace TtyTable {

  interface Formatter {
    (cellValue: any, columnIndex: number, rowIndex: number, rowData: any, inputData: any): string;
  }

  export interface Header {
    alias?: string;
    align?: string;
    color?: string;
    footerAlign?: string;
    footerColor?: string;
    formatter?: Formatter;
    headerAlign?: string;
    headerColor?: string;
    marginLeft?: number;
    marginTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    value: string;
    width?: string | number;
  }

  export interface Options {
    borderStyle?: string;
    borderColor?: string;
    color?: string;
    compact?: boolean;
    defaultErrorValue?: string;
    defaultValue?: string;
    errorOnNull?: boolean;
    truncate?: string | boolean;
    width?: string;
  }

  export interface Config extends Options {
    borderCharacters: object;
    showHeader: boolean;
    tableId: string;
    table: TableState;
  }

  export interface Table extends Array<string | object> {
    render(): string;
  }

  class TableState {
    body: string;
    columnInnerWidths: number[];
    columnWidths: number[];
    columns: number[];
    footer: string;
    header: string;
    height: number;
  }
}
