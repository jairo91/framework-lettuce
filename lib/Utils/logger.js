"use strict";

function js_yyyy_mm_dd_hh_mm_ss() {
	let now = new Date();
	let YYYY = "" + now.getFullYear();
	let MM = (now.getMonth().length === 1) ? "0" + now.getMonth() : now.getMonth();
	let DD = (now.getDate().length === 1) ? "0" + now.getDate() : now.getDate();
	let HH = (now.getHours().length === 1) ? "0" + now.getHours() : now.getHours();
	let mm = (now.getMinutes().length === 1) ? "0" + now.getMinutes() : now.getMinutes();
	let ss = (now.getSeconds().length === 1) ? "0" + now.getSeconds() : now.getSeconds();
	let SSS = "";
	if (now.getMilliseconds().length === 1)
		SSS = "0" + now.getMilliseconds()
	else {
		if (now.getMilliseconds().length === 2)
			SSS = "0" + now.getMilliseconds()
		else
			SSS = now.getMilliseconds();
	}
	return `${HH}:${mm}:${ss}.${SSS} ${DD}-${MM}-${YYYY}`;
}

function getDate() {
	return "[" + js_yyyy_mm_dd_hh_mm_ss() + "]";
}

let _logger = {
	levels: {
		'error': 0,
		'warn': 1,
		'info': 2,
		'verbose': 3,
		'debug': 4,
		'silly': 5
	}
};

let self = {
	level: 'info',
	error: function (message, obj = "") {
		if (_logger.levels[this.level] >= _logger.levels['error']) console.log(getDate() + " Error --> " + message, obj);
	},
	warn: function (message, obj = "") {
		if (_logger.levels[this.level] >= _logger.levels['warn']) console.log(getDate() + " Warn --> " + message, obj);
	},
	debug: function (message, obj = "") {
		if (console.log(getDate() + " Debug --> " + message, obj));
	},
	info: function (message, obj = "") {
		if (_logger.levels[this.level] >= _logger.levels['info']) console.log(getDate() + " Info --> " + message, obj);
	},
	silly: function (message, obj = "") {
		if (_logger.levels[this.level] >= _logger.levels['silly']) console.log(getDate() + " Silly --> " + message, obj);
	}
};
module.exports = self;
