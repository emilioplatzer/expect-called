# expect-called
Put data into tables

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Linux Build][travis-image]][travis-url]
[![Windows Build][appveyor-image]][appveyor-url]
[![Test Coverage][coveralls-image]][coveralls-url]

## Install

```sh
$ npm install expect-called
```

## API

```js
var expect = require('expect');

var expectCalled = require('expect-called');

function myUpper(x){
    return x.substring(0,1).toUpperCase()+x.substring(1);
}

var control = expectCalled.control(this,'myUpper');

function myCammel(normalPhrase){
    // to do
    // and to control
    // must call myUpper
}

var phrase = 'this is my camel';

var camelPhrase = myCammel

expect(camelPhrase).to.eql('ThisIsMyCamel');

expect(control.calls).to.eql([
    {This:this, args:['this']},
    {This:this, args:['is']},
    {This:this, args:['my']},
    {This:this, args:['camel']}
]);

control.stopControl();
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/expect-called.svg?style=flat
[npm-url]: https://npmjs.org/package/expect-called
[travis-image]: https://img.shields.io/travis/emilioplatzer/expect-called/master.svg?label=linux&style=flat
[travis-url]: https://travis-ci.org/emilioplatzer/expect-called
[appveyor-image]: https://img.shields.io/appveyor/ci/emilioplatzer/expect-called/master.svg?label=windows&style=flat
[appveyor-url]: https://ci.appveyor.com/project/emilioplatzer/expect-called
[coveralls-image]: https://img.shields.io/coveralls/emilioplatzer/expect-called/master.svg?style=flat
[coveralls-url]: https://coveralls.io/r/emilioplatzer/expect-called
[downloads-image]: https://img.shields.io/npm/dm/expect-called.svg?style=flat
[downloads-url]: https://npmjs.org/package/expect-called
