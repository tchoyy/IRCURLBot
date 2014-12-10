var _ = require('underscore');
var client = require('./clientIRC.js');
var dbPouch = require('./pouchDb.js');
var config = require('./helpers.js').config;

var displayURL = function(results,paramsFunction){
	_.each(_.pluck(results,"urlSite"),function(item){
		client.say(config.irc.channel,paramsFunction.from+": "+item);
	});
};

module.exports = {
	getAllUrls : function(paramsFunction){
		dbPouch.allDocs({include_docs:true}).then(function(results){
			displayURL(_.pluck(results.rows,"doc"),paramsFunction);
		});
	},
	search : function(paramsFunction){
		dbPouch.search({
			query: paramsFunction.params,
			fields: ['message','urlSite','nick'],
			include_docs:true
		}).then(function(results){
			if (results.rows.length === 0) {
				dbPouch.query(function(doc,emit){
					var regexp = new RegExp(paramsFunction.params,"i");
					if (regexp.test(doc.urlSite) || regexp.test(doc.nick)) emit(doc);
				},{include_docs:true}).then(function(results){
					displayURL(_.pluck(results.rows,"doc"),paramsFunction);
				});
			} else {
				displayURL(_.pluck(results.rows,"doc"),paramsFunction);
			}
		});
	},
	help : function(paramsFunction){
		client.say(config.irc.channel,paramsFunction.from+": put "+config.irc.optin+" to record an Url\nlist of availables commands\n\t- getAllUrls\n\t- search <request>");
	}
};
