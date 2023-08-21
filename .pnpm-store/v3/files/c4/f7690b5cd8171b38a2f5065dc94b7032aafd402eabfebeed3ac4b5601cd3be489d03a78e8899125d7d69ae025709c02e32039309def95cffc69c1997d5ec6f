declare namespace osLocale {
	interface Options {
		/**
		Set to `false` to avoid spawning subprocesses and instead only resolve the locale from environment variables.

		@default true
		*/
		readonly spawn?: boolean;
	}
}

declare const osLocale: {
	/**
	Get the system [locale](https://en.wikipedia.org/wiki/Locale_(computer_software)).

	@returns The locale.

	@example
	```
	import osLocale = require('@umijs/deps/types/os-locale/os-locale');

	(async () => {
		console.log(await osLocale());
		//=> 'en-US'
	})();
	```
	*/
	(options?: osLocale.Options): Promise<string>;

	/**
	Synchronously get the system [locale](https://en.wikipedia.org/wiki/Locale_(computer_software)).

	@returns The locale.
	*/
	sync(options?: osLocale.Options): string;
};

export = osLocale;
