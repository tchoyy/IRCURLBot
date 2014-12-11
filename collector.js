var moment = require('moment');
var uuid = require('node-uuid');
var config = require('./helpers').config;
var dbPouch = require('./pouchDb');
var getUrl = require('./helpers').getUrl;
var log = require('./logger');

module.exports = function(message,from,cb){
	var myUrl = getUrl(message);
	var optInRegExp = new RegExp("( "+config.irc.optin+"|"+config.irc.optin+" )");
	if ((myUrl != null) && (from != config.irc.nick) && (optInRegExp.test(message))) {
		var data = {
			"_id":uuid.v1(),
			"message": message,
			"timestamp": moment().format(),
			"channel": config.irc.channel,
			"server": config.irc.server+":"+config.irc.port,
			"nick": from,
			"urlSite": myUrl
		};
		dbPouch.search({
			query: myUrl,
			fields: ['urlSite']
		}).then(function(results){
			if (results.rows.length != 0) log.warn("Erreur ou url déjà existante en base"); 
			else {
				dbPouch.put(data).then(function(){
					typeof cb === "function" && cb(null,myUrl);
				});
			}
		});
	}
};
