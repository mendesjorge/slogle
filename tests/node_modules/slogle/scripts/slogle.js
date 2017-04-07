/*jshint esversion:6*/
/**
 * Lib to wrap LE.js (send logs to logentries) with help of StackTrace.js
 * to grab all possible info and send to logentries
 */
var LE = require('le_js');
var StackTrace = require("stacktrace-js");

/**
 * [Simple object to create logs and send to logentries]
 * @param {[string]} logToken [token to log in logentries]
 * @param {[Object]} options  [Object to define options as debug, logType, BeforeLogHandler, AfterLogHandler]
 */
var Logger = function(logToken, options){
	/**
	 * LOCAL VARIABLES
	 */
	var L;
	var Stack;
	var debug;
	var defaultLogType = "Slogle type!";

	/**
	 * LOCAL FUNCTIONS
	 */

	 var _beforeLog = function(text){
	 	if(self.BeforeLogHandler)
	 		self.BeforeLogHandler(text);
	 };

	 var _afterLog = function(text){
	 	if(self.AfterLogHandler){
	 		self.AfterLogHandler(text);
	 	}
	 };

	/**
	 * INSTANCE VARIABLES
	 */
	var self = this;
	var LogToken = logToken;

	var LogObject = function(da){
		this._data = da || {};

		this.set = function(d){
			this._data = d;
		};
		this.get = function(){
			return this._data;
		};
		this.toLog = function(){
			var toRet = JSON.parse(JSON.stringify(this._data));
			toRet.Type = defaultLogType;
			return toRet;
		};
	};

	var init = function(self,options){
		LE.init(LogToken);
		L = LE;
		Stack = StackTrace;
		//simpleLog("page "+location.href);
		if(options){
			debug = options.debug || false;
			this.BeforeLog = options.BeforeLogHandler;
			this.AfterLog = options.AfterLogHandler;
			defaultLogType = options.logType || defaultLogType;
		}

		return self;
	};

	var simpleLog = function(text){
		_beforeLog(text);
		if(debug){
			console.log(text);
		}
		else{
			L.log(text);
		}
		_afterLog(text);
	};

	var errorLog = function(text){
		_beforeLog(text);
		if(debug){
			console.error(text);
		}
		else{
			L.error(text);
		}
		_afterLog(text);
	};

	//StackTrace.js functions
	var strCallstack = function(stackframes) {
		var stringifiedStack = stackframes.map(function(sf) {
			if(sf.fileName && typeof(location) == 'object'){
				sf.fileName = sf.fileName.replace(location.origin,"");
			}
			return sf.toString();
		}).join('\n');
		return stringifiedStack;
	};

	var errback = function(err) {
		errorLog(
			{
				Type:"Parsing Error object!",
				Error:err
			}
		);
	};
	//end of stackTrace.js functions

	/**
	 * [error functions with simple structure]
	 */
	var globalErrorLogFunctions = {
		windowOnError : function(msg, file, line, col, error) {
		    var logObj = new LogObject({
		    	message: msg,
		    	file:file,
		    	line:line,
		    	col:col
		    });

		    if(error){
			    Stack.fromError(error,{offline:debug})
			    .then(function(stackframes){
			    	logObj.get().stack = strCallstack(stackframes);
			    	self.ERROR(logObj.toLog());
			    })
			    .catch(errback);
			}
			else{
				self.ERROR(logObj.toLog());
			}
		}
	};

	/**
	 * INSTANCE FUNCTIONS
	 */
	//this.INIT = init;
	this.LOG = simpleLog;
	this.ERROR = errorLog;

	this.GlobalErrorHandlers = globalErrorLogFunctions;

	return init(this,options);
};

module.exports  = Logger;

//Example of using

// var logger = new Logger('8fbe56c9-134e-4112-a685-2a99c4b3fcaf',{global_error_catch:true, debug:true});

// var test = function(){
// 	var arr = [];
// 	arr.push(1);
// 	arr.get();
//};
