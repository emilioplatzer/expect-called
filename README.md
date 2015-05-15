# expect-called

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Linux Build][travis-image]][travis-url]
[![Windows Build][appveyor-image]][appveyor-url]
[![Test Coverage][coveralls-image]][coveralls-url]

If you want to verify that a function was called in the way you expect. 

## Install

```sh
$ npm install expect-called
```

## API

### expectedCalled.control(object, functionName, [opts])

Creates a function wrapper for object[functionName], 
the wrapper function will register de parameters used to call the function (included *this*) 
and then calls de original function and returns the returned value.

Returns a control object

opts     | type    | use for
---------|---------|-----
withThis | boolean | register *this* object in calls
returns  | Array   | create a mock function that returns each of the elements in the list one by one
mocks    | Array of function | funcions to call instead original function. Each element of the array is called in each call with the same parámeters and returning the corresponding returned value

### control.call

Is the array property that contains each call to the function. 
Each call generates a object with two properties `{This: ..., args: [... ]}`

### control.stopControl()

Stops the control function. 

### expectedCalled.global

SYMBOL that represents the root object in `control.call`

## Example

```js
var expect = require('expect.js'); // needed for the example

var expectCalled = require('expect-called');

var myModule={
    upper:function(word){
        return word.substring(0,1).toUpperCase()+word.substring(1);
    },
    cammel:function(phrase){
        // function to TEST and to CONTROL
        // must call upper
    }
}

describe('this test',function(){
  it('should call intermediate function',function(){
    var control = expectCalled.control(myModule,'upper');
    var phrase = 'this is my camel';
    var camelPhrase = myModule.cammel(phrase);
    expect(camelPhrase).to.eql('ThisIsMyCamel');
    expect(control.calls).to.eql([
        ['this'],
        ['is'],
        ['my'],
        ['camel']
    ]);
    control.stopControl();
  });
});
```

## Notes
 * Not usefull for local functions that do not belong to a object
 * Not control de returned value but could specify the returned values (like a mock function)
 * Call to control with the same function name twice without stopping the previous control could generate unexpected results. 

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
