
const logger = require('./logger.js');

let util = {
	validateTable: (table, validate, msgHeader = 'Checking the values from a table') => {
		if (typeof table === 'object' && table.hasOwnProperty('raw')) {
			table = table.raw();
		}
		(table.rawTable).forEach((row) => {
			logger.info(`${msgHeader} -> ${row[0]} ${row[1] === undefined ? "." : `: ${row[1]}.`}`);
			validate(row);
		});
	},
	validateArray: (arrayPropertiers, validateFunction, msgHeader = 'Checking the values from a table') => {
		arrayPropertiers.forEach(function (element) {
			logger.info("Estoy comprobando el elemento --> " + element);
			validateFunction(element);
		});
	}
}

module.exports = util;
