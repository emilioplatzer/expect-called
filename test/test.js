
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
        var localObject;
        beforeEach(function(){
            localObject={
                memberFunction:function(x,y,z){
                    return x+y+z;
                }
            };
        });
        it('should control that function exists',function(){
            var emptyObject={};
            expect(function(){
                expectCalled.control(emptyObject,'fn');
            }).to.throwError('/function fn does not exists in the object/');
        });
        it('should call controled global function', function(){
            var control=expectCalled.control(theGlobalFunctionContainer,'globalFunction',{withThis:true});
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
                container: expectCalled.global,
                functionName: 'globalFunction',
                originalFunction: theOriginalGlobalFunction,
                stopControl: expectCalled.stopControl
            };
            /*
            expect(control.calls).to.eql(expected.calls);
            expect(control.container).to.eql(expected.container);
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
            var control=expectCalled.control(localObject,'member',{withThis:true});
            var returned=localObject.member(7);
            expect(count).to.eql(1);
            expect(returned).to.eql(8);
            var expected={
                calls: [{This: localObject, args: [7]}],
                container: localObject,
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
            var initialArity=localObject.memberFunction.length;
            var control=expectCalled.control(localObject,'memberFunction');
            var finalArity=localObject.memberFunction.length;
            expect(finalArity).to.eql(initialArity);
            control.stopControl();
        });
        it('should not change the function name', function(){
            localObject.memberFunction=function otherName(){ return null; };
            var originalFunction=localObject.memberFunction;
            var control=expectCalled.control(localObject,'memberFunction');
            var finalArity=localObject.memberFunction.length;
            expect(localObject.memberFunction.name).to.eql(originalFunction.name);
            expect(localObject.memberFunction.length).to.eql(0);
            control.stopControl();
        });
        it('should not include This in calls if not specified in options',function(){
            var originalFunction=localObject.memberFunction;
            var control=expectCalled.control(localObject,'memberFunction');
            localObject.memberFunction(7);
            localObject.memberFunction(3,4,5);
            var expected={
                calls: [[7],[3,4,5]],
                container: localObject,
                functionName: 'memberFunction',
                originalFunction: originalFunction,
                stopControl: expectCalled.stopControl
            };
            expect(control).to.eql(expected);
            control.stopControl();
        });
    });
    describe('prototype functions', function(){
        it('should control directly in de prototype',function(){
            function TheClass(){
            };
            TheClass.prototype.duplicate=function(t){ return t+','+t; }
            var originalFunction=TheClass.prototype.duplicate;
            var control=expectCalled.control(TheClass.prototype,'duplicate',{withThis:true});
            var o=new TheClass();
            var ret=o.duplicate('a');
            var expected={
                calls: [{This: o, args:['a']}],
                container: TheClass.prototype,
                functionName: 'duplicate',
                originalFunction: originalFunction,
                stopControl: expectCalled.stopControl
            };
            expect(control).to.eql(expected);
            control.stopControl();
        });
    });
    describe('SYMBOLS',function(){
        it('could not call expectCalled.global',function(){
            expect(expectCalled.global).to.throwError(/This is not a real function, this is a SYMBOL/);
        });            
    });
});
