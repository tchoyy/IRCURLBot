var client = require('./lib/connections/clientIRC');
var config = require('./lib/util/helpers').config;
var generateAPIKey = require('./lib/util/helpers').generateAPIKey;
var collector = require('./lib/collector');
var responder = require('./lib/responder');
var log = require('./lib/util/logger');
var api = require('./lib/API/api');
var i18n = require('./lib/util/i18n');
	
var server = api.listen(config.api.port,config.api.host);

server.on('listening',function(){
	log.info("API server listening  at http://"+server.address().address+":"+server.address().port);
});

generateAPIKey.then(function(message){
	log.info(message);
}).catch(function(err){
	log.error(err);
});

client.addListener('message',function(from,to,message){
	var nickRegexp = new RegExp('^'+config.irc.nick+':');
	if (nickRegexp.test(message)){
		responder(message,from);
	} else {
		collector(message,from,function(err,data){
			if (err) log.error(err);
			else {
				client.say(config.irc.channel,i18n.__("%s: your url %s (%s) has been saved",from,data.url,data.title));
				log.info('URL %s from %s successfully saved',data.url,from);
			}
		});
	}
});

client.addListener('pm',function(from,message){
	responder(message,from,true);
});
