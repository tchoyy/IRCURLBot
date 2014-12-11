var client = require('./clientIRC');
var config = require('./helpers').config;
var collector = require('./collector');
var responder = require('./responder');
var log = require('./logger');
	
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
