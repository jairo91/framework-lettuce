"use strict";

let dates = {

	/**
	 * Este método realiza el restado de días a la fecha actual, devolviendo la fecha en el formato dd/mm/yyyy
	 *
	 * @param days Objeto sobre el que se va a realizar el upsert
	 * @return dateFinal con la fecha en formato dd/mm/yyyy
	*/
	dateRestingDays(days, format = "dd/mm/yyyy") {
		let today = new Date();
		console.log("DAYS : " + days)
		let sevenDays = 1000 * 60 * 60 * 24 * days;
		console.log("DAYS : " + sevenDays)
		let dateFinal = today.getTime() - sevenDays;
		dateFinal = new Date(dateFinal);
		var day = ((dateFinal.getDate()) < 10) ? ("0" + (dateFinal.getDate())) : (dateFinal.getDate());
		var monthIndex = ((dateFinal.getMonth() + 1) < 10) ? ("0" + (dateFinal.getMonth() + 1)) : (dateFinal.getMonth() + 1);
		var year = dateFinal.getFullYear();

		return this.formatDay(dateFinal, format);
	},

	/**
	 * Este método devuelve una fecha formateada con el formato correcto
	 *
	 * @param date Fecha a formatear
	 * @param format Formato a introducir
	 * @return dateFinal con la fecha en formato dd/mm/yyyy
	*/
	formatDay(date, format) {
		let newDate = new Date(date);
		let dateFinal = newDate.getTime();
		var hour = ((newDate.getHours()) < 10) ? ("0" + (newDate.getHours())) : (newDate.getHours());
		var minutes = ((newDate.getMinutes()) < 10) ? ("0" + (newDate.getMinutes())) : (newDate.getMinutes());
		var day = ((newDate.getDate()) < 10) ? ("0" + (newDate.getDate())) : (newDate.getDate());
		var monthIndex = ((newDate.getMonth() + 1) < 10) ? ("0" + (newDate.getMonth() + 1)) : (newDate.getMonth() + 1);
		var year = newDate.getFullYear();
		let month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		switch (format) {
			case 'dd/mm/yyyy':
				dateFinal = day + "/" + monthIndex + "/" + year;
				break;
			case 'mm/dd/yyyy':
				dateFinal = monthIndex + "/" + day + "/" + year;
				break;
			case 'mmm/dd/yyyy':
				dateFinal = month_names_short[newDate.getMonth()] + "/" + day + "/" + year;
				break;
			case 'd/mm/yyyy':
				dateFinal = ((day < 10) ? day.replace("0", "") : day) + "/" + monthIndex + "/" + year;
				break;
			case 'dd/mmm/yyyy':
				dateFinal = day + "/" + month_names_short[newDate.getMonth()] + "/" + year;
				break;
			case 'dd-mm-yyyy':
				dateFinal = day + "-" + monthIndex + "-" + year;
				break;
			case 'dd-mmm-yyyy':
				dateFinal = day + "-" + month_names_short[newDate.getMonth()] + "-" + year;
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
