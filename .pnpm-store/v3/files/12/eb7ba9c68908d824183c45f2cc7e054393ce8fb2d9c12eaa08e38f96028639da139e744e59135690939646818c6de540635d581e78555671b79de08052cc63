interface MhchemParser {
	go: { (input: string | undefined, stateMachine: StateMachineName): Parsed[]; };
	concatArray: { (a: any[], b: any): void };
	patterns: {
		patterns: {
			[pattern in PatternNameReturningString]?:
				RegExp | PatternFunction<string>
		  } & {
			[pattern in PatternNameReturningArray]?:
				RegExp | PatternFunction<string[]>
		  };
		findObserveGroups: {
			(
				input: string,
				begExcl: string | RegExp,
				begIncl: string | RegExp,
				endIncl: string | RegExp,
				endExcl: string | RegExp,
				beg2Excl?: string | RegExp,
				beg2Incl?: string | RegExp,
				end2Incl?: string | RegExp,
				end2Excl?: string | RegExp,
				combine?: boolean
			): MatchResult<string | string[]>
		};
		match_: { (m: PatternName, input: string): MatchResult<string | string[]> | null };
	},
	actions: ActionList;
	stateMachines: { [key in StateMachineName]: StateMachine };
}

type PatternFunction<T> = (input: string) => MatchResult<T> | null;
type StateMachineName = "tex" | "ce" | "a" | "o" | "text" | "pq" | "bd" | "oxidation" | "tex-math" | "tex-math tight" | "9,9" | "pu" | "pu-2" | "pu-9,9";
type MatchResult<T> = {
	match_: T;
	remainder: string;
}
type StateName =
	"0" |  // begin of main part (arrow/operator unlikely)
	"1" |  // next entity
	"2" |  // next entity (arrow/operator unlikely)
	"3" |  // next atom
	"c" |  // macro
	"a" |  // amount
	"o" |  // element
	"b" |  // left-side superscript
	"p" |  // left-side subscript
	"q" |  // right-side subscript
	"d" | "D" |  // right-side superscript
	"r" |  // arrow
	"rd" |  // arrow, script above
	"f" | "*";
type StateNameCombined = StateName | "0|1|2" | "0|1|2|3" | "0|1|2|3|a|as|b|p|bp" | "0|1|2|3|a|as|b|p|bp|o" | "0|1|2|3|a|as|b|p|bp|o|c0" | "0|1|2|3|a|as|o" | "0|1|2|3|a|as|o|q|d|D|qd|qD|dq" | "0|1|2|3|as|b|p|bp|o" | "0|1|2|3|b|p|bp|o" | "0|1|2|a|as" | "0|1|2|as" | "0|2" | "0|a" | "0|d" | "1|2" | "1|3" | "3|o" | "a|as" | "a|as|d|D|q|qd|qD|dq" | "a|as|o" | "as" | "as|o" | "b|p|bp" | "d|D" | "d|D|q|qd|qD|dq" | "d|D|qd|qD" | "d|D|qd|qD|dq" | "d|qd|D|qD" | "d|qd|dq" | "D|qD|p" | "dq" | "o|d|D|dq|qd|qD" | "o|d|D|q|qd|qD|dq" | "o|q" | "q|d|D|qd|qD|dq" | "q|dq" | "q|qd|qD|dq" | "qd" | "qD|dq" | "qd|qD" | "r|rt" | "r|rt|rd|rdt|rdq" | "rd|rdt" | "/|q";

type ActionList = {
	[key in ActionNameUsingMNone]?: ActionFunction<string>
} & {
	[key in ActionNameUsingMString]?: ActionFunction<string>
} & {
	[key in ActionNameUsingMStringOption]?: ActionFunction<string>
} & {
	[key in ActionNameUsingMArray]?: ActionFunction<string[]>
}
interface ActionFunction<T> {
	(buffer: Buffer, m?: T, option?: string | number | boolean): undefined | Parsed | Parsed[];
}

type TransitionsRaw = {
	[pattern in PatternNameReturningString]?: {
		[state in StateNameCombined]?: {
			action_:
			ActionNameUsingMString | ActionNameUsingMStringOption | ActionNameUsingMNone |
			ActionNameWithParameter<ActionNameUsingMString> | ActionNameWithParameter<ActionNameUsingMStringOption> | ActionNameWithParameter<ActionNameUsingMNone> |
			(ActionNameUsingMString | ActionNameUsingMStringOption | ActionNameUsingMNone |
			ActionNameWithParameter<ActionNameUsingMString> | ActionNameWithParameter<ActionNameUsingMStringOption> | ActionNameWithParameter<ActionNameUsingMNone>)[];
		nextState?: string;
			revisit?: boolean;
			toContinue?: boolean;
			stateArray?: StateName[];
		}
	}
} & {
	[pattern in PatternNameReturningArray2]?: {
		[state in StateNameCombined]?: {
			action_:
				ActionNameUsingMArray2 | (ActionNameUsingMArray2 | ActionNameUsingMString | ActionNameUsingMNone | ActionNameWithParameter<ActionNameUsingMNone>)[];  // ... list ist not complete
			nextState?: string;
			revisit?: boolean;
			toContinue?: boolean;
			stateArray?: StateName[];
		}
	}
} & {
	[pattern in PatternNameReturningArray3]?: {
		[state in StateNameCombined]?: {
			action_: ActionNameUsingMArray3 | ActionNameUsingMArray3[];
			nextState?: string;
			revisit?: boolean;
			toContinue?: boolean;
			stateArray?: StateName[];
		}
	}
} & {
	[pattern in PatternNameReturningArray6]?: {
		[state in StateNameCombined]?: {
			action_: ActionNameUsingMArray6 | ActionNameUsingMArray6[];
			nextState?: string;
			revisit?: boolean;
			toContinue?: boolean;
			stateArray?: StateName[];
		}
	}
}
type PatternNameReturningString =
	"empty" | "else" | "else2" | "space" | "space A" | "space$" | "a-z" | "x" | "x$" | "i$" | "letters" | "\\greek" | "one lowercase latin letter $" | "$one lowercase latin letter$ $" | "one lowercase greek letter $" | "digits" | "-9.,9" | "-9.,9 no missing 0" | "state of aggregation $" | "{[(" | ")]}" | ", " | "," | "." | ". __* " | "..." | "^{(...)}" | "^($...$)" | "^a" | "^\\x{}" | "^\\x" | "^(-1)" | "\'" | "_{(...)}" | "_($...$)" | "_9" | "_\\x{}{}" | "_\\x{}" | "_\\x" | "^_" | "{}^" | "{}" | "{...}" | "{(...)}" | "$...$" | "${(...)}$__$(...)$" | "=<>" | "#" | "+" | "-$" | "-9" | "- orbital overlap" | "-" | "pm-operator" | "operator" | "arrowUpDown" | "\\bond{(...)}" | "->" | "CMT" | "[(...)]" | "1st-level escape" | "\\," |  "\\x{}" | "\\ca" | "\\x" | "orbital" | "others" | "\\color{(...)}" | "\\ce{(...)}" | "\\pu{(...)}" | "oxidation$" | "d-oxidation$" | "1/2$" | "amount" | "amount2" | "(KV letters)," | "formula$" | "uprightEntities" | "/" | "//" | "*" | "\\x{}{}" | "^\\x{}{}" |
	"^{(...)}|^($...$)" | "^a|^\\x{}{}|^\\x{}|^\\x|\'" | "_{(...)}|_($...$)|_9|_\\x{}{}|_\\x{}|_\\x" | "\\,|\\x{}{}|\\x{}|\\x" | "{...}|\\,|\\x{}{}|\\x{}|\\x" | "\\x{}{}|\\x{}|\\x" | "-|+" | "{[(|)]}" | "{...}|else" | "^{(...)}|^(-1)";
type PatternNameReturningArray2 = "_{(state of aggregation)}$" | "\\frac{(...)}" | "\\overset{(...)}" | "\\underset{(...)}" | "\\underbrace{(...)}" | "\\color{(...)}{(...)}";
type PatternNameReturningArray3 = "(-)(9)^(-9)";
type PatternNameReturningArray6 = "(-)(9.,9)(e)(99)";
type PatternName = PatternNameReturningString | PatternNameReturningArray2 | PatternNameReturningArray3 | PatternNameReturningArray6;
type PatternNameReturningArray = PatternNameReturningArray2 | PatternNameReturningArray3 | PatternNameReturningArray6;
type ActionNameUsingMNone = "a to o" | "sb=true" | "sb=false" | "beginsWithBond=true" | "beginsWithBond=false" | "parenthesisLevel++" | "parenthesisLevel--" | "output" | "space" | "cdot" | "output-0" | "output-o" | "tight operator";
type ActionNameUsingMString = "a=" | "b=" | "p=" | "o=" | "o=+p1" | "q=" | "d=" | "rm=" | "text=" | "copy" | "rm" | "text" | "tex-math" | "tex-math tight" | "ce" | "pu" | "1/2" | "9,9" | "o after d" | "d= kv" | "charge or bond" | "state of aggregation" | "comma" | "oxidation-output" | "r=" | "rdt=" | "rd=" | "rqt=" | "rq=" | "operator" | "bond" | "color0-output" | "roman-numeral" | "^(-1)";
type ActionNameUsingMStringOption =  "insert" | "insert+p1" |  "write" | "bond" | "- after o/d";
type ActionNameUsingMArray2 = "insert+p1+p2" | "frac-output" | "overset-output" | "underset-output" | "underbrace-output"  | "color-output";
type ActionNameUsingMArray3 = "number^";
type ActionNameUsingMArray6 = "enumber";
type ActionName = ActionNameUsingMNone | ActionNameUsingMString | ActionNameUsingMStringOption | ActionNameUsingMArray2 | ActionNameUsingMArray3 | ActionNameUsingMArray6;
type ActionNameUsingMArray = ActionNameUsingMArray2 | ActionNameUsingMArray3 | ActionNameUsingMArray6;

type StateMachine = {
	transitions: Transitions;
	actions: ActionList;
}
type Transitions = {
	[state in StateName]?: Transition[];
}
interface Transition {  // e.g. { pattern: 'letter', task: { '*': { action_: ['output'], nextState: '1' } } }
	pattern: PatternName;
	task: Action;
}
interface Action {
	action_: ActionNameWithParameter<ActionName>[];
	nextState?: StateName;
	revisit?: boolean;
	toContinue?: boolean;
}
interface ActionNameWithParameter<T> {
	type_: T;
	option?: string | number | boolean;
}




interface Buffer {
	a?: string;  // amount
	o?: string;  // element
	b?: string;  // left-side superscript
	p?: string;  // left-side subscript
	q?: string;  // right-side subscript
	d?: string;  // right-side superscript
	dType?: string;

	r?: ArrowName;  // arrow
	rdt?: string;  // arrow, script above, type
	rd?: string;  // arrow, script above, content
	rqt?: string;  // arrow, script below, type
	rq?: string;  // arrow, script below, content

	text_?: string;
	rm?: string;

	parenthesisLevel?: number;  // starting at 0
	sb?: boolean;  // space before
	beginsWithBond?: boolean;
}




type ParsedWithoutString =
	{ type_: "chemfive",
		a: Parsed[],
		b: Parsed[],
		p: Parsed[],
		o: Parsed[],
		q: Parsed[],
		d: Parsed[],
		dType: string } |
	{ type_: "rm", p1: string } |
	{ type_: "text", p1: string } |
	{ type_: "roman numeral", p1: string } |
	{ type_: "state of aggregation", p1: Parsed[] } |
	{ type_: "state of aggregation subscript", p1: Parsed[] } |
	{ type_: "bond", kind_: BondName } |
	{ type_: "frac", p1: string, p2: string } |
	{ type_: "pu-frac", p1: Parsed[], p2: Parsed[] } |
	{ type_: "tex-math", p1: string } |
	{ type_: "frac-ce", p1: Parsed[], p2: Parsed[] } |
	{ type_: "overset", p1: Parsed[], p2: Parsed[] } |
	{ type_: "underset", p1: Parsed[], p2: Parsed[] } |
	{ type_: "underbrace", p1: Parsed[], p2: Parsed[] } |
	{ type_: "color", color1: string, color2: Parsed[] } |
	{ type_: "color0", color: string } |
	{ type_: "arrow",
		r: ArrowName,
		rd?: Parsed[],
		rq?: Parsed[]} |
	{ type_: "operator", kind_: OperatorName } |
	{ type_: "1st-level escape", p1: string } |
	{ type_: "space" } |
	{ type_: "tinySkip" } |
	{ type_: "entitySkip" } |
	{ type_: "pu-space-1" } |
	{ type_: "pu-space-2" } |
	{ type_: "1000 separator" } |
	{ type_: "commaDecimal" } |
	{ type_: "comma enumeration L", p1: string } |
	{ type_: "comma enumeration M", p1: string } |
	{ type_: "comma enumeration S", p1: string } |
	{ type_: "hyphen" } |
	{ type_: "addition compound" } |
	{ type_: "electron dot" } |
	{ type_: "KV x" } |
	{ type_: "prime" } |
	{ type_: "cdot" } |
	{ type_: "tight cdot" } |
	{ type_: "times" } |
	{ type_: "circa" } |
	{ type_: "^" } |
	{ type_: "v" } |
	{ type_: "ellipsis" } |
	{ type_: "/" } |
	{ type_: " / " };
type Parsed = ParsedWithoutString | string;
type ArrowName = "->" | "\u2192" | "\u27F6" | "<-" | "<->" | "<-->" | "<=>" | "\u21CC" | "<=>>" | "<<=>";  // keep aligned with definition of pattern '->'
type BondName = "-" | "1" | "=" | "2" | "#" | "3" | "~" | "~-" | "~=" | "~--" | "-~-" | "..." | "...." | "->" | "<-" | "<" | ">";
type OperatorName = "+" | "-" | "=" | "<" | ">" | "<<" | ">>" | "\\pm" | "\\approx" | "$\\approx$" | "v" | "(v)" | "^" | "(^)";




interface MhchemTexify {
	go: { (input: Parsed[] | undefined, isInner?: boolean): string; };
	_goInner: { (input: Parsed[]): string};
	_go2: { (input: ParsedWithoutString): string };
	_getArrow: { (input: ArrowName): string };
	_getBond: { (input: BondName): string };
	_getOperator: { (input: OperatorName): string };
}