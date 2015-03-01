
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
        it('should call controled global function', function(){
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
            var anotherCall=globalFunction(6,7);
            // control remains unchanged
            expect(control).to.eql(expected);
        });
        it('should call controled local function', function(){
            var count=0;
            var localObject={
                member:function(x){ count++; return x+1; }
            }
            var originalFunction=localObject.member;
            var control=expectCalled.control(localObject,'member');
            var returned=localObject.member(7);
            expect(count).to.eql(1);
            expect(returned).to.eql(8);
            var expected={
                calls: [{This: localObject, args: [7]}],
                This: localObject,
                functionName: 'member',
                originalFunction: originalFunction,
                stopControl: expectCalled.stopControl
            };
            expect(control).to.eql(expected);
            control.stopControl();
            expect(localObject.member).to.be(originalFunction);
            var anotherCall=localObject.member(7);
            // control remains unchanged
            expect(control).to.eql(expected);
        });
        it('should not change the function arity', function(){
            var localObject={
                memberFunction:function(x,y,z){
                    return x+y+z;
                }
            };
            var initialArity=localObject.memberFunction.length;
            var control=expectCalled.control(localObject,'memberFunction');
            var finalArity=localObject.memberFunction.length;
            expect(finalArity).to.eql(initialArity);
            control.stopControl();
        });
        it('should not change the function name', function(){
            var localObject={
                memberFunction:function(){
                    return x+y+z;
                }
            };
            var control=expectCalled.control(localObject,'memberFunction');
            var finalArity=localObject.memberFunction.length;
            expect(localObject.memberFunction.name).to.eql('memberFunction');
            expect(localObject.memberFunction.length).to.eql(0);
            control.stopControl();
        });
    });
    describe('SYMBOLS',function(){
        it('could not call expectCalled.global',function(){
            expect(expectCalled.global).to.throwError(/This is not a real function, this is a SYMBOL/);
        });            
    });
});
