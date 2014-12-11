var _ = require('underscore');
var client = require('./connections/clientIRC');
var dbPouch = require('./connections/pouchDb');
var config = require('./util/helpers').config;

var displayURL = function(results,paramsFunction){
	_.each(results,function(item){
		var message = paramsFunction.from+": "+item.urlSite;
		if (item.title && (item.title != "")) message +=" ("+item.title+")";
		client.say(config.irc.channel,message);
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
			fields: ['message','urlSite','nick','title'],
			include_docs:true
		}).then(function(results){
			if (results.rows.length === 0) {
				dbPouch.query(function(doc,emit){
					var regexp = new RegExp(paramsFunction.params,"i");
					if (regexp.test(doc.urlSite) || regexp.test(doc.nick) || regexp.test(doc.title)) emit(doc);
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
