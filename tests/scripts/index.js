
import Logger from '../node_modules/slogle/scripts/slogle.js';

var logger = new Logger('8fbe56c9-134e-4112-a685-2a99c4b3fcaf',{debug:true});

window.onerror = logger.GlobalErrorHandlers.windowOnError;

export var test1 = function(){
    throw new Error("test1 error");
};

export var test2 = function(){
    var a = 1;
    a();
};

export var test3 = function(){
    l.a = 1;
};