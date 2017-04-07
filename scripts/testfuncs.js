var log = require("./slogle");

var Logger = new log('8fbe56c9-134e-4112-a685-2a99c4b3fcaf',{debug:true});

Logger.LOG("Test simple log, Slogle type if didn't pass test");

var test1 = function(a){
	if(!a){
		throw new Error("test1 Error!");
	}
	else{
		a();
	}
};

try{
	test1(2);

}catch(er){
	// Logger.ERROR(er);
	Logger.GlobalErrorHandlers.windowOnError(er.message,null,null,null,er);
}

process.on('exit',function(){

	console.log("End simple Slogle test");
});