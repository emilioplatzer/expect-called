/*!
 * expect-called
 * 2015 Emilio Platzer
 * GNU Licensed
 */

/**
 * Module dependencies.
 */

var ec={
};

ec.globalObject = function(){ return this; }();

ec.global = function(){ throw Error('This is not a real function, this is a SYMBOL'); };

var ecEquilibrateCounters={};

ec.control = function control(object, functionName, opts){
    opts=opts||{};
    var onlyArgs=!opts.withThis;
    if(!(functionName in object)){
        throw new Error('expect-called.control: function '+functionName+' does not exists in the object');
    }
    ecEquilibrateCounters[functionName]=(ecEquilibrateCounters[functionName]||0)+1;
    var theOldFunction = object[functionName];
    var theControl = {
        calls: [],
        container: object===this.globalObject?this.global:object,
        functionName: functionName,
        originalFunction: theOldFunction,
        stopControl: this.stopControl
    };
    var theCalledFunction=theOldFunction;
    if('returns' in opts){
        theControl.remainReturns = opts.returns;
        theCalledFunction=function(){
            if(!opts.returns.length){
                throw new Error('ExpectCalled.control no more returns defined for '+functionName);
            }
            return opts.returns.shift();
        }
    }
    if('mocks' in opts){
        theControl.mocksReturns = opts.mocks;
        theCalledFunction=function(){
            if(!opts.mocks.length){
                throw new Error('ExpectCalled.control no more mocks defined for '+functionName);
            }
            return opts.mocks.shift().apply(this,arguments);
        }
    }
    var theControledFunction0 = function(){
        var node={};
        if(opts.withThis) node.This=this===ec.globalObject?ec.global:this;
        node.args=Array.prototype.slice.call(arguments);
        theControl.calls.push(onlyArgs?node.args:node);
        return theCalledFunction.apply(this,arguments);
    };
    var parameterList=[];
    for(var i=0; i<theOldFunction.length; i++){
        parameterList.push('x'+i);
    }
    var functionExpresion="(function "+theOldFunction.name+
        "("+parameterList.join(',')+")"+
        "{ return theControledFunction0.apply(this,arguments); })";
    var theControledFunction=eval(functionExpresion);
    object[functionName]=theControledFunction;
    return theControl;
};

ec.stopControl = function stopControl(){
    ecEquilibrateCounters[this.functionName]--;
    (this.container===ec.global?ec.globalObject:this.container)[this.functionName]=this.originalFunction;
};

/* istanbul ignore next */
process.on('exit', function(code) {
    for(var functionName in ecEquilibrateCounters){
        var count=ecEquilibrateCounters[functionName];
        if(count){
            console.error('expect-called ERROR! Less stopControl than control for function '+functionName);
        }
    }
    return code||1;
});
 
exports = module.exports = ec;
