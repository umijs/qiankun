# rehype-mathjax

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**rehype**][rehype] plugin to transform `<span class=math-inline>` and
`<div class=math-display>` with [MathJax][].

## Install

[npm][]:

```sh
npm install rehype-mathjax
```

## Use

Say we have the following file, `example.html`:

```html
<p>
  Lift(<span class="math math-inline">L</span>) can be determined by Lift Coefficient
  (<span class="math math-inline">C_L</span>) like the following equation.
</p>

<div class="math math-display">
  L = \frac{1}{2} \rho v^2 S C_L
</div>
```

And our script, `example.js`, looks as follows:

```js
const vfile = require('to-vfile')
const unified = require('unified')
const parse = require('rehype-parse')
const mathjax = require('rehype-mathjax')
const stringify = require('rehype-stringify')

unified()
  .use(parse, {fragment: true})
  .use(mathjax)
  .use(stringify)
  .process(vfile.readSync('example.html'), function (err, file) {
    if (err) throw err
    console.log(String(file))
  })
```

Now, running `node example` yields:

```html
<p>
  Lift(<span class="math math-inline"><mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: 0;" xmlns="http://www.w3.org/2000/svg" width="1.541ex" height="1.545ex" role="img" focusable="false" viewBox="0 -683 681 683" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path id="MJX-1-TEX-I-1D43F" d="M228 637Q194 637 192 641Q191 643 191 649Q191 673 202 682Q204 683 217 683Q271 680 344 680Q485 680 506 683H518Q524 677 524 674T522 656Q517 641 513 637H475Q406 636 394 628Q387 624 380 600T313 336Q297 271 279 198T252 88L243 52Q243 48 252 48T311 46H328Q360 46 379 47T428 54T478 72T522 106T564 161Q580 191 594 228T611 270Q616 273 628 273H641Q647 264 647 262T627 203T583 83T557 9Q555 4 553 3T537 0T494 -1Q483 -1 418 -1T294 0H116Q32 0 32 10Q32 17 34 24Q39 43 44 45Q48 46 59 46H65Q92 46 125 49Q139 52 144 61Q147 65 216 339T285 628Q285 635 228 637Z"></path></defs><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><use xlink:href="#MJX-1-TEX-I-1D43F"></use></g></g></g></svg></mjx-container></span>) can be determined by Lift Coefficient
  (<span class="math math-inline"><mjx-container class="MathJax" jax="SVG"><svg style="vertical-align: -0.339ex;" xmlns="http://www.w3.org/2000/svg" width="2.82ex" height="1.934ex" role="img" focusable="false" viewBox="0 -705 1246.5 855" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path id="MJX-2-TEX-I-1D436" d="M50 252Q50 367 117 473T286 641T490 704Q580 704 633 653Q642 643 648 636T656 626L657 623Q660 623 684 649Q691 655 699 663T715 679T725 690L740 705H746Q760 705 760 698Q760 694 728 561Q692 422 692 421Q690 416 687 415T669 413H653Q647 419 647 422Q647 423 648 429T650 449T651 481Q651 552 619 605T510 659Q484 659 454 652T382 628T299 572T226 479Q194 422 175 346T156 222Q156 108 232 58Q280 24 350 24Q441 24 512 92T606 240Q610 253 612 255T628 257Q648 257 648 248Q648 243 647 239Q618 132 523 55T319 -22Q206 -22 128 53T50 252Z"></path><path id="MJX-2-TEX-I-1D43F" d="M228 637Q194 637 192 641Q191 643 191 649Q191 673 202 682Q204 683 217 683Q271 680 344 680Q485 680 506 683H518Q524 677 524 674T522 656Q517 641 513 637H475Q406 636 394 628Q387 624 380 600T313 336Q297 271 279 198T252 88L243 52Q243 48 252 48T311 46H328Q360 46 379 47T428 54T478 72T522 106T564 161Q580 191 594 228T611 270Q616 273 628 273H641Q647 264 647 262T627 203T583 83T557 9Q555 4 553 3T537 0T494 -1Q483 -1 418 -1T294 0H116Q32 0 32 10Q32 17 34 24Q39 43 44 45Q48 46 59 46H65Q92 46 125 49Q139 52 144 61Q147 65 216 339T285 628Q285 635 228 637Z"></path></defs><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="msub"><g data-mml-node="mi"><use xlink:href="#MJX-2-TEX-I-1D436"></use></g><g data-mml-node="mi" transform="translate(715, -150) scale(0.707)"><use xlink:href="#MJX-2-TEX-I-1D43F"></use></g></g></g></g></svg></mjx-container></span>) like the following equation.
</p>

<div class="math math-display"><mjx-container class="MathJax" jax="SVG" display="true"><svg style="vertical-align: -1.552ex;" xmlns="http://www.w3.org/2000/svg" width="14.144ex" height="4.588ex" role="img" focusable="false" viewBox="0 -1342 6251.6 2028" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path id="MJX-3-TEX-I-1D43F" d="M228 637Q194 637 192 641Q191 643 191 649Q191 673 202 682Q204 683 217 683Q271 680 344 680Q485 680 506 683H518Q524 677 524 674T522 656Q517 641 513 637H475Q406 636 394 628Q387 624 380 600T313 336Q297 271 279 198T252 88L243 52Q243 48 252 48T311 46H328Q360 46 379 47T428 54T478 72T522 106T564 161Q580 191 594 228T611 270Q616 273 628 273H641Q647 264 647 262T627 203T583 83T557 9Q555 4 553 3T537 0T494 -1Q483 -1 418 -1T294 0H116Q32 0 32 10Q32 17 34 24Q39 43 44 45Q48 46 59 46H65Q92 46 125 49Q139 52 144 61Q147 65 216 339T285 628Q285 635 228 637Z"></path><path id="MJX-3-TEX-N-3D" d="M56 347Q56 360 70 367H707Q722 359 722 347Q722 336 708 328L390 327H72Q56 332 56 347ZM56 153Q56 168 72 173H708Q722 163 722 153Q722 140 707 133H70Q56 140 56 153Z"></path><path id="MJX-3-TEX-N-31" d="M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z"></path><path id="MJX-3-TEX-N-32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path><path id="MJX-3-TEX-I-1D70C" d="M58 -216Q25 -216 23 -186Q23 -176 73 26T127 234Q143 289 182 341Q252 427 341 441Q343 441 349 441T359 442Q432 442 471 394T510 276Q510 219 486 165T425 74T345 13T266 -10H255H248Q197 -10 165 35L160 41L133 -71Q108 -168 104 -181T92 -202Q76 -216 58 -216ZM424 322Q424 359 407 382T357 405Q322 405 287 376T231 300Q217 269 193 170L176 102Q193 26 260 26Q298 26 334 62Q367 92 389 158T418 266T424 322Z"></path><path id="MJX-3-TEX-I-1D463" d="M173 380Q173 405 154 405Q130 405 104 376T61 287Q60 286 59 284T58 281T56 279T53 278T49 278T41 278H27Q21 284 21 287Q21 294 29 316T53 368T97 419T160 441Q202 441 225 417T249 361Q249 344 246 335Q246 329 231 291T200 202T182 113Q182 86 187 69Q200 26 250 26Q287 26 319 60T369 139T398 222T409 277Q409 300 401 317T383 343T365 361T357 383Q357 405 376 424T417 443Q436 443 451 425T467 367Q467 340 455 284T418 159T347 40T241 -11Q177 -11 139 22Q102 54 102 117Q102 148 110 181T151 298Q173 362 173 380Z"></path><path id="MJX-3-TEX-I-1D446" d="M308 24Q367 24 416 76T466 197Q466 260 414 284Q308 311 278 321T236 341Q176 383 176 462Q176 523 208 573T273 648Q302 673 343 688T407 704H418H425Q521 704 564 640Q565 640 577 653T603 682T623 704Q624 704 627 704T632 705Q645 705 645 698T617 577T585 459T569 456Q549 456 549 465Q549 471 550 475Q550 478 551 494T553 520Q553 554 544 579T526 616T501 641Q465 662 419 662Q362 662 313 616T263 510Q263 480 278 458T319 427Q323 425 389 408T456 390Q490 379 522 342T554 242Q554 216 546 186Q541 164 528 137T492 78T426 18T332 -20Q320 -22 298 -22Q199 -22 144 33L134 44L106 13Q83 -14 78 -18T65 -22Q52 -22 52 -14Q52 -11 110 221Q112 227 130 227H143Q149 221 149 216Q149 214 148 207T144 186T142 153Q144 114 160 87T203 47T255 29T308 24Z"></path><path id="MJX-3-TEX-I-1D436" d="M50 252Q50 367 117 473T286 641T490 704Q580 704 633 653Q642 643 648 636T656 626L657 623Q660 623 684 649Q691 655 699 663T715 679T725 690L740 705H746Q760 705 760 698Q760 694 728 561Q692 422 692 421Q690 416 687 415T669 413H653Q647 419 647 422Q647 423 648 429T650 449T651 481Q651 552 619 605T510 659Q484 659 454 652T382 628T299 572T226 479Q194 422 175 346T156 222Q156 108 232 58Q280 24 350 24Q441 24 512 92T606 240Q610 253 612 255T628 257Q648 257 648 248Q648 243 647 239Q618 132 523 55T319 -22Q206 -22 128 53T50 252Z"></path></defs><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g data-mml-node="math"><g data-mml-node="mi"><use xlink:href="#MJX-3-TEX-I-1D43F"></use></g><g data-mml-node="mo" transform="translate(958.8, 0)"><use xlink:href="#MJX-3-TEX-N-3D"></use></g><g data-mml-node="mfrac" transform="translate(2014.6, 0)"><g data-mml-node="mn" transform="translate(220, 676)"><use xlink:href="#MJX-3-TEX-N-31"></use></g><g data-mml-node="mn" transform="translate(220, -686)"><use xlink:href="#MJX-3-TEX-N-32"></use></g><rect width="700" height="60" x="120" y="220"></rect></g><g data-mml-node="mi" transform="translate(2954.6, 0)"><use xlink:href="#MJX-3-TEX-I-1D70C"></use></g><g data-mml-node="msup" transform="translate(3471.6, 0)"><g data-mml-node="mi"><use xlink:href="#MJX-3-TEX-I-1D463"></use></g><g data-mml-node="mn" transform="translate(485, 413) scale(0.707)"><use xlink:href="#MJX-3-TEX-N-32"></use></g></g><g data-mml-node="mi" transform="translate(4360.1, 0)"><use xlink:href="#MJX-3-TEX-I-1D446"></use></g><g data-mml-node="msub" transform="translate(5005.1, 0)"><g data-mml-node="mi"><use xlink:href="#MJX-3-TEX-I-1D436"></use></g><g data-mml-node="mi" transform="translate(715, -150) scale(0.707)"><use xlink:href="#MJX-3-TEX-I-1D43F"></use></g></g></g></g></svg></mjx-container></div>
<style>
mjx-container[jax="SVG"] {
  direction: ltr;
}

mjx-container[jax="SVG"] > svg {
  overflow: visible;
}

/* … */
</style>
```

## API

### `rehype().use(rehypeMathJax[, options])`

Transform `<span class="math-inline">` and `<div class="math-display">` with
[MathJax][].

This package includes three plugins, split out because MathJax targets have a
big memory and size footprint: SVG, CHTML, and browser:

###### SVG

Render math as [SVG][mathjax-svg] (`require('rehype-mathjax/svg')`, default).
About 566kb minzipped.

###### CHTML

Render math as [CHTML][mathjax-chtml] (`require('rehype-mathjax/chtml')`).
About 154kb minzipped.
Needs a `fontURL` to be passed.

###### Browser

Tiny wrapper to render MathJax client-side (`require('rehype-mathjax/browser')`).
About 1kb minzipped.

Uses `options.displayMath` (default: `['\\[', '\\]']`) for display, and
`options.inlineMath` (default: `['\\(', '\\)']`) for inline math.

You need to load MathJax on the client yourself and start it with corresponding
markers.
Options are not passed to MathJax: do that yourself on the client.

#### `options`

All options, except when using the browser plugin, are passed to
[MathJax][mathjax-options].
Specifically, they are passed to the chosen output processor.

#### `options.tex`

These options are passed to the [TeX input processor][mathjax-tex-options].

## Security

Use of `rehype-mathjax` renders user content with [MathJax][], so any
vulnerability in MathJax can open you to a [cross-site scripting (XSS)][xss]
attack.

Always be wary of user input and use [`rehype-sanitize`][rehype-sanitize].

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [TANIGUCHI Masaya][author]

<!-- Definitions -->

[build-badge]: https://github.com/remarkjs/remark-math/workflows/main/badge.svg

[build]: https://github.com/remarkjs/remark-math/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-math.svg

[coverage]: https://codecov.io/github/remarkjs/remark-math

[downloads-badge]: https://img.shields.io/npm/dm/rehype-mathjax.svg

[downloads]: https://www.npmjs.com/package/rehype-mathjax

[size-badge]: https://img.shields.io/bundlephobia/minzip/rehype-mathjax.svg

[size]: https://bundlephobia.com/result?p=rehype-mathjax

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/remarkjs/remark/discussions

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/remarkjs/.github/blob/HEAD/support.md

[coc]: https://github.com/remarkjs/.github/blob/HEAD/code-of-conduct.md

[license]: https://github.com/remarkjs/remark-math/blob/main/license

[author]: https://rokt33r.github.io

[rehype]: https://github.com/rehypejs/rehype

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[rehype-sanitize]: https://github.com/rehypejs/rehype-sanitize

[mathjax]: https://mathjax.org/

[mathjax-options]: http://docs.mathjax.org/en/latest/options/

[mathjax-svg]: http://docs.mathjax.org/en/latest/output/svg.html

[mathjax-chtml]: http://docs.mathjax.org/en/latest/output/html.html

[mathjax-tex-options]: http://docs.mathjax.org/en/latest/options/input/tex.html
