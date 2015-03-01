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
    var theControledFunction = function(){
        theControl.calls.push({
            This:this===ec.globalObject?ec.global:this, args:Array.prototype.slice.call(arguments)
        });
        return theOldFunction.apply(this,arguments);
    };
    object[functionName]=theControledFunction;
    return theControl;
};

ec.stopControl = function stopControl(){
    (this.This===ec.global?ec.globalObject:this.This)[this.functionName]=this.originalFunction;
};
 
exports = module.exports = ec;
