var myFunctions = require('./dynamicFunction.js');
var getUrl = require('./getUrl.js');
var moment = require('moment');
var uuid = require('node-uuid');
var client = require('./clientIRC.js');
var dbPouch = require('./pouchDb.js');
var config = require('./helpers.js').config;
	
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
		var myUrl = getUrl(message);
		if ((myUrl != null) && (from != config.irc.nick)) {
			var data = {
				"_id":uuid.v1(),
				"message": message,
				"timestamp": moment().format(),
				"channel": to,
				"server": config.irc.server+":"+config.irc.port,
				"nick": from,
				"urlSite": myUrl
			};
			dbPouch.search({
				query: myUrl,
				fields: ['urlSite']
			}).then(function(results){
				if (results.rows.length != 0) console.log("Erreur ou url déjà existante en base"); 
				else {
					dbPouch.put(data).then(function(){
						client.say(config.irc.channel,data.nick+": votre url "+data.urlSite+" a été enregistrée");
					});
				}
			});
		}
	}
});
