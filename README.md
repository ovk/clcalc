https://clcalc.net

[![Build Status](https://travis-ci.org/ovk/clcalc.svg?branch=master)](https://travis-ci.org/ovk/clcalc)
[![Coverage Status](https://coveralls.io/repos/github/ovk/clcalc/badge.svg?branch=master)](https://coveralls.io/github/ovk/clcalc?branch=master)
[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)]()
[![license](https://img.shields.io/github/license/ovk/clcalc.svg)]()

# Summary
Cl Calc is an open-source, lightweight, command-line style online calculator. It is built as fully static website and hosted through GitHub Pages (`docs` directory in the repository contains actual website). As the result of being completely static, Cl Calc performs all calculations on the client side.

Cl Calc uses [MathJS](http://mathjs.org) library for expression parsing and evaluation; thus, all MathJS features are available in Cl Calc.

# Features
Some of the Cl Calc features include:
- High precision (long arithmetic) math expression evaluation.
- Variety of built-in mathematical, scientific, programming and utility functions. This includes algebra, arithmetic, combinatorics, probability, matrix, statistics, trigonometry, logical, encoding functions and more.
- User defined variables and functions.
- Many built-in datatypes, including complex numbers, fractions, vectors, matrices and colors.
- Base64 Encoding, Unicode, hexadecimal and binary numbers support.
- Persistent links to store or share your calculations.
- Pretty-printing expressions with TeX.

# Documentation

Documentation is available [here](https://clcalc.net/help.html).

If you are completely new to Cl Calc you may want to check this small [Quick Start](https://clcalc.net/help.html#quickstart) guide.

# Build

Get the sources from the GitHub:
```
git clone https://github.com/ovk/clcalc.git
cd clcalc
```

Install the dependencies:
```
npm install
```

To build the production version of the Cl Calc website:
```
npm run-script dist
```
This will create `dist` directory with generated HTML, CSS, JavaScript files and images.

For development build do:
```
npm run-script dev
```
In development build `dist` directory will also contain source maps for JavaScript files and HTML files won't be minified. In addition to that, a web server will be started hosting `dist` contents at http://localhost:8080. It watches for changes and automatically re-runs necessary tasks to regenerate HTML, CSS or JavaScript as needed.

# Test

Make sure the dependencies are installed:
```
npm install
```

Also make sure you've run either production or development build first. See *Build* section above.

Now you can simply run:
```
npm test
```
to run the tests. This will execute tests in Chrome and Firefox in parallel by default. You can adjust this behavior in `karma.conf.js` file.

This will also generate code coverage data available under `coverage` directory. To see it navigate to either `Firefox...` or `Chrome...` subfolder inside `coverage` folder and open `lcov-report/index.html`.

# License

Cl Calc is licensed under [MIT](https://github.com/ovk/clcalc/blob/master/LICENSE) license.
