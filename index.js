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

ec.control = function control(object, functionName){
    return {
        stopControl: function stopControl(object, functionName){
            return null;
        }
    };
}
 
exports = module.exports = ec;
