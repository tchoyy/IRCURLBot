var irc = require('irc');
var myFunctions = require('./dynamicFunction.js');
var getUrl = require('./getUrl.js');
var moment = require('moment');
var uuid = require('node-uuid');
var PouchDB = require('pouchdb');
var YAML = require('yamljs');

YAML.load('config.yaml',function(config){

	PouchDB.plugin(require('pouchdb-quick-search'));
	var dbPouch = new PouchDB(config.dbPath);
	
	var client = new irc.Client(config.irc.server,config.irc.nick,{
		port: config.irc.port,
		userName: config.irc.nick,
		autoConnect: false,
		autoRejoin: true
	});
	
	var paramsFunction = {
		dbPouch:dbPouch,
		client: client,
		channel:config.irc.channel
	};
	
	client.connect(function(){
		client.join(config.irc.channel,function(){
			console.log("connection au channel OK");
		});
	});
	
	client.addListener('message',function(from,to,message){
		var nickRegexp = new RegExp('^'+config.irc.nick+':');
		if (nickRegexp.test(message)){
			var method = message.split(" ")[1];
			paramsFunction.params = message.split(" ")[2];
			paramsFunction.from=from;
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
	
	client.addListener('error',function(message){
		console.log('error: ',message);
	});
});
