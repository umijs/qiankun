import { RuleMetaData, RuleMetaDataDocs, RuleListener, RuleContext, RuleModule } from '../ts-eslint/Rule';
declare type CreateRuleMetaDocs = Omit<RuleMetaDataDocs, 'url'>;
declare type CreateRuleMeta<TMessageIds extends string> = {
    docs: CreateRuleMetaDocs;
} & Omit<RuleMetaData<TMessageIds>, 'docs'>;
export declare function RuleCreator(urlCreator: (ruleName: string) => string): <TOptions extends any[], TMessageIds extends string, TRuleListener extends RuleListener = RuleListener>({ name, meta, defaultOptions, create, }: {
    name: string;
    meta: CreateRuleMeta<TMessageIds>;
    defaultOptions: TOptions;
    create: (context: RuleContext<TMessageIds, TOptions>, optionsWithDefault: TOptions) => TRuleListener;
}) => RuleModule<TMessageIds, TOptions, TRuleListener>;
export {};
//# sourceMappingURL=RuleCreator.d.ts.map