import { CompatStatement } from "@mdn/browser-compat-data/types";
export declare enum AstNodeTypes {
    MemberExpression = "MemberExpression",
    CallExpression = "CallExpression",
    NewExpression = "NewExpression"
}
export declare type ProviderApiMetadata<T = Language.JS> = {
    id: string;
    name: string;
    language: T;
    kind: APIKind;
    protoChain: Array<string>;
    protoChainId: string;
    compat: CompatStatement;
};
export interface ApiMetadata<T = Language.JS> extends ProviderApiMetadata<T> {
    astNodeTypes: AstNodeTypes[];
    isBoolean: boolean;
}
export declare type CssApiMetadata = ApiMetadata<Language.CSS>;
export declare type JsApiMetadata = ApiMetadata<Language.JS>;
export declare enum Language {
    JS = "js-api",
    CSS = "css-api"
}
export declare enum APIKind {
    Web = "web",
    ES = "es"
}
//# sourceMappingURL=types.d.ts.map