# Mona [![NPM version](https://badge.fury.io/js/mona-parser.png)](http://badge.fury.io/js/mona-parser) [![Build Status](https://travis-ci.org/sykopomp/mona.png)](https://travis-ci.org/sykopomp/mona)

`mona` is
[hosted at Github](http://github.com/sykopomp/mona). `mona` is a
public domain work, dedicated using
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Feel
free to do whatever you want with it.

# Quickstart

### Install

`mona` is available through both [NPM](http://npmjs.org) and
[Bower](http://bower.io).

`$ npm install mona-parser`
or
`$ bower install mona`

Note that the `bower` version requires manually building the release.

You can also download a prebuilt `UMD` version of `mona` from the
[website](http://sykopomp.github.io/mona):

* [mona.js](http://sykopomp.github.io/mona/build/mona.js)
* [mona.min.js](http://sykopomp.github.io/mona/build/mona.min.js)
* [mona.js.src](http://sykopomp.github.io/mona/build/mona.js.src) (source map
  for minified version)

### Example

```javascript
function csv() {
  return mona.splitEnd(line(), eol());
}

function line() {
  return mona.split(cell(), mona.string(","));
}

function cell() {
  return mona.or(quotedCell(),
                 mona.text(mona.noneOf(",\n\r")));

}

function quotedCell() {
  return mona.between(mona.string('"'),
                      mona.string('"'),
                      mona.text(quotedChar()));
}

function quotedChar() {
  return mona.or(mona.noneOf('"'),
                 mona.and(mona.string('""'),
                          mona.value('"')));
}

function eol() {
  var str = mona.string;
  return mona.or(str("\n\r"),
                 str("\r\n"),
                 str("\n"),
                 str("\r"),
                 "end of line");
}

function parseCSV(text) {
  return mona.parse(csv(), text);
}

parseCSV('foo,"bar"\n"b""az",quux\n');
// => [['foo', 'bar'], ['b"az', 'quux']]
```

# Introduction

Writing parsers with `mona` involves writing a number of individually-testable
`parser constructors` which return parsers that `mona.parse()` can then
execute. These smaller parsers are then combined in various ways, even provided
as part of libraries, in order to compose much larger, intricate parsers.

`mona` tries to do a decent job at reporting parsing failures when and where
they happen, and provides a number of facilities for reporting errors in a
human-readable way.

`mona` is based on [smug](https://github.com/drewc/smug), and Haskell's
[Parsec](http://www.haskell.org/haskellwiki/Parsec) library.

### Features

* Short, readable, composable parsers
* Includes a library of useful parsers and combinators
* Returns arbitrary data from parsers, not necessarily a plain parse tree
* Human-readable error messages with source locations
* Facilities for improving your own parsers' error reports
* Supports context-sensitive parsing (see `examples/context.js`)
* Supports asynchronous, incremental parsing with `parseAsync`.
* Node.js stream API support with `parseStream`, including piping support
* Heavy test coverage (see `src/mona-test.js`)
* Small footprint (less that 4kb gzipped and minified)
* Fully documented API

### Documentation

Documentation of the latest released version is
[available here](http://sykopomp.github.io/mona). Docs are also included with
the `npm` release. You can build the docs yourself by running
`npm install && make docs` in the root of the source directory.

The documentation is currently organized as if `mona` had multiple modules,
although all modules' APIs are exported through a single module/namespace,
`mona`. That means that `mona/api.parse()` is available through `mona.parse()`

### Building

The `npm` version includes a build/ directory with both pre-built and
minified [UMD](https://github.com/umdjs/umd) versions of `mona` which
are loadable by both [AMD](http://requirejs.org/docs/whyamd.html) and
[CommonJS](http://www.commonjs.org/) module systems. UMD will define
window.mona if neither AMD or CommonJS are used. To generate these files
In `bower`, or if you fetched `mona` from source, simply run:

```
$ npm install
...dev dependencies installed...
$ make
```

And use `build/mona.js` or `build/mona.min.js` in your application.
