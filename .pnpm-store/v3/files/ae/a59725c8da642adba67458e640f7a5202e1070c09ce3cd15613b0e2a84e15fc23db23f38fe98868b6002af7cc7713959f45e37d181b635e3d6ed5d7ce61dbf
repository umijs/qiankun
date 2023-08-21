import { DataURI } from "./types";
declare class DataURIParser {
    fileName?: string;
    mimetype?: string;
    content?: string;
    base64?: string;
    encode(fileName: string, handler?: DataURI.Callback): Promise<string | undefined>;
    format(fileName: string, fileContent: DataURI.Input): this;
    getCSS(config?: DataURI.CSSConfig): string;
    private createMetadata;
}
export = DataURIParser;
