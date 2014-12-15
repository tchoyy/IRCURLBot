var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var uuid = require('node-uuid');
var config = require('./util/helpers').config;
var dbPouch = require('./connections/pouchDb');
var getUrl = require('./util/helpers').getUrl;
var log = require('./util/logger');

module.exports = function(message,from,cb){
	var myUrl = getUrl(message);
	var optInRegExp = new RegExp("( "+config.irc.optin+"|"+config.irc.optin+" )");
	if ((myUrl != null) && (from != config.irc.nick) && (optInRegExp.test(message))) {
		request(myUrl,function(err,response,body){
			$ = cheerio.load(body);
			var data = {
				"_id":uuid.v1(),
				"message": message,
				"timestamp": moment().format(),
				"channel": config.irc.channel,
				"server": config.irc.server+":"+config.irc.port,
				"nick": from,
				"urlSite": myUrl,
				"title": $('title').text()
			};
			dbPouch.search({
				query: myUrl,
				fields: ['urlSite']
			}).then(function(results){
				if (results.rows.length != 0) throw "URL already exists in current database"; 
				else return dbPouch.put(data);
			}).then(function(){
				typeof cb === "function" && cb(null,{url:myUrl,title:$('title').text()});
			}).catch(function(err){
				typeof cb === "function" && cb(err,null);
			});
		});
	}
};
