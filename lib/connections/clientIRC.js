var irc = require('irc');
var i18n = require('../util/i18n');
var log = require('../util/logger');
var config = require('../util/helpers').config;

var client = new irc.Client(config.irc.server,config.irc.nick,{
	port: config.irc.port,
	userName: config.irc.nick,
	autoConnect: false,
	autoRejoin: true
});

client.connect(function(){
	client.join(config.irc.channel,function(){
		client.say(config.irc.channel,i18n.__("Hi, I'm %s ! I collect URLs, ask me 'help' if you need",config.irc.nick));
		log.info('Connected to server %s, channel %s',config.irc.server,config.irc.channel);
	});
});

client.addListener('error',function(message){
	log.error(message);
});

module.exports = client;
