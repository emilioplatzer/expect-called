
var expect = require('expect.js');
var expectCalled = require('..');

var theGlobal=function(){
    return this;
}();

var globalCount=0
var theLastThis=null;
var theLastArgs=null;

function globalFunction(x){
    globalCount++;
    theLastThis=this;
    theLastArgs=Array.prototype.slice.call(arguments);
    return globalCount+100;
}

describe('expect-called', function(){
    describe('basic test', function(){
        it('should call controled function', function(){
            var control=expectCalled.control(theGlobal,'globalFunction');
            var x={};
            var y=43;
            var returned=globalFunction(x,y);
            expect([
                globalCount,theLastThis,theLastArgs,returned
            ]).to.eql([
                1          ,theGlobal  ,[x,y]      ,101
            ]);
            expect(control).to.eql({
                This: theGlobal,
                functionName: 'globalFunction',
                calls: [{This: theGlobal, args: [x,y]}],
                stopControl: expectCalled.stopControl
            });
        });
    });
});
