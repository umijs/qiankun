# ora [![Build Status](https://travis-ci.org/sindresorhus/ora.svg?branch=master)](https://travis-ci.org/sindresorhus/ora)

> Elegant terminal spinner

<p align="center">
	<img src="https://rawgit.com/sindresorhus/ora/master/screenshot.svg" width="500">
</p>


## Install

```
$ npm install --save ora
```

*Show your support for Ora by buying this excellent [Node.js course](https://LearnNode.com/friend/AWESOME).*


## Usage

```js
const ora = require('ora');

const spinner = ora('Loading unicorns').start();

setTimeout(() => {
	spinner.color = 'yellow';
	spinner.text = 'Loading rainbows';
}, 1000);
```


## API

It will gracefully not do anything when there's no TTY or when in a CI.

### ora([options|text])

If a string is provided, it is treated as a shortcut for [`options.text`](#text).

#### options

Type: `Object`

##### text

Type: `string`

Text to display after the spinner.

##### spinner

Type: `string` `Object`<br>
Default: `dots` <img src="screenshot-spinner.gif" width="14">

Name of one of the [provided spinners](https://github.com/sindresorhus/cli-spinners/blob/master/spinners.json). See `example.js` in this repo if you want to test out different spinners.

Or an object like:

```js
{
	interval: 80, // optional
	frames: ['-', '+', '-']
}
```

##### color

Type: `string`<br>
Default: `cyan`<br>
Values: `black` `red` `green` `yellow` `blue` `magenta` `cyan` `white` `gray`

Color of the spinner.

##### interval

Type: `number`<br>
Default: Provided by the spinner or `100`

Interval between each frame.

Spinners provide their own recommended interval, so you don't really need to specify this.

##### stream

Type: `WritableStream`<br>
Default: `process.stderr`

Stream to write the output.

You could for example set this to `process.stdout` instead.

##### enabled

Type: `boolean`

Force enable/disable the spinner. If not specified, the spinner will be enabled if the `stream` is being run inside a TTY context (not spawned or piped) and/or not in a CI environment.

### Instance

#### .start([text])

Start the spinner. Returns the instance. Set the current text if `text` is provided.

#### .stop()

Stop and clear the spinner. Returns the instance.

#### .succeed([text])

Stop the spinner, change it to a green `✔` and persist the current text, or `text` if provided. Returns the instance. See the GIF below.

#### .fail([text])

Stop the spinner, change it to a red `✖` and persist the current text, or `text` if provided. Returns the instance. See the GIF below.

#### .warn([text])

Stop the spinner, change it to a yellow `⚠` and persist the current text, or `text` if provided. Returns the instance.

#### .info([text])

Stop the spinner, change it to a blue `ℹ` and persist the current text, or `text` if provided. Returns the instance.

#### .stopAndPersist([options])

Stop the spinner and change the symbol or text. Returns the instance. See the GIF below.

##### options

Type: `Object`

###### symbol

Type: `string`<br>
Default: `' '`

Symbol to replace the spinner with.

###### text

Type: `string`<br>
Default: Current text

Text to be persisted.

<img src="screenshot-2.gif" width="480">

#### .clear()

Clear the spinner. Returns the instance.

#### .render()

Manually render a new frame. Returns the instance.

#### .frame()

Get a new frame.

#### .text

Change the text.

#### .color

Change the spinner color.

### ora.promise(action, [options|text])

Starts a spinner for a promise. The spinner is stopped with `.succeed()` if the promise fulfills or with `.fail()` if it rejects. Returns the spinner instance.

#### action

Type: `Promise`


## Related

- [cli-spinners](https://github.com/sindresorhus/cli-spinners) - Spinners for use in the terminal
- [listr](https://github.com/SamVerschueren/listr) - Terminal task list
- [CLISpinner](https://github.com/kiliankoe/CLISpinner) - Terminal spinner library for Swift
- [halo](https://github.com/ManrajGrover/halo) - Python port
- [spinners](https://github.com/FGRibreau/spinners) - Terminal spinners for Rust


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
