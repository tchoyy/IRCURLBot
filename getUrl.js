var weburl = require('./regex-weburl.js');

module.exports = function(message) {
	var result = message.match(weburl);
	return (result!=null)?result[0]:null;
};
