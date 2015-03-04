var myFunctions = require('./functions');
var config = require('./util/helpers').config;

module.exports = function(message,from,pm){
  var i=pm?0:1;
	var method = message.split(" ")[i];
	var paramsFunction = {
		params : message.split(" ")[i+1],
		from : from,
	};
  if (pm) paramsFunction.messageTo = from;
  else paramsFunction.messageTo = config.irc.channel;
	if (/^[0-9A-Za-z-_\&=\.\?]+$/.test(paramsFunction.params) || /^[a-zA-Z]+$/.test(method)) {
		if (typeof myFunctions[method] === 'function') myFunctions[method](paramsFunction);	
	}
};
