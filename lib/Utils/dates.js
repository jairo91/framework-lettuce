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
};
module.exports = dates;
