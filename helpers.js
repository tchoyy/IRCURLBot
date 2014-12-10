var YAML = require('yamljs');
var weburl = require('./regex-weburl.js');

module.exports = {
	config : YAML.load('config.yaml'),
	getUrl : function(message){
		var result = message.match(weburl);
		return (result!=null)?result[0]:null;
	}
};
