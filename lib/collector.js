var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
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
		var title = '';
		var p1 = request(myUrl).then(function(content){
			$ = cheerio.load(content[0].body);
			title = $('title').text();
			return {
				"_id":uuid.v1(),
				"message": message,
				"timestamp": moment().format(),
				"channel": config.irc.channel,
				"server": config.irc.server+":"+config.irc.port,
				"nick": from,
				"urlSite": myUrl,
				"title": title
			};
		});
		var p2 = dbPouch.search({
			query: myUrl,
			fields: ['urlSite']
		});
		Promise.all([p1,p2]).then(function(datas){
			if (datas[1].rows.length != 0) throw "URL already exists in current database"; 
			else return dbPouch.put(datas[0]);
		}).then(function(){
			typeof cb === "function" && cb(null,{url:myUrl,title:title});
		}).catch(function(err){
			typeof cb === "function" && cb(err,null);
		});
	}
};
