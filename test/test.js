
var expect = require('expect.js');
var expectCalled = require('..');

var theGlobal=function(){
    return this;
}();

var globalCount=0
var theLastThis=null;
var theLastArgs=null;

theGlobal.globalFunction = function(x){
    globalCount++;
    theLastThis=this;
    theLastArgs=Array.prototype.slice.call(arguments);
    return globalCount+100;
}

var theGlobalFunction=globalFunction;
var theOriginalGlobalFunction=globalFunction;
// var theGlobalFunctionContainer=this;
var theGlobalFunctionContainer=theGlobal;

describe('expect-called', function(){
    describe('basic test', function(){
        it('should control that function exists',function(){
            var emptyObject={};
            expect(function(){
                expectCalled.control(emptyObject,'fn');
            }).to.throwError('/function fn does not exists in the object/');
        });
        it('should call controled function', function(){
            var control=expectCalled.control(theGlobalFunctionContainer,'globalFunction');
            var x={};
            var y=43;
            var returned=globalFunction(x,y);
            expect([
                globalCount,theLastThis,theLastArgs,returned
            ]).to.eql([
                1          ,theGlobal  ,[x,y]      ,101
            ]);
            var expected={
                calls: [{This: expectCalled.global, args: [x,y]}],
                This: expectCalled.global,
                functionName: 'globalFunction',
                originalFunction: theOriginalGlobalFunction,
                stopControl: expectCalled.stopControl
            };
            /*
            expect(control.calls).to.eql(expected.calls);
            expect(control.This).to.eql(expected.This);
            expect(control.functionName).to.eql(expected.functionName);
            expect(control.originalFunction).to.eql(expected.originalFunction);
            expect(control.stopControl).to.eql(expected.stopControl);
            */
            expect(control).to.eql(expected);
            control.stopControl();
            expect(globalFunction).to.be(theGlobalFunction);
        });
    });
});
