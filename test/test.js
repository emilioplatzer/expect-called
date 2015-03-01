
var expect = require('expect.js');
var expectCalled = require('..');

describe('expect-called', function(){
    describe('basic test', function(){
        it('first test', function(){
            throw new Error('no tests');
        });
    });
});
