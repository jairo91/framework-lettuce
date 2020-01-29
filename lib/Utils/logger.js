"use strict";

/**
 * Este método devolverá un formato de fecha que se incluira en el log (hh:mm:ss.SSS DD/MM/YYYY)
 *
 * @param table Tabla con los parametros a pasar a la función 'validate'
 * @param validate Función que se ejecutará tantas veces como elementos fila existan en la tabla
 * @param msgHeader Mensaje que aparecerá cada vez que se ejecute la función
*/
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

/**
 * Este método devolverá devuelve la fecha de hoy en el formato '[hh:mm:ss.SSS DD/MM/YYYY]'
 *
 * @returns La fecha de hoy en el formato '[hh:mm:ss.SSS DD/MM/YYYY]'
*/
function getDate() {
	return "[" + js_yyyy_mm_dd_hh_mm_ss() + "]";
}

/**
 * Este método categoriza los niveles de mensajes de logs que se mostrarán
*/
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

/**
 * Este método mostrará el log, en un formato o en otro, en función del nivel seleccionado. Para distinguir mensajes
 * de error, de debug o de información
*/
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
