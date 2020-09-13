### Use CL Calc at: [clcalc.net](https://clcalc.net)
### Detailed CL Calc Help: [clcalc.net/help.html](https://clcalc.net/help.html)
---

# Summary
Cl Calc is an open-source, lightweight, command-line style web-based calculator. It is built as a fully static website and hosted through GitHub Pages. As the result of being completely static, Cl Calc performs all calculations on the client side.

Cl Calc uses [MathJS](http://mathjs.org) library for expression parsing and evaluation and thus all MathJS features are available in Cl Calc.

# Features
Some of the Cl Calc features include:

- Arbitrary precision (long arithmetic) math expression evaluation.
- Variety of built-in mathematical, scientific, programming and utility functions. This includes algebra, arithmetic, combinatorics, probability, matrix, statistics, trigonometry, logical, encoding, hash functions and more.
- User defined variables and functions.
- Many built-in datatypes, including complex numbers, fractions, vectors, matrices and colors.
- Base64 Encoding, Unicode, hexadecimal and binary numbers support.
- Persistent links to store or share your calculations (links are not stored on any server - all information is encoded directly into the link).
- Pretty-printing math expressions with TeX.

# Documentation
Documentation is available [here](https://clcalc.net/help.html).

If you are completely new to Cl Calc you may want to check this small [Quick Start](https://clcalc.net/help.html#quickstart) guide.

# Screenshots
Light theme:
![light](https://user-images.githubusercontent.com/693072/93025838-4b627300-f5cf-11ea-9616-cd37c4518fd0.png)

Dark theme:
![dark](https://user-images.githubusercontent.com/693072/93025837-4ac9dc80-f5cf-11ea-9819-76c270e8f66b.png)

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

To build the production version of the Cl Calc static website:

```
npm run dist
```

This will create `dist` directory with generated HTML, CSS, JavaScript files and images.

To run development web server:

```
npm run dev
```

By default, the development web server will be hosting `dist` directory contents at http://localhost:8080.
Host, port and some other settings can be adjusted in `webserver` Gulp task configuration in `gulpfile.js`.
Development build generates source maps and doesn't minify JavaScript and HTML files.
Live reload is enabled as well.

# Test
Before running tests, perform either production or development build first (as per the *Build* section above).

To run tests:

```
npm test
```

This will execute tests in Chrome and Firefox in parallel by default.
This can be adjusted in `karma.conf.js` file.

This will also generate code coverage data available under `coverage` directory.

# License
Cl Calc is licensed under the [MIT](https://github.com/ovk/clcalc/blob/master/LICENSE) license.
