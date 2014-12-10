var irc = require('irc');
var config = require('./helpers.js').config;

var client = new irc.Client(config.irc.server,config.irc.nick,{
	port: config.irc.port,
	userName: config.irc.nick,
	autoConnect: false,
	autoRejoin: true
});

client.connect(function(){
	client.join(config.irc.channel,function(){
		console.log("connection au channel OK");
	});
});

client.addListener('error',function(message){
	console.log('error: ',message);
});

module.exports = client;
