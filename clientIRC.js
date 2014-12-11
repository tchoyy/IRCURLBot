var irc = require('irc');
var log = require('./logger');
var config = require('./helpers').config;

var client = new irc.Client(config.irc.server,config.irc.nick,{
	port: config.irc.port,
	userName: config.irc.nick,
	autoConnect: false,
	autoRejoin: true
});

client.connect(function(){
	client.join(config.irc.channel,function(){
		log.info('Connection au serveur %s et channel %s',config.irc.server,config.irc.channel);
	});
});

client.addListener('error',function(message){
	log.error(message);
});

module.exports = client;
