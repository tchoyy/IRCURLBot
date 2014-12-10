var myFunctions = require('./dynamicFunction.js');
var client = require('./clientIRC.js');
var config = require('./helpers.js').config;
var collecteur = require('./collecteur.js');
	
client.addListener('message',function(from,to,message){
	var nickRegexp = new RegExp('^'+config.irc.nick+':');
	if (nickRegexp.test(message)){
		var method = message.split(" ")[1];
		var paramsFunction = {
			params : message.split(" ")[2],
			from : from
		};
		if (/^[0-9A-Za-z-_\&=\.\?]+$/.test(paramsFunction.params) || /^[a-zA-Z]+$/.test(method)) {
			if (typeof myFunctions[method] === 'function') myFunctions[method](paramsFunction);	
		}
	} else {
		collecteur(message,from,function(err,url){
			client.say(config.irc.channel,from+": votre url "+url+" a été enregistrée");
		});
	}
});
