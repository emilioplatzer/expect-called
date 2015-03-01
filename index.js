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

ec.global = function(){ return this.globalObject; };

ec.control = function control(object, functionName){
    if(!(functionName in object)){
        throw new Error('expect-called.control: function '+functionName+' does not exists in the object');
    }
    var theOldFunction = object[functionName];
    var theControl = {
        calls: [],
        This: object===this.globalObject?this.global:object,
        functionName: functionName,
        originalFunction: theOldFunction,
        stopControl: this.stopControl
    };
    var theControledFunction0 = function(){
        theControl.calls.push({
            This:this===ec.globalObject?ec.global:this, args:Array.prototype.slice.call(arguments)
        });
        return theOldFunction.apply(this,arguments);
    };
    var theControledFunction;
    switch(theOldFunction.length){
        case 0: theControledFunction=theControledFunction0; break;
        case 1: theControledFunction=function(a){ return theControledFunction0.apply(this,arguments); }; break;
        case 2: theControledFunction=function(a,b){ return theControledFunction0.apply(this,arguments); }; break;
        case 3: theControledFunction=function(a,b,c){ return theControledFunction0.apply(this,arguments); }; break;
        case 4: theControledFunction=function(a,b,c,d){ return theControledFunction0.apply(this,arguments); }; break;
        case 5: theControledFunction=function(a,b,c,d,e){ return theControledFunction0.apply(this,arguments); }; break;
        case 6: theControledFunction=function(a,b,c,d,e,f){ return theControledFunction0.apply(this,arguments); }; break;
        default: throw new Error('not implemented control for function with arity greater than 6');
    }
    object[functionName]=theControledFunction;
    return theControl;
};

ec.stopControl = function stopControl(){
    (this.This===ec.global?ec.globalObject:this.This)[this.functionName]=this.originalFunction;
};
 
exports = module.exports = ec;
