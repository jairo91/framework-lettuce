/* SmtpJS.com - v3.0.0 */
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Email = {

	/**
	 * Este método realiza la acción de envio de correo. 
	 *
	 * @param a Array con los datos de login y envio.
	 * Ejemplo:
		Email.send({
			Host: "smtp.gmail.com",
			Username: remitenteCorreo@gmail.com,
			Password: contraseñaCorreo,
			To: toEmail@servidorCorreo.com,
			From: remitenteCorreo@gmail.com,
			Subject: "subject",
			Body: "message"
		});
	*/
	send: function (a) {
		try {
			return new Promise(function (n, e) {
				a.nocache = Math.floor(1e6 * Math.random() + 1);
				a.Action = "Send";
				let t = JSON.stringify(a);
				Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) })
			})
		} catch (error) {
			console.log("Send function is failing: ", error);
		}
	},
	ajaxPost: function (e, n, t) {
		try {
			let a = Email.createCORSRequest("POST", e);
			a.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			a.onload = function () {
				var e = a.responseText;
				null != t && t(e);
			};
			a.send(n);
		} catch (error) {
			console.log("Send function is failing: ", error);
		}
	},
	ajax: function (e, n) {
		try {
			let t = Email.createCORSRequest("GET", e);
			t.onload = function () {
				var e = t.responseText;
				null != n && n(e);
			}
			t.send();
		} catch (error) {
			console.log("Send function is failing: ", error);
		}
	},
	createCORSRequest: function (e, n) {
		try {
			let t = new XMLHttpRequest;
			if ("withCredentials" in t)
				t.open(e, n, !0);
			else {
				if ("undefined" !== typeof XDomainRequest) {
					t = new XDomainRequest;
					t.open(e, n);
				}
				else
					t = null;
			}
			return t;
		} catch (error) {
			console.log("Send function is failing: ", error);
		}
	}
};
module.exports = Email;
