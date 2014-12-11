var client = require('./lib/connections/clientIRC');
var config = require('./lib/util/helpers').config;
var collector = require('./lib/collector');
var responder = require('./lib/responder');
var log = require('./lib/util/logger');
	
client.addListener('message',function(from,to,message){
	var nickRegexp = new RegExp('^'+config.irc.nick+':');
	if (nickRegexp.test(message)){
		responder(message,from);
	} else {
		collector(message,from,function(err,url){
			client.say(config.irc.channel,from+": votre url "+url+" a été enregistrée");
			log.info('URL %s de %s enregistrée avec succès',url,from);
		});
	}
});
