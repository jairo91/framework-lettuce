'use strict';
const cucumberJson = require('wdio-cucumberjs-json-reporter').default
let logger = require('./Utils/logger');
let browserManager = require('./browserManager');
let data = {};

let Keywords = class Keywords {

	/**
	   * Este método devuelve el valor de la variable que se pase por parametro.
	   *
	   * @param key La variable del valor que queremos que nos devuelva
	   * @returns Devuelve el valor especificado en la llamada con el valor'key'
	*/
	getData(key) {
		logger.debug('Getting key: \'' + key + '\' with value: \'' + data[key] + '\'.');
		return data[key];
	}

	/**
	   * Este método almacena el valor de la variable que se pase por parametro.
	   *
	   * @param key El nombre con el que se quiere almacenar la variable
	   * @param value El valor de la variable que se va almacenará
	*/
	setData(key, value) {
		logger.debug('Setting key: \'' + key + '\' with value: \'' + value + '\'.');
		data[key] = value;
	}

	/**
	   * Este método contiene los métodos necesarios para poder enviar un email de manera automática.
	*/
	sendEmail() {
		logger.debug('Sending email to open case...');
		browser.newWindow('');
		browserManager.navigateTo('C:/Users/user/proyects/poc-client-cloud/test/framework/Utils/sendEmail.html');
		this.wait(3);
		browser.close();
	}

	/**
	   * Este método realiza la acción de hacer click sobre un elemento del DOM
	   *
	   * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	   * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	*/
	pushOn(element, timeOut = 10) {
		let isInternalId = (element !== undefined) ? element.hasOwnProperty('value') || element.hasOwnProperty('ELEMENT') : undefined;

		try {
			if (isInternalId) {
				logger.debug('Pushing on element id \'', element.ELEMENT + '\'...');
				browser.elementClick(element.ELEMENT);
			} else if (element !== undefined) {
				logger.debug('Pushing on \'' + element + '\'...');
				$(element).waitForDisplayed(timeOut * 1000);
				$(element).click();
			} else {
				throw Error('Element is undefined');
			}
		} catch (error) {
			logger.debug("Pushing via javascript")
			try {
				if (element.indexOf("//") !== -1) {
					this.executeScript("document.evaluate(\"" + element + "\", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();");
				} else {
					this.executeScript("document.querySelector(\"" + element + "\").click();");
				}
			} catch (error) {
				throw Error('Element not found: ' + element + "\n" + error);
			}
		}
		cucumberJson.attach(browser.takeScreenshot(), 'image/png');
	}

	/**
	   * Este método realiza la acción de escribir un texto sobre un elemento del DOM
	   *
	   * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	   * @param value El elemento valor que se escribirá sobre el elemento
	   * @param errorMessage El mensaje de error que debe mostrar en el log. Existe uno por defecto.
	   * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	*/
	writeInto(element, value, errorMessage = 'Element is not found or it is not possible insert --> ' + element, timeOut = 10) {
		logger.debug('Write into \'' + element + '\' the value: \'' + value + '\'.');
		try {
			$(element).waitForDisplayed(timeOut * 1000);
			$(element).setValue(value);
		} catch (error) {
			cucumberJson.attach(browser.takeScreenshot(), 'image/png');
		}
	}

	/**
	   * Este método obtiene el texto de un elemento del DOM
	   *
	   * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	   * @param errorMessage El mensaje de error que debe mostrar en el log. Existe uno por defecto.
	   * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	   * @returns Devuelve el texto encontrado en el elemento.
	*/
	getText(element, errorMessage = 'Element is not found or it is not possible insert --> ' + element, timeOut = 10) {
		let isInternalId = (element !== undefined) ? element.hasOwnProperty('value') : undefined;

		if (isInternalId) {
			logger.debug('Getting text of element id: \'' + element.ELEMENT + '\'.');
			logger.debug('Found text: \'', browser.getElementText(element.ELEMENT).value);
			return browser.getElementText(element.ELEMENT).value;
		} else if (element !== undefined) {
			logger.debug('Getting text of selector: \'' + element + '\'.');
			$(element).waitForDisplayed(timeOut * 1000);
			logger.debug('Found text: \'' + $(element).getText() + '\'.');

			if (Array.isArray($(element).getText())) {
				if ($(element).getText()[0] !== "")
					return $(element).getText()[0];
				else
					return $(element).getText()[1];
			} else {
				return $(element).getText();
			}
		} else {
			throw Error('Element is undefined');
		}
	}

	/**
	   * Este método  obtiene la propiedad pasada por parametro de un elemento del DOM
	   *
	   * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	   * @param property La propiedad del elemento que queremos obtener
	   * @param errorMessage El mensaje de error que debe mostrar en el log. Existe uno por defecto.
	   * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	   * @returns Devuelve la propiedad seleccionada en la llamada,'property', del elemento encontrado.
	*/
	getProperty(element, property, timeOut = 10, errorMessage = 'Element is not found or it is not possible insert --> ' + element) {
		let isInternalId = (element !== undefined) ? element.hasOwnProperty('value') : undefined;

		if (isInternalId) {
			logger.debug('Getting ' + property + ' of element id: \'' + element.ELEMENT + '\'.');
			if (String(property) === 'text') {
				logger.debug(property + ' is : ' + browser.elementIdText(element.ELEMENT).value);
				return browser.getElementText(element.ELEMENT).value;
			} else {
				logger.debug(property + ' is : ' + browser.elementIdAttribute(element.ELEMENT, property));
				return browser.elementIdAttribute(element.ELEMENT, property);
			}
		} else if (element !== undefined) {
			logger.debug('Getting text of selector: \'' + element + '\'.');
			$(element).waitForDisplayed(timeOut * 1000);
			if (String(property) === 'text') {
				logger.debug(property + ' is : ' + $(element).getText());
				return $(element).getText();
			} else {
				logger.debug(property + ' is : ' + browser.getAttribute(element, property));
				return browser.getAttribute(element, property);
			}
		}
		else
			throw Error('Element is not valid or it is undefined');
	}

	/**
	 * Este método verifica que el texto de un elemento es igual al texto pasado por parametro
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	 * @param text El texto que se quiere comprobar
	 * @param verifyEquals Booleano que define si el texto debe ser igual o distinto. True = igual o False = distinto.
	 * @param errorMessage El mensaje de error que debe mostrar en el log. Existe uno por defecto.
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	*/
	verifyText(element, text, verifyEquals = true, errorMessage = 'Element is not found or it is not possible insert --> ' + element, timeOut = 10) {
		let textElement
		logger.debug('Verifying text \'' + text + '\' in ' + element);
		if (element !== null && element !== undefined && element !== '') {
			if (text !== null && text !== undefined) {
				try {
					$(element).waitForDisplayed(timeOut * 1000);
					textElement = this.getText(element);
				} catch (error) {
					textElement = "";
				}
				if (!this.equalValues(textElement, text) && verifyEquals === true) {
					logger.error('The given text: \'' + text + '\' is not equals in the element : \'' + element);
					cucumberJson.attach(browser.takeScreenshot(), 'image/png');
					throw Error('The given text: \'' + text + '\' is not equals in the element : \'' + textElement + '\'');
				} else if (this.equalValues(textElement, text) && verifyEquals === false) {
					logger.error('The given text: \'' + text + '\' is equals in the element : \'' + element);
					cucumberJson.attach(browser.takeScreenshot(), 'image/png');
					throw Error('The given text: \'' + text + '\' is equals in the element : \'' + textelement + '\'.');
				} else {
					logger.debug('Text \'' + text + '\' found');
				}
			} else {
				cucumberJson.attach(browser.takeScreenshot(), 'image/png');
				throw Error('Text parameter: \'' + text + '\'  has not been found .');
			}
		} else {
			cucumberJson.attach(browser.takeScreenshot(), 'image/png');
			throw Error('The object ' + element + ' has not been found.');
		}
	}

	/**
	 * Este método comprueba que un elemento no esta vacio
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	 * @param errorMessage El mensaje de error que debe mostrar en el log. Existe uno por defecto.
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	*/
	isNotEmpty(element, errorMessage = 'Element is not found or it is not possible insert --> ' + element, timeOut = 10) {
		logger.debug('Verifying if text in element ' + element + ' is empty.');
		if (this.getText(element, errorMessage, timeOut) === '') {
			logger.error('The element ' + element + ' is empty.');
			throw Error('The element ' + element + ' is empty.');
		} else {
			logger.debug('OK. The element ' + element + ' is not empty.');
		}
	}

	/**
	 * Este método selecciona una opción de un combo
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	 * @param option La opción que se debe seleccionar en el elemento.
	*/
	selectOption(element, option) {
		logger.debug('Selecting option by text \'' + option + '\' in <select> list.');
		$(element).selectByVisibleText(option);
		logger.debug('Selection done!');
		cucumberJson.attach(browser.takeScreenshot(), 'image/png');
	}

	/**
	 * Este método verifica que el elemento contiene el texto pasado por parametro
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	 * @param text El texto que se quiere comprobar que contiene el elemento
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	 * @returns Devuelve un booleano. En caso de contener el elemento el texto pasado por parametro, devuelve un true. 
	 * En caso contrario, devuelve un false.
	*/
	containsText(element, text, timeOut = 10) {
		logger.debug('Verifying if text \'' + text + '\' is contained in ' + element);
		$(element).waitForDisplayed(timeOut * 1000);
		if (element !== null && element !== undefined && element !== '') {
			if (text !== null && text !== undefined && text !== '') {
				let textElement = $(element).getText();
				if (!textElement.includes(text)) {
					cucumberJson.attach(browser.takeScreenshot(), 'image/png');
					throw Error('The given text: \'' + text + '\' is not equals in the element : \'' + textElement + '\'');
				} else {
					logger.debug('Text \'' + text + '\' found');
					return true;
				}
			} else {
				cucumberJson.attach(browser.takeScreenshot(), 'image/png');
				throw Error('Text parameter: \'' + text + '\'  has not been found .');
			}
		} else {
			cucumberJson.attach(browser.takeScreenshot(), 'image/png');
			throw Error('The object ' + element + ' has not been found.');
		}
	}

	/**
	 * Este método devueve el id del elemento, para ser usado en otro keyword.
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	 * @returns Devuelve el id, del elemento encontrado
	*/
	element(element, timeOut = 10) {
		logger.debug('Fetching an element which matches the selector \'' + element + '\'.');
		try {
			$(element).waitForDisplayed(timeOut * 1000);
			logger.debug('Found element: ', $(element));
			return $(element).value;
		} catch (error) {
			logger.debug(error);
			return undefined;
		}

	}

	/**
	 * Este método devueve los id de los elementos con el xpath o css pasado por parametro, para ser usado en otro keyword.
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	 * @returns Devuelve un array con los Ids de los elementos encontrados
	*/
	elements(element, timeOut = 10) {
		logger.debug('Fetching elements which match the selector \'' + element + '\'.');
		try {
			$(element).waitForDisplayed(timeOut * 1000);
			let foundElements = $$(element).value;
			logger.debug('Found elements: ', foundElements.length);
			return browser.elements(element).value;
		} catch (error) {
			logger.debug(error);
			return undefined;
		}
	}

	/**
	 * Este método realiza una espera concreta de tiempo
	 *
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	*/
	wait(timeOut) {
		logger.debug('Waiting ' + timeOut + 's.');
		browser.pause(timeOut * 1000);
	}

	/**
	 * Este método realiza una espera hasta que el elemento esta presente. Si al finalizar el tiempo no esta presente, fallará el caso.
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	*/
	waitToBePresent(element, timeOut = 10) {
		logger.debug('Waiting for element -> ' + element + ' in ' + timeOut + 's.');
		try {
			$(element).waitForDisplayed(timeOut * 1000);
		} catch (error) {
			cucumberJson.attach(browser.takeScreenshot(), 'image/png');
			throw Error('The given element: \'' + element + '\' is not present in ' + timeOut + 's.');
		}
	}

	/**
	 * Este método realiza una espera hasta que el elemento deje de estar presente. Si al finalizar el tiempo sigue presente, fallará el caso.
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	*/
	waitToVanish(element, timeOut = 10) {
		logger.debug('Waiting for element -> ' + element + ' to disappear in ' + timeOut + 's.');
		let counter = 0;
		let flag = true;
		while (counter < timeOut && flag) {
			counter++;
			this.wait(1);
			if (!$(element).isDisplayed()) {
				flag = false;
			}
		}
		if (flag) {
			cucumberJson.attach(browser.takeScreenshot(), 'image/png');
			throw Error('The given element: \'' + element + '\' is STILL present in ' + timeOut + 's.');
		}
	}

	/**
	 * Este método comprueba que dos cadenas pasadas por parametro, son iguales. En caso de ser iguales devuelve un 'true' y caso de no serlo un 'false'
	 *
	 * @param value1 Primer valor a comprobar
	 * @param value2 Segundo valor a comprobar
	 * @param timeOut Mensaje de error que se mostrá en el log
	 * @returns Devuelve un booleano. En caso de ser los valores iguales, devuelve un true, en caso contrario un false
	*/
	equalValues(value1, value2, errorMessage = 'The values are different : \'' + value1 + '\' - \'' + value2 + '\'.') {
		logger.debug('Verifying that they are the same : ' + value1 + ' - ' + value2);

		if (value1 === value2) {
			logger.debug('The values are the same. \'' + value1 + '\' - \'' + value2 + '\'.');
			return true;
		} else {
			logger.debug(errorMessage);
			return false;
		}
	}

	/**
	 * Este método comprueba que dos cadenas pasadas por parametro, son iguales. En caso de ser diferentes fallará
	 *
	 * @param value1 Primer valor a comprobar
	 * @param value2 Segundo valor a comprobar
	 * @param timeOut Mensaje de error que se mostrá en el log
	*/
	assertValues(value1, value2, errorMessage = 'The values are different : \'' + value1 + '\' - \'' + value2 + '\'.') {
		if (this.equalValues(value1, value2, errorMessage) === false) {
			throw errorMessage;
		}
	}

	/**
	 * Este método comprueba que dos arrays pasados por parametro, son iguales. En caso de ser diferentes fallará
	 *
	 * @param value1 Primer valor a comprobar
	 * @param value2 Segundo valor a comprobar
	 * @param timeOut Mensaje de error que se mostrá en el log
	*/
	assertValuesArray(baseValue, arrayValues, errorMessage = 'None of the values match with: \'' + baseValue + '\'.') {
		let i;
		let flag = false;
		for (i = 0; i < arrayValues.length; i++) {
			if (this.equalValues(baseValue, arrayValues[i]) === true) {
				flag = true;
				break;
			}
		}
		if (flag === false) {
			throw errorMessage;
		}
	}

	/**
	 * Este método comprueba que existe un elemento en pantalla. Si existe devuelve un 'true' y si no existe, un 'false'
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	 * @param errorMessage Mensaje de error que se mostrá en el log
	 * @returns Devuelve un booleano. En caso de que elemento exista, devuelve un true, en caso contrario un false
	*/
	exists(element, timeOut = 10, errorMessage = 'Verifying that \'' + element + '\' is existing in ' + timeOut + 's.') {
		logger.debug(errorMessage);
		try {
			$(element).waitForExist(timeOut * 1000);
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Este método comprueba que un elemento es mostrado en pantalla. Si esta presente devuelve un 'true' y si no existe, un 'false'
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	 * @param errorMessage Mensaje de error que se mostrá en el log
	 * @returns Devuelve un booleano. En caso de que elemento se muestre en pantalla, devuelve un true, en caso contrario un false
	*/
	isDisplayed(element, timeOut = 10, errorMessage = 'Verifying that \'' + element + '\' is displayed in ' + timeOut + 's.') {
		logger.debug(errorMessage);
		try {
			$(element).waitForDisplayed(timeOut * 1000);
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Este método realiza una espera hasta que el elemento deje exista en el DOM. Si al finalizar el tiempo sigue presente, fallará el caso.
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	*/
	waitForExist(element, timeOut = 10) {
		logger.debug('Waiting ' + timeOut + 's for this element to exist -> ' + element + '.');
		try {
			$(element).waitForExist(timeOut * 1000);
		} catch (error) {
			cucumberJson.attach(browser.takeScreenshot(), 'image/png');
			throw Error('The given element: \'' + element + '\' is not present in ' + timeOut + 's.');
		}
	}

	/**
	 * Este método comprueba que un elemento esta presente en un timeOut(por defecto, 1 segundo). En caso de no estar presente fallará.
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	 * @param errorMessage Mensaje de error que se mostrá en el log
	*/
	isPresent(element, timeOut = 1, errorMessage = 'Verifying that \'' + element + '\' is present in ' + timeOut + 's.') {
		logger.debug(errorMessage);

		console.log($(element).isExisting());
		if (!(this.exists(element, timeOut))) {
			throw Error('The given element: \'' + element + '\' is NOT present in ' + timeOut + 's.');
		}
	}

	/**
	 * Este método comprueba que un elemento no esta presente en un timeOut(por defecto, 1 segundo). En caso de estar presente fallará.
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	 * @param errorMessage Mensaje de error que se mostrá en el log
	*/
	isNotPresent(element, timeOut = 0, errorMessage = 'Element is present --> ' + element) {
		logger.debug('Verifying that \'' + element + '\' is not present in ' + timeOut + 's.');

		if (this.exists(element, timeOut)) {
			throw Error('The given element: \'' + element + '\' is present in ' + timeOut + 's.');
		}
	}

	/**
	 * Este método ejecuta un script javascript contra la consola del navegador. Se pasan una serie de argumentos que se incuiran en el script
	 *
	 * @param script Script que se quiere ejecutar
	 * @param arg Argumentos que se pasan al script a ejecutar
	*/
	executeScript(script, arg) {
		logger.debug('Executing the script');
		browser.execute(script, arg);
		logger.debug('The script has been executed');
		cucumberJson.attach(browser.takeScreenshot(), 'image/png');
	}

	/**
	 * Este método realiza un scroll hasta el elemento pasado por parametro
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	*/
	dragToFind(element) {
		logger.debug('Dragging to find element \'' + element + '\'.');
		if ($(element).isExisting())
			$(element).moveTo();
		else
			throw Error('The given element: \'' + element + '\' is not present to do scroll');
	}

	/**
	 * Este método realiza un scroll hasta mostrar en pantlalla el elemento pasado por parametro
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	 * @param top En caso de ser 'true' posicionará el elemento en la parte superior de la pantalla. Con 'false' posicionará el elemento en la parte inferior.
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	*/
	scrollIntoView(element, top = false, timeOut = 10) {
		logger.debug('Scrolling into view to find element \'' + element + '\'.');
		if ($(element).waitForExist(timeOut * 1000))
			$(element).scrollIntoView(top);
		else
			throw Error('The given element: \'' + element + '\' is not present to do scroll');
	}

	/**
		 * Este método comprueba que no existe un elemento en pantalla. Si no existe devuelve un 'true' y si existe, un 'false'
		 *
		 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
		 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
		 * @param errorMessage Mensaje de error que se mostrá en el log
	 	 * @returns Devuelve un booleano. En caso de que elemento no exista, devuelve un true, en caso contrario un false
	*/
	notExists(element, timeOut = 1, errorMessage = 'Element is not existing --> ' + element) {
		logger.debug('Verifying that \'' + element + '\' is not existing in ' + timeOut * 1000 + 's.');
		try {
			$(element).waitForDisplayed(timeOut * 1000);
			return false;
		} catch (error) {
			return true;
		}
	}

	/**
		 * Este método remplaza valores dentro de un selector. Es posible sustituir dos valores.
		 *
		 * @param selector El selector en el que se sustituiran los valores
		 * @param value1 Valor del primer cambio editable, se sustituirá por %%
		 * @param value2 Valor del primer cambio editable, se sustituirá por $$
		 * @returns Devuelve el nuevo selector con los valores nuevos sustituidos
	*/
	replaceSelector(selector, value1 = "undefined", value2 = "undefined") {
		let newSelector;
		if (value1 !== "udnefined") {
			newSelector = selector.replace('%%', value1);
			if (value2 !== "udnefined") {
				newSelector = newSelector.replace('$$', value2);
			}
		}
		return newSelector;
	}

	/**
	 * Este método realiza una espera hasta que una alerta exista en pantalla durante un tiempo determinado, por defecto 10 segundos
	 *
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	*/
	waitToAlert(timeOut = 10) {
		logger.debug('Waiting to alert ' + timeOut + "s...");
		let flag = false;
		let count = 0;
		while (!flag && count < timeOut) {
			try {
				browserManager.alertAccept();
				flag = true;
			} catch (error) {
				this.wait(1);
				count++;
			}
		}
	}
};

module.exports = new Keywords();
module.exports.AbstractKeywords = Keywords;

