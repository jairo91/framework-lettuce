
const logger = require('./logger.js');

let util = {

	/**
	 * Este método ejecutará la función pasada por parametro, tantas veces como filas en la tabla existan
	 *
	 * @param table Tabla con los parametros a pasar a la función 'validate'
	 * @param validate Función que se ejecutará tantas veces como elementos fila existan en la tabla
	 * @param msgHeader Mensaje que aparecerá cada vez que se ejecute la función
	*/
	validateTable: (table, validate, msgHeader = 'Checking the values from a table') => {
		if (typeof table === 'object' && table.hasOwnProperty('raw')) {
			table = table.raw();
		}
		(table.rawTable).forEach((row) => {
			logger.info(`${msgHeader} -> ${row[0]} ${row[1] === undefined ? "." : `: ${row[1]}.`}`);
			validate(row);
		});
	},

	/**
	 * Este método ejecutará la función pasada por parametro, tantas veces como filas en el array existan
	 *
	 * @param arrya Array con los parametros a pasar a la función 'validate'
	 * @param validate Función que se ejecutará tantas veces como elementos fila existan en la tabla
	 * @param msgHeader Mensaje que aparecerá cada vez que se ejecute la función
	*/
	validateArray: (arrayPropertiers, validateFunction, msgHeader = 'Checking the values from a table') => {
		arrayPropertiers.forEach(function (element) {
			logger.info("Estoy comprobando el elemento --> " + element);
			validateFunction(element);
		});
	}
}

module.exports = util;
