var i18n = require("i18n");
var config = require('./helpers').config;

i18n.configure({
	locales:['en','fr'],
	defaultLocale: config.lang,
	directory: './locales'
});

module.exports = i18n;
