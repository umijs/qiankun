Speech Rule Engine
==================
[![Dependencies](https://img.shields.io/librariesio/release/npm/speech-rule-engine)](https://img.shields.io/librariesio/release/npm/speech-rule-engine) [![NPM version](https://img.shields.io/npm/v/speech-rule-engine.svg?style=flat)](https://www.npmjs.com/package/speech-rule-engine) [![NPM monthly downloads](https://img.shields.io/npm/dm/speech-rule-engine.svg?style=flat)](https://npmjs.org/package/speech-rule-engine) [![NPM total downloads](https://img.shields.io/npm/dt/speech-rule-engine.svg?style=flat)](https://npmjs.org/package/speech-rule-engine) [![](https://data.jsdelivr.com/v1/package/npm/speech-rule-engine/badge)](https://www.jsdelivr.com/package/npm/speech-rule-engine)
[![jsdelivr rank](https://flat.badgen.net/jsdelivr/rank/npm/speech-rule-engine)](https://www.jsdelivr.com/package/npm/speech-rule-engine)
![example workflow](https://github.com/zorkow/speech-rule-engine/actions/workflows/node.js.yml/badge.svg?branch=develop)


***

**Breaking Change:** Please move to v3.0.2 or later. [More info here.](#breaking-change)

***

NodeJS version of the ChromeVox speech rule engine.
Forked from ChromeVox release 1.31.0

Speech rule engine (SRE) can translate XML expressions into speech strings
according to rules that can be specified in a syntax using Xpath expressions.
It was originally designed for translation of MathML and MathJax DOM elements
for the ChromeVox screen reader.  Besides the rules originally designed for the
use in ChromeVox, it also has an implemententation of the full set of Mathspeak
and Clearspeak rules, localisation into a number of languages and Braille output
currently in Nemeth.

SRE contains a library for semantic interpretation to re-represents any
mathematical expression in its own internal semantic format, overcoming the poor
design of presentation MathML by fully disassembling and reconstructing an
expression. For a better understanding of the representation have a look at its
[visualiser](https://zorkow.github.io/semantic-tree-visualiser/visualise.html).
The semantic trees can be used in their own XML format directly or used to
enrich the input MathML expressions with semantic information and speech
strings.

There are three ways of using SRE:

1. [**Node Module:**](#node-module) Download via npm or yarn. This is the easiest way to use the speech
rule engine via its API and is the preferred option if you just want to include
it in your project.

2. [**Standalone Tool:**](#standalone-tool) Download via github and build. This is useful
if you want to use the speech rule engine in batch mode or interactivley to add
your own code. Or simply run it with ```npx```, for example to get all SRE
options anywhere without local installation run:

```bash
    npx speech-rule-engine -h
```

3. [**Browser Library:**](#browser-library) This gives you the option of loading
   SRE in a browser and use its full functionality on your webesites.


Node Module
-----------

Install as a node module using npm:

     npm install speech-rule-engine

Or add it with yarn:

     yarn add speech-rule-engine

Then import into a running node or a source file using require:

     require('speech-rule-engine');

### API #######

Current API functions are divided into three categories.

#### Methods that take a string containing a MathML expression:

| Method | Return Value |
| ---- | ---- |
| `toSpeech(mathml)` | Speech string for the MathML. |
| `toSemantic(mathml)` | XML representation of the semantic tree for the MathML. |
| `toJson(mathml)` | The semantic tree in JSON. |
| `toDescription(mathml)` | The array of auditory description objects of the MathML expression. |
| `toEnriched(mathml)` | The semantically enriched MathML expression. |

**Note that in asynchronous operation mode for these methods to work correctly,
it is necessary to ensure that the Engine is ready for processing. In other
words, you need to wait for the setup promise to resolve. See documentation of
`engineReady` and `setupEngine` below.**

#### Methods that take an input filename and optionally an output filename:

_Note that the file methods only work in Node!_

These methods load the given file, process its content and return the result.
In asynchronous mode they return a promise that resolves to the result.  If the
output filename is given the result will also be written to this file. Note,
that this will overwrite the existing file.


| Method | Return Value |
| ---- | ---- |
| `file.toSpeech(input, output)` | Speech string for the MathML. |
| `file.toSemantic(input, output)` | XML representation of the semantic tree for the MathML. |
| `file.toJson(input, output)` | The semantic tree in JSON.  |
| `file.toDescription(input, output)` | The array of auditory description objects of the MathML expression. |
| `file.toEnriched(input, output)` | The semantically enriched MathML expression. |

#### Methods for computing textual representations of numbers

These methods take a non-negative integer (either as string or number) as input
an return the number as text in the currently active locale. For the `vulgar`
method a vulgar fraction can be provided as a string of two slash separated
numbers, e.g., `"1/2"`.

| Method                  | Return Value                              |
|-------------------------|-------------------------------------------|
| `number(input)`         | The number as text.                       |
| `ordinal(input)`        | The word ordinal.                         |
| `numericOrdinal(input)` | The numeric ordinal.                      |
| `vulgar(input)`         | Word representation of a vulgar fraction. |
|                         |                                           |

#### Methods for querying and controlling the engine behaviour:

| Method | Return Value |
| ---- | ---- |
| `version` | Returns SRE's version number. |
| `engineReady()` | Returns a promise that resolves as soon as the engine is ready for processing (i.e., all necessary rule files have been loaded and the engine is done updating). **This is important in asynchronous settings.** |
| `setupEngine(options)` | Takes an [options feature vector](#options) to parameterise the Speech Rule Engine. Returns a promise that resolves as soon as the engine is ready for processing. |
| `engineSetup()` | Returns the current setup of the engine as an  [options feature vector](#options). |
| `localeLoader()` | SRE's standard method for loading locales, depending on SRE's mode. For more detail see [discussion on locale loading](#locale-loading). |

#### Methods for navigating math expressions:

For the following methods SRE maintains an internal state, hence they are only
useful when running in browser or in a Node REPL. Therefore, they are not
exposed via the command line interface.

| Method | Return Value |
| ---- | ---- |
| `walk(mathml)` | Speech string for the math expression. |
| `move(keycode)` | Speech string after the move. Keycodes are numerical strings representing cursor keys, space, enter, etc. |

For more information on keybindings for the walker see here [this dedicated
page](https://speechruleengine.org/www/keybindings.html).


### Configuration ####

There are a number of options that allow you to parameterise the Speech Rule
Engine. They can be set with the `setupEngine(options)` method, which takes an
options feature vector (an object of option/value pairs) to parameterise the
engine. The engine's setup can be queried with the `engineSetup()` method that
returns feature vector representing its current setup. Some options are quite
internal to SRE and are therefore not exposed via the command line interface.

In addition to programmatically configuring SRE using the ``setupEngine``
method, you can also set a configuration variable `SREfeature` before SRE is
loaded. This can be useful, when running SRE as a batch process or when changing
its locale loading behaviour on startup. For details see the section on [locale
loading below](#locale-loading).

`SREfeature` should be set in the `global` environment before SRE is loaded into
Node. The following example sets the locale on load to German:

``` javascript
var SREfeature = {locale: 'de'};
sre = require('speech-rule-engine');
sre.engineReady().then(() => console.log(sre.toSpeech('<mo>=</mo>')));
```

This should yield `ist gleich` as output.


### Options

The following is a list of configuration options that can be passed to SRE via
the `setupEngine` method or the `SREfeature` variable.

#### Options to control speech output

| Option | Value |
| ---- | ---- |
| *domain* | Domain or subject area of speech rules (e.g., mathspeak, clearspeak).|
| *style* | Style or preference setting of speech rules (e.g., brief).|
| | In case of clearspeak, multiple preferences can be chosen using `:` as separator.|
| *locale* | Language locale in 639-1. |
| *subiso* | More fine grained specification of locale. E.g., for French fr, be, or ch |
| *markup*| Set output markup for speech: ```none```, ```ssml```, ```sable```, ```voicexml```, ```acss```, ```ssml_step``` |
| *modality* | Set the modality SRE returns. E.g., ```speech```, ```braille```, ```prefix```, ```summary``` |

Observe that not every _domain_ (i.e., speech rule set) implements every
style. Similarly, not every speech rule set is implemneted in every locale. For
a more detailed overview of `locale, domain, style` combinations, use the
`--opt` switch on the command line interface.

#### Options for enriched MathML output

Enriched MathML output is markup that embeds the internal semantic structure SRE
uses into a modified representation of the original MathML. To get an idea of
the semantic tree, take a look at [its
visualisation](https://zorkow.github.io/semantic-tree-visualiser/visualise.html).

| Option | Value |
| ---- | ---- |
| *speech* | Depth to which generated speech is stored in attributes during semantic enrichment. Values are ```none```, ```shallow```, ```deep```. Default is ```none```. |
| *pprint* | Boolean flag to switch on pretty printing of output. This works on any XML style output. Default is ```true```. |
| *structure* | If set, includes a `structure` attribute in the enriched MathML that summarises the structure of the semantic tree in form of an sexpression. |

#### Options for internal control of the engine

These other options give more fine grained control of SRE. They can be useful
during development and when integrating SRE into a larger project. They are
given in decreasing order of interestingness.

| Option | Value |
| ---- | ---- |
| *json* | URL from where to pull the locale files, i.e., json files containing speech rule definitions. |
| *xpath* | URL where to pull an xpath library from. This is important for environments not supporting xpath, e.g., IE or former versions of Edge. |
| *rate* | Base value for speech rate in ```ssml_step``` markup |
| *strict* | Boolean flag indicating if only a directly matching rule should be used. I.e., no default rules are used in case a rule is not available for a particular domain, style, etc. Default is ```false```. |
| *mode* | The running mode for SRE: ```sync```, ```async```, ```http``` |
| | By default SRE in node is in `async`, in browser in `http`, and on CLI in `sync` mode. |
| *custom* | Provide a custom method for locale loading. See below for more informaton. |
| *defaultLocale* | Allows customisation for default locale. Default is ```en``` for English. |
| | This option is not available in the CLI. See below for more informaton.  |
| *delay* | Delays loading of base locales and automatic setup of engine. Default is ```false```. | 
| | Option should be used only at startup. See below for more information. |

Standalone Tool
---------------

Install the library using `npm`:

     npm install speech-rule-engine

Or add it with yarn:

     yarn add speech-rule-engine


### Run on command line ############

SRE can be run on the command line by providing a set of processing options and
either a list of input files or a inputting an XML expression manually.

    ./node_modules/.bin/sre [options] infile1 infile2 infile3 ...

For example running

    ./node_modules/.bin/sre -j -p PATH_TO_SRE_RESOURCES/samples/sample1.xml PATH_TO_SRE_RESOURCES/samples/sample2.xml

will return the semantic tree in JSON as well as the speech translation for the
expressions in the two sample files.
(Note, that `-p` is the default option if no processing options are given).

If you have `npx` installed simply use this to run it from within the `speech-rule-engine` folder with

    npx sre

This works equivalently with all options and file input. 

SRE also enables direct input from command line using `stdin`. For example,
running

    npx sre -j -p

will wait for a complete XML expression to be input for translation. Similarly,
shell piping is allowed:

    npx sre -j -p < PATH_TO_SRE_RESOURCES/samples/sample1.xml

Note, that when providing the `-o outfile` option output is saved into the given file.
However, when processing from file only the very last output is reliably saved, while when
processing via pipes or command line input all output is saved.


### Command Line Options ###########

The following is a list of command line options for the speech rule engine.

| Short | Long | Meaning |
| ----- | ---- | :------- |
| -o | --output [name] | Output file [name].
||| If not given output is printed to stdout. |
| | |
| | |
| | |
| -d | --domain [name] | Domain or subject area [name]. |
||| This refers to a particular subject type of speech rules or subject area rules are defined for (e.g., mathspeak, clearspeak). |
||| If no domain parameter is provided, default is used. |
| -t | --style [name]  | Speech style [name]. |
||| Selects a particular speech style (e.g., brief). |
||| If no style parameter is provided, style default is used. |
| -c | --locale | Language locale in ISO 639-1. |
| -k | --markup [name] | Generate speech output with markup tags. Currently supported SSML, VoiceXML, Sable, ACSS (as sexpressions for Emacsspeak) |
| | |
| | |
| | |
| -p | --speech  | Generate speech output (default). |
| -a | --audit | Generate auditory descriptions (JSON format). |
| -j | --json  | Generate JSON of semantic tree. |
| -x | --xml  | Generate XML of semantic tree. |
| -P | --pprint  | When given output is pretty printed if possible. |
| | |
| | |
| | |
| -m | --mathml  | Generate enriched MathML. |
| -g | --generate [depth] | Include generated speech in enriched MathML. Supported values: none, shallow, deep  (default: none) |
| -w | --structure | Include structure attribute in enriched MathML. |
| | |
| | |
| | |
| -N | --number | Translate number to words. |
| -O | --ordinal | Translate number to word ordinal. |
| -S | --numeric | Translate number to numeric ordinal. |
| -F | --vulgar | Translate vulgar fraction to words. Provide vulgar fraction as slash seperated numbers. |
| -C | --subiso | Subcategory of the locale given with -c. |
| | |
| | |
| | |
| -v | --verbose       | Verbose mode. Print additional information, useful for debugging. |
| -l | --log [name]    | Log file [name]. Verbose output is redirected to this file. |
||| If not given verbose output is printed to stdout. |
| -h | --help   | Enumerates all command line options. |
|    | --opt    | Enumerates all available options for locale, modality, domain and style. |
| -V | --version  |  Outputs the version number |


Building from Source 
--------------------

Clone from github and install dependencies either by running:

     npm install

Or install them manually. SRE depends on the following libraries to run:

     commander
     xmldom-sre
     wicked-good-xpath

In addition SRE depends on a number of libraries for development, in particular
[TypeScript](https://www.typescriptlang.org/) and
[webpack](https://webpack.js.org/) as well as a number of plugins and libraries
to ensure source code hygiene. These are too numerous to list here and are best
viewed in the `devDependencies` section of the `package.json` file.

Running `npm install` will build the single JavaScript modules, webpack the
bundle file in `lib/sre.js` as well as assemble the locale files in
`lib/mathmaps`. For more details on the build process as well as how to use
different bundlers see the [developers documentation
below](#developers-documentation).

### Run interactively ############

You can work with SRE interactively in node or use it as a batch processor, by
loading JavaScript modules directly. For the generation of speech make sure to
set the `SRE_JSON_PATH` environment variable to the folder where your locale
files reside. For example, set

    export SRE_JSON_PATH=./lib/mathmaps

before in the shell before running node in the `speech-rule-engine` directory.
You can then load the individual modules simply with node's `require`:

``` javascript
let sre = require('./js/index.js');
```
will give you the full API in the sre variable. On the other hand,

``` javascript
semantic = require('./js/semantic_tree/semantic.js');
```
will let you work with the semantic tree module only.


Browser Library
---------------

SRE can be used as a browser ready library giving you the option of loading it
in a browser and use its full functionality on your webesites. Since SRE version
4, the same bundle file works both in node and in a browser.  Simply include the
file ``sre.js`` in your website in a script tag

``` html
<script src="[URL]/sre.js"></script>
```

The API will now be available in the ``SRE`` namespace.

### Configuration ####

In addition to programmatically configuring SRE using the ``setupEngine``
method, you can also include a configuration element in a website, that can take
the same options as ``setupEngine``. There are two ways of specifying the
configuration element:

1. Providing a JSON object in a special script tag of type `text/x-sre-config`.
2. Setting the `SREfeature` configuration variable.

An example of the first option is the configuration element
``` html
<script type="text/x-sre-config">
{
"json": "https://cdn.jsdelivr.net/gh/zorkow/speech-rule-engine@develop/mathmaps/",
"xpath": "https://cdn.jsdelivr.net/gh/google/wicked-good-xpath@master/dist/wgxpath.install.js",
"domain": "mathspeak",
"style": "sbrief"
}
</script>
```
which will cause SRE to load JSON files from rawgit and for IE or Edge it will also load Google's
[wicked good xpath library](https://github.com/google/wicked-good-xpath). In addition the speech rules are set to ``mathspeak`` in ``super brief`` style.

**Make sure the configuration element comes before the script tag loading SRE in your website!**

An alternative is the use of the `SREfeature` variable to specify the feature
vector to customise SRE when its loaded into the page.  Again **make sure this
script tag comes before the script tag loading SRE in your website!**

``` javascript
<script>
var SREfeature = {
"locale": "de"
};
</script>
```

The use of `SREfeature` is particularly important for setting a custom load
method in the browser, that can not simply be passed to the JSON object in the
`x-sre-config` block. For more details see the section on [locale loading
below](#locale-loading).


# Developers Documentation


Since v4 SRE is distributed with the transpiled `.js` files via the npm
package. These can be directly included into your respective projects.  To
control the location of the locale mappings, set the `SRE_JSON_PATH` environment
variable to the folder where your locale files reside. For example, set

    export SRE_JSON_PATH=./lib/mathmaps

For more controlled integration or development fork or clone the repository from
github.


Building
--------

By default the build process consists of three steps:

1. Creating Locale files in 'lib/mathmaps'
1. Transpiling typescript from sources in 'ts/' to 'js/'
1. Webpacking the bundle in 'lib/sre.js'

Locales are created from the sources in `mathmaps` by combining the topically
split `.json` files into a single, minimized `.json` file, one for each
language. Note, that for ease of development JSON minimisation is done via an
intermediate step to generate `.min` files, which is handles in the `Makefile`
and ensures that only newly altered files have to be minimized.

While the entire build is best cleaned with `make clean`, this does not clean
the `.min` files. These should be cleaned with `make clean_min`.


Alternative Builds
------------------

### MathJax Library

This is only relevant for MathJax distributions version 2.7.X. As of version 3.0
MathJax uses sre directly via its `npm` release. The MathJax specific build can
be created using the `mjConfig` goal for webpack

    npx webpack

that generates a build specific for [MathJax](https://mathjax.org) in ``mathjax_sre.js``.
SRE can then be configured locally on webpages as described above.


### Other Entry Points

For particular projects it might be useful and sufficient to create bespoke
bundles of SRE submodules. Depending on the bundler 

Examples of entry points that provide separate API functionality to SRE
submodules are 

| Module     | Javascript entry point         | Typescript entry point         | Comments                                           |
|------------|--------------------------------|--------------------------------|----------------------------------------------------|
| `semantic` | `js/semantic_tree/semantic.js` | `ts/semantic_tree/semantic.ts` | API for semantic tree generation                   |
| `enrich`   | `js/enrich_mathml/enrich.js`   | `ts/enrich_mathml/enrich.ts`   | API for semantic enrichment of MathML expressions. |
| `mathjax`  | `js/common/mathjax.js`         | `ts/common/mathjax.ts`         | API for MathJax version 2.7.X                      |



Using Bundlers
--------------

By default SRE works with webpack. But you can use a number of other bundlers to
build.  Note, that for all bundlers the JSON locale files need to be build as
usual. Depending on the version of SRE you are using some of the alternative
bundlers might already be in the `devDependencies`.

### WebPack

The default webpack of SRE generates the `sre.js` library that can be used both
in node and the browser. Other goals are `mjConfig` that is defined in
`webpack.config.js` or alternative entry points as discussed in more detail in
the [Alternative Builds section](#alternative-builds).

### Rollupjs

Creates bundles similar to webpack, that can be used pretty much as
replacement. Rollup bundles are build from the Javascript modules in `js`, so
make sure to transpile first with `npx tsc`.

#### Build

Install the required packages:

``` shell
npm install --no-save rollup
npm install --no-save @rollup/plugin-commonjs
npm install --no-save @rollup/plugin-node-resolve
npm install --no-save rollup-plugin-terser
```

Add a `rollup.config.js` file of the form:

``` javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

export default [
  {
    input: 'js/index.js',
    output: {
      name: 'SRE',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      resolve(), 
      commonjs(),
      terser()
    ]
  }
];
```

The resulting file in `./lib/sre.js` works as usual for both browser and node.

_Note, that in the Browser version there is currently an issue with Unicode
Braille Spaces that are being garbled._


### Esbuild

Creates small builds very fast, but has some backward compatibility issues, in
that it can work with ES6 modules only.

#### Build


Install the required packages:

``` shell
npm install --no-save esbuild
```

Build using the following command line:


``` shell
npx esbuild ./ts/index.ts --bundle --outfile=lib/sre.js --format=esm --minify
```


#### Node

To run in node you need ES6 modules enabled.

``` shell
npx install --no-save esm
```

Then start node with `node -r esm`. If you want to use the CLI interface, adapt
the `./bin/sre` script as follows:

``` javascript
#!/usr/bin/env -S node -r esm 
let sre = require('../lib/sre.js');
(new sre.cli()).commandLine();
```

#### Browser

Import the SRE library as ES6 module into the browser, e.g.,

``` html
<script type="module">
  import * as SRE from 'http://localhost/sre/speech-rule-engine/lib/sre.js'
  ...
</script>
```

### Parcel

SRE currently does not support bundling with `parcel`.


Locale Loading
--------------

### Custom Loading Methods ####

SRE loads its locales and rule sets via loading methods specific for the
particular environment and mode. I.e., it loads json files from the file system
in node or via XML HTTP requests in the browser using the `localLoader` method
that is exposed in the API. These methods can be customised via passing a new
method to the engine via the feature vector. A loader method takes the locale
string as input and returns a promise that resolves to the string containing the
JSON structure of the locale file once loading is successfully completed. In
other words it should be of type

``` typescript
(locale: string) => Promise<string>
```

In node the method can be directly set by passing it to the `setupEngine` method
via the feature vector. As an example the following method loads locales from a
local folder at `/tmp/mymaps`.

``` javascript
sre.setupEngine({
  custom: loc => {
    let file = `/tmp/mymaps/${loc}.json`;
    return new Promise((res, rej) => {
      try {
        res(fs.readFileSync(file));
        console.log(`Loading of locale ${loc} succeeded`);
      } catch (_) {
        console.log(`Loading of locale ${loc} failed`);
        rej('');
      }
    });
  }
});
```

### Custom Loading Methods in Node ####

Setting the custom load method with `setupEngine` will only allow you to change
locale loading behaviour after the SRE has performed basic setup, that is, it
has already tried to load the base and fallback locale. However, it is often
desirable to change SRE's loading behaviour before the initial locale files have
been loaded. This can be down by setting the `SREfeature` vector **before**
loading SRE.  Here is a code snippet to demonstrate its use:


``` javascript
const fs = require('fs');
global.SREfeature = {
  custom: loc => {
    console.log(`Loading locale ${loc}`);
    let file = `/tmp/mymaps/${loc}.json`;
    return new Promise((res, rej) => {
      try {
        res(fs.readFileSync(file));
        console.log(`Loading of locale ${loc} succeeded`);
      } catch (_) {
        console.log(`Loading of locale ${loc} failed`);
        rej('');
      }
    });
  }
};
let sre = require(process.cwd() + '/node_modules/speech-rule-engine/lib/sre.js');
```

### Custom Loading Methods in the Browser ####

Providing a custom loading method for locale loading in browser mode is very
similar to its use in node. However, note that since we now want to define a
function, it can not simply be given in the JSON configuration element in the
`x-sre-config` script tag.  Instead we need to define the special `SREfeature`
variable in the header of the file. Again **make sure this script tag comes
before the script tag loading SRE in your website!**

Here is an example of a custom function to load locales from localhost:

``` javascript
<script>
var SREfeature = {
"custom": function(loc) {
    let file = 'http://localhost/sre/lib/mathmaps/' + loc + '.json';
    let httpRequest = new XMLHttpRequest();
    return new Promise((res, rej) => {
      httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
          console.log('Using my custom loader');
          let status = httpRequest.status;
          if (status === 0 || (status >= 200 && status < 400)) {
            res(httpRequest.responseText);
          } else {
            rej(status);
          }
        }
      };
      httpRequest.open('GET', file, true);
      httpRequest.send();
    });
  }
}
</script>
```

### Reusing the Standard Loader

SRE exposes its standard locale loader via the API method `localeLoader`. The
method returns the actual load method that can be applied to an iso locale
string, e.g., `SRE.localeLoader()('fr');` to load the French locale.  This
allows its use as a fallback loader in a custom load method, which is particular
useful when a customised set of rules for a particular locale should be loaded
from a different location than the rest of the locales.

For example, consider the following code snippet that ensures that only the
German locale is loaded from a custom directory:

``` javascript
let SRE = null;
global.SREfeature = {
  'custom': async function(loc) {
    if (loc === 'de') {
      return new Promise((res, rej) => {
        try {
          res(fs.readFileSync('/tmp/mymaps/de.json'));
        } catch (_) {
          rej('');
        }
      });
    }
    console.log('custom loader');
    return SRE.localeLoader()(loc);
  }
};
SRE = require('speech-rule-engine');
```


### Setting Default Locale ###

In standard setup SRE loads its base locale files together with a default locale
that acts as a fallback in case rules or symbol mappings are not available in
the locale that is being used. In standard setup the fallback locale is
English. This means SRE currently loads `base.json` together with `en.json` as
fallback rules on initialisation.

This behaviour can be changed by providing SRE with a different fallback locale
by using `defaultLocale` feature. Note the following:

* If `defaultLocale` is set to a locale that does not exist, English will be
  retained as fallback.
* The `base` locale will always be loaded first, regardless of the value of
  `defaultLocale`.
* The default locale can currently not be changed when using SRE via the
  command line interface.


### Delaying Automatic Locale Loading ###

SRE's setup is automated as much as possible for ease of use, by performing the
following two steps:

1. On load SRE determines its environment (browser, node, command line) and
   picks up any options provided via a feature vector.
2. It then loads the basic locales, taking the configuration options into
   account, to be ready for translation.

Setting `delay` to `true`, suppresses this behaviour by postponing the second
step (i.e., the intial locale loading) to the first explicit call to
`setupEngine`.

This can be useful in case the custom load method can only be provided later or
the `json` path is constructed programmatically by a client application. It is
also helpful if some locales are webpacked into a distribution and need to be
loaded with a custom method.

Note, that using `delay` means that locale loading can and has to be handled by
the developer explicitly. In particular, it implies that English is not
necessarily loaded as fallback locale and that calling the `toSpeech` method
without another call to `setupEngine` generally leads to no speech output. Also,
while `delay` can be set on any call to `setupEngine`, it really only makes
sense during initial setup.


Coding Style
------------

SRE is implemented using coding format enforced by
[prettier](https://prettier.io/) and [eslint](https://eslint.org/). In addition
it requires full documentation using [JSDOC](https://jsdoc.app/).  When creating
a pull request, please make sure that your code compiles and is fully linted.

### Code Formatting

We use [prettier](https://prettier.io/) for formatting code. Run

    npm format
    
to see which files contain format violations. Use

    npm format-fix
    
to automatically fix those format violations.


### Code Hygiene

We use [eslint](https://eslint.org/) for enforcing code style and
documentation. Run

    npm lint
    
to see a list of linting errors and warnings. Use

    npm lint-fix
    
to automatically fix those violations as much as possible.

### Documentation

Full [JSDOC](https://jsdoc.app/) documentation is required and enforced via the
[`eslint jsdoc plugin`](https://www.npmjs.com/package/eslint-plugin-jsdoc). To
generate documentation from the [JSDOC](https://jsdoc.app/), simply run

    npm run docs

This will generate documentation using [typedoc](http://typedoc.org) for the
source code in the directory ``docs/``.


Node Package
------------

The speech rule engine is published as a node package in fully compiled form, together with the JSON libraries for translating atomic expressions. All relevant files are in the lib subdirectory.

To publish the node package run

    npm publish

For manually going through the build steps see the `prepublish` script in `package.json`.



Removed or Deprecated Functionality
-----------------------------------

The following is an overview of functionality and options that were available at
some point in SRE. Depending on the version you are using they might still work,
do nothing or throw an error. Even if they still work they are strongly
discouraged to use.


### Removed or Deprecated Engine Setup Options

The following options are either deprecated or have been removed. Having them in
the feature vector for `setupEngine` should not throw an exception but will have
no effect.


| Option      | Value                                                                                                                                                                                                                           | Release                   | Comments                                                                                                                         |
|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| *cache*     | Boolean flag to switch expression caching during speech generation. Default is ```true```.                                                                                                                                      | *Removed in v3.2.0*       | Expression caching has been removed and the option has no longer any effect.                                                     |
| *rules*     | A list of rulesets to use by SRE. This allows to artificially restrict available speech rules, which can be useful for testing and during rule development. ***Always expects a list, even if only one rule set is supplied!*** | *Deprecated in v4.0.0*    | Note that setting rule sets is no longer useful with the new rule indexing structures. It is only retained for testing purposes. |
| *walker*    | A walker to use for interactive exploration: ```None```, ```Syntax```, ```Semantic```, ```Table```                                                                                                                              | *Deprecated since v4.0.0* | Defaults to Table walker. Other walkers are no longer maintained!                                                                |
| *semantics* | Boolean flag to switch **OFF** semantic interpretation.                                                                                                                                                                         | *Removed in v3.0*         | Non-semantic rule sets have been removed since v3.0.                                                                             |


#### Removed API functions #########

| Method | Return Value | Release | Comments |
| ---- | ---- | ---- | ---- |
| `pprintXML(string)` | Returns pretty printed version of a serialised XML string. | *Removed v3.0* | Use the `pprint` option instead.` |


#### Removed Command Line Options #########


| Short | Long | Meaning | Release | Comments |
| ----- | ---- | :------- | :------- | :------- |
| -i | --input [name]  | Input file [name]. | *Deprecated since v3.0. Removed in v4.0!* | Use standard input file handling or stdio piping instead |
| -s | --semantics     | Switch **OFF** semantics interpretation. | *Removed in v3.0* | There is no longer support for non-semantic rule sets. |


## Breaking Change

Due to a breaking change in
the [commander library](https://github.com/tj/commander.js/releases/tag/v6.0.0)
old versions of SRE might break when newly installed from `npm`.  SRE relies on
commander for running its command line interface.

**Therefore, please move to SRE v3.0.2 or later.**


If you want to run older versions of SRE, you need to manually downgrade the
`commander` package to `v5.1.0` by running 

```bash
npm install commander@5.1.0
```

Note, that the command line option `--options` has now been renamed to `--opt`.
