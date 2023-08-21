export interface Options {
	/**
	The directory to start from.

	@default process.cwd()
	*/
	readonly cwd?: string;
}

/**
Find the closest `package.json` file.

@returns The file path, or `undefined` if it could not be found.

@example
```
// /
// └── Users
//     └── sindresorhus
//         └── foo
//             ├── package.json
//             └── bar
//                 ├── baz
//                 └── example.js

// example.js
import {pkgUp} from '../pkg-up';

console.log(await pkgUp());
//=> '/Users/sindresorhus/foo/package.json'
```
*/
export function pkgUp(options?: Options): Promise<string | undefined>;

/**
Synchronously find the closest `package.json` file.

@returns The file path, or `undefined` if it could not be found.

@example
```
// /
// └── Users
//     └── sindresorhus
//         └── foo
//             ├── package.json
//             └── bar
//                 ├── baz
//                 └── example.js

// example.js
import {pkgUpSync} from '../pkg-up';

console.log(pkgUpSync());
//=> '/Users/sindresorhus/foo/package.json'
```
*/
export function pkgUpSync(options?: Options): string | undefined;

