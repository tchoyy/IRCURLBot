var myFunctions = require('./dynamicFunction');

module.exports = function(message,from){
	var method = message.split(" ")[1];
	var paramsFunction = {
		params : message.split(" ")[2],
		from : from
	};
	if (/^[0-9A-Za-z-_\&=\.\?]+$/.test(paramsFunction.params) || /^[a-zA-Z]+$/.test(method)) {
		if (typeof myFunctions[method] === 'function') myFunctions[method](paramsFunction);	
	}
};
