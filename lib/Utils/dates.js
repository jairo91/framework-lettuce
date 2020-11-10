"use strict";

let dates = {

	/**
	 * Este método realiza el restado de días a la fecha actual, devolviendo la fecha en el formato dd/mm/yyyy
	 *
	 * @param days Objeto sobre el que se va a realizar el upsert
	 * @return dateFinal con la fecha en formato dd/mm/yyyy
	*/
	dateRestingDays(days) {
		let today = new Date();
		let sevenDays = 1000 * 60 * 60 * 24 * days;
		let dateFinal = today.getTime() - sevenDays;
		dateFinal = new Date(dateFinal);
		var day = ((dateFinal.getDate()) < 10) ? ("0" + (dateFinal.getDate())) : (dateFinal.getDate());
		var monthIndex = ((dateFinal.getMonth() + 1) < 10) ? ("0" + (dateFinal.getMonth() + 1)) : (dateFinal.getMonth() + 1);
		var year = dateFinal.getFullYear();
		dateFinal = day + "/" + monthIndex + "/" + year;
		return dateFinal;
	},

	/**
	 * Este método devuelve una fecha formateada con el formato correcto
	 *
	 * @param date Fecha a formatear
	 * @param format Formato a introducir
	 * @return dateFinal con la fecha en formato dd/mm/yyyy
	*/
	formatDay(date, format) {
		let dateFinal = date.getTime();
		dateFinal = new Date(dateFinal);

		var hour = ((dateFinal.gethours()) < 10) ? ("0" + (dateFinal.gethours())) : (dateFinal.gethours());
		var minutes = ((dateFinal.getMinutes()) < 10) ? ("0" + (dateFinal.getMinutes())) : (dateFinal.getMinutes());
		var day = ((dateFinal.getDate()) < 10) ? ("0" + (dateFinal.getDate())) : (dateFinal.getDate());
		var monthIndex = ((dateFinal.getMonth() + 1) < 10) ? ("0" + (dateFinal.getMonth() + 1)) : (dateFinal.getMonth() + 1);
		var year = dateFinal.getFullYear();

		switch (format) {
			case 'dd/mm/yyyy':
				dateFinal = day + "/" + monthIndex + "/" + year;
				break;
			case 'dd-mm-yyyy':
				dateFinal = day + "-" + monthIndex + "-" + year;
				break;
			case 'dd/mm/yyyy hh:mm':
				dateFinal = day + "/" + monthIndex + "/" + year + " " + hour + ":" + minutes;
				break;
			case 'dd-mm-yyyy hh:mm':
				dateFinal = day + "-" + monthIndex + "-" + year + " " + hour + ":" + minutes;
				break;
			default:
				throw new Error(format + " is not a format valid");
		}

		return dateFinal;
	},
};
module.exports = dates;
