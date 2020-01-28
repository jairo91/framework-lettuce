"use strict";

let dates = {
	dateRestingDays(days) {
		let today = new Date();
		let sevenDays = 1000 * 60 * 60 * 24 * days;
		let dateFinal = today.getTime() - sevenDays;
		dateFinal = new Date(dateFinal);
		var day = dateFinal.getDate();
		var monthIndex = ((dateFinal.getMonth() + 1)<10)?("0"+(dateFinal.getMonth() + 1)):(dateFinal.getMonth() + 1);
		var year = dateFinal.getFullYear();
		dateFinal = day + "/" + monthIndex + "/" + year;
		return dateFinal;
	}
};
module.exports = dates;
