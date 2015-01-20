var _ = require('underscore');
var i18n = require('./util/i18n');
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
				return dbPouch.query(function(doc,emit){
					var regexp = new RegExp(paramsFunction.params,"i");
					if (regexp.test(doc.urlSite) || regexp.test(doc.nick) || regexp.test(doc.title)) emit(doc);
				},{include_docs:true}).then(function(results){
					return results.rows;
				});
			} else {
				return results.rows;
			}
		}).then(function(results){
			displayURL(_.pluck(results,"doc"),paramsFunction);
		});
	},
	help : function(paramsFunction){
		client.say(config.irc.channel,i18n.__("%s: put %s to record an Url\nlist of availables commands\n\t- getAllUrls\n\t- search <request>",paramsFunction.from,config.irc.optin));
	}
};
