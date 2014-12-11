var YAML = require('yamljs');
var weburl = require('./regex-weburl');

exports.config = YAML.load('config/config.yaml'),

exports.getUrl = function(message){
		var result = message.match(weburl);
		return (result!=null)?result[0]:null;
};
