# mhchem Parser

mhchem is an input syntax for typesetting chemical equations and physical units.

This is the parser to convert mhchem syntax to LaTeX syntax, for downstream inclusion in [MathJax](https://mathjax.org), [KaTeX](https://katex.org) and similar projects.


## Usage

Users of MathJax and KaTex can write

    \ce{CO2 + C -> 2 CO}
    \pu{123 kJ*mol-1}

For a hundred more features and how to configure MathJax or KaTeX, see
[the manual](https://mhchem.github.io/MathJax-mhchem/).


## Usage for Downstream Software

For "translating" the `\ce` syntax, make a call like

    mhchemParser.toTex("CO2 + C -> 2 CO", "ce");

This will return

    "{\mathrm{CO}{\vphantom{A}}_{\smash[t]{2}} {}+{} \mathrm{C} {}\mathrel{\longrightarrow}{} 2\,\mathrm{CO}}"

For the `\pu` command, call

    mhchemParser.toTex("123 kJ*mol-1", "pu");

You could also insert a TeX string. All instances of `\ce` and `\pu` will be replaced in the returned value. This might make integration easier, because the mhchem parser does not need to be called from the TeX parser.

    mhchemParser.toTex("m_{\\ce{H2O}}", "tex");
