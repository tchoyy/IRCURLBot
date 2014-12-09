var _ = require('underscore');

var displayURL = function(results,paramsFunction){
	_.each(_.pluck(results,"urlSite"),function(item){
		paramsFunction.client.say(paramsFunction.channel,paramsFunction.from+": "+item);
	});
};

module.exports = {
	getAllUrls : function(paramsFunction){
		paramsFunction.dbPouch.allDocs({include_docs:true}).then(function(results){
			displayURL(_.pluck(results.rows,"doc"),paramsFunction);
		});
	},
	search : function(paramsFunction){
		paramsFunction.dbPouch.query(function(doc,emit){
			var regexp = new RegExp(paramsFunction.params,"i");
			if (regexp.test(doc.urlSite) || regexp.test(doc.nick)) emit(doc);
		},{include_docs:true}).then(function(results){
			displayURL(_.pluck(results.rows,"doc"),paramsFunction);
		});
	},
	help : function(paramsFunction){
		paramsFunction.client.say(paramsFunction.channel,paramsFunction.from+": list of availables commands\n\t- getAllUrls\n\t- search <request>");
	}
};
