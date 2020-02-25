'use strict';
let logger = require('./Utils/logger');
let data = {};

function init(browser, overwrite) {
	function noSuchElement(result) {
		return {
			status: 7,
			type: 'NoSuchElement',
			message: 'An element could not be located on the page using the given search parameters.',
			state: 'failure',
			sessionId: result.sessionId,
			value: null,
			selector: result.selector
		};
	}

	function _getLastResult() {
		const lastResult = (browser.lastPromise && browser.lastPromise.inspect().value)
			? browser.lastPromise.inspect().value.value
			: null;
		return lastResult;
	}

	function _AttachmentCommand(command) {
		try {
			browser.config.lettuce.errorCommand(command);
		} catch (Err) {
			logger.error("AttachmentCommand is not configured in config file.");
		}

	}
	/**
	 * Este método devuelve el valor de la variable que se pase por parametro.
	 *
	 * @param key La variable del valor que queremos que nos devuelva
	 * @returns Devuelve el valor especificado en la llamada con el valor'key'
	*/
	browser.addCommand('getData', function (key) {
		logger.debug('Getting key: \'' + key + '\' with value: \'' + data[key] + '\'.');
		return data[key];
	});

	/**
	 * Este método ejecuta un script javascript contra la consola del navegador. Se pasan una serie de argumentos que se incuiran en el script
	 *
	 * @param script Script que se quiere ejecutar
	 * @param arg Argumentos que se pasan al script a ejecutar
	*/
	browser.addCommand('execute', function (script, arg) {
		logger.debug('Executing the following script: \nscript\n');
		browser.execute(script, arg);
		logger.debug('The script has been executed');
		_AttachmentCommand('execute');
	}, true);

	/**
	 * Este método almacena el valor de la variable que se pase por parametro.
	 *
	 * @param key El nombre con el que se quiere almacenar la variable
	 * @param value El valor de la variable que se va almacenará
	*/
	browser.addCommand('setData', function (key, value) {
		logger.debug('Setting key: \'' + key + '\' with value: \'' + value + '\'.');
		data[key] = value;
	});

	/**
	 * Este método verifica que el texto de un elemento es igual al texto pasado por parametro
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	 * @param text El texto que se quiere comprobar
	 * @param verifyEquals Booleano que define si el texto debe ser igual o distinto. True = igual o False = distinto.
	 * @param errorMessage El mensaje de error que debe mostrar en el log. Existe uno por defecto.
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	*/
	browser.addCommand('verifyText', function (element, text, verifyEquals = true, errorMessage = 'Element is not found or it is not possible insert --> ' + element, timeOut = 10) {
		let textElement
		logger.debug('Verifying text \'' + text + '\' in ' + element);
		if (element !== null && element !== undefined && element !== '') {
			if (text !== null && text !== undefined) {
				try {
					$(element).waitForDisplayed(timeOut * 1000);
					textElement = browser.getText(element);
				} catch (error) {
					textElement = "";
				}
				if (!browser.equalValues(textElement, text) && verifyEquals === true) {
					logger.error('The given text: \'' + text + '\' is not equals in the element : \'' + element);
					_AttachmentCommand('verifyText');
					throw Error('The given text: \'' + text + '\' is not equals in the element : \'' + textElement + '\'');
				} else if (browser.equalValues(textElement, text) && verifyEquals === false) {
					logger.error('The given text: \'' + text + '\' is equals in the element : \'' + element);
					_AttachmentCommand('verifyText');
					throw Error('The given text: \'' + text + '\' is equals in the element : \'' + textelement + '\'.');
				} else {
					logger.debug('Text \'' + text + '\' found');
				}
			} else {
				_AttachmentCommand('verifyText');
				throw Error('Text parameter: \'' + text + '\'  has not been found .');
			}
		} else {
			_AttachmentCommand('verifyText');
			throw Error('The object ' + element + ' has not been found.');
		}
	});

	browser.addCommand('wait', function (timeOut) {
		logger.debug('Waiting ' + timeOut + 's.');
		return browser.pause(timeOut * 1000);
	});

	/**
 * Este método verifica que el elemento contiene el texto pasado por parametro
 *
 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
 * @param text El texto que se quiere comprobar que contiene el elemento
 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
 * @returns Devuelve un booleano. En caso de contener el elemento el texto pasado por parametro, devuelve un true. 
 * En caso contrario, devuelve un false.
*/
	browser.addCommand('containsText', function (element, text, timeOut = 10) {
		logger.debug('Verifying if text \'' + text + '\' is contained in ' + element);
		$(element).waitForDisplayed(timeOut * 1000);
		if (element !== null && element !== undefined && element !== '') {
			if (text !== null && text !== undefined && text !== '') {
				let textElement = $(element).getText();
				if (!textElement.includes(text)) {
					_AttachmentCommand('containsText');
					throw Error('The given text: \'' + text + '\' is not equals in the element : \'' + textElement + '\'');
				} else {
					logger.debug('Text \'' + text + '\' found');
					return true;
				}
			} else {
				_AttachmentCommand('containsText');
				throw Error('Text parameter: \'' + text + '\'  has not been found .');
			}
		} else {
			_AttachmentCommand('containsText');
			throw Error('The object ' + element + ' has not been found.');
		}
	});
	/**
			 * Este método realiza una espera hasta que el elemento deje de estar presente. Si al finalizar el tiempo sigue presente, fallará el caso.
			 *
			 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
			 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
			*/
	browser.addCommand('waitToVanish', function (element, timeOut = 10) {
		logger.debug('Waiting for element -> ' + element + ' to disappear in ' + timeOut + 's.');
		let counter = 0;
		let flag = true;
		while (counter < timeOut && flag) {
			counter++;
			browser.pause(1);
			if (!$(element).isDisplayed()) {
				flag = false;
			}
		}
		if (flag) {
			_AttachmentCommand('waitToVanish');
			throw Error('The given element: \'' + element + '\' is STILL present in ' + timeOut + 's.');
		}
	});



	/**
	 * Este método comprueba que dos cadenas pasadas por parametro, son iguales. En caso de ser iguales devuelve un 'true' y caso de no serlo un 'false'
	 *
	 * @param value1 Primer valor a comprobar
	 * @param value2 Segundo valor a comprobar
	 * @param timeOut Mensaje de error que se mostrá en el log
	 * @returns Devuelve un booleano. En caso de ser los valores iguales, devuelve un true, en caso contrario un false
	*/
	browser.addCommand('equalValues', function (value1, value2, errorMessage = 'The values are different : \'' + value1 + '\' - \'' + value2 + '\'.') {
		logger.debug('Verifying that they are the same : ' + value1 + ' - ' + value2);

		if (value1 === value2) {
			logger.debug('The values are the same. \'' + value1 + '\' - \'' + value2 + '\'.');
			return true;
		} else {
			logger.debug(errorMessage);
			return false;
		}
	});

	/**
	 * Este método comprueba que dos cadenas pasadas por parametro, son iguales. En caso de ser diferentes fallará
	 *
	 * @param value1 Primer valor a comprobar
	 * @param value2 Segundo valor a comprobar
	 * @param timeOut Mensaje de error que se mostrá en el log
	*/
	browser.addCommand('assertValues', function (value1, value2, errorMessage = 'The values are different : \'' + value1 + '\' - \'' + value2 + '\'.') {
		if (this.equalValues(value1, value2, errorMessage) === false) {
			throw errorMessage;
		}
	});

	/**
	 * Este método comprueba que dos arrays pasados por parametro, son iguales. En caso de ser diferentes fallará
	 *
	 * @param value1 Primer valor a comprobar
	 * @param value2 Segundo valor a comprobar
	 * @param timeOut Mensaje de error que se mostrá en el log
	*/
	browser.addCommand('assertValuesArray', function (baseValue, arrayValues, errorMessage = 'None of the values match with: \'' + baseValue + '\'.') {
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
	});

	/**
	 * Este método comprueba que existe un elemento en pantalla. Si existe devuelve un 'true' y si no existe, un 'false'
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	 * @param errorMessage Mensaje de error que se mostrá en el log
	 * @returns Devuelve un booleano. En caso de que elemento exista, devuelve un true, en caso contrario un false
	*/
	browser.addCommand('exists', function (element, timeOut = 10, errorMessage = 'Verifying that \'' + element + '\' is existing in ' + timeOut + 's.') {
		logger.debug(errorMessage);
		try {
			$(element).waitForExist(timeOut * 1000);
			return true;
		} catch (error) {
			return false;
		}
	});

	/**
	 * Este método comprueba que un elemento es mostrado en pantalla. Si esta presente devuelve un 'true' y si no existe, un 'false'
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	 * @param errorMessage Mensaje de error que se mostrá en el log
	 * @returns Devuelve un booleano. En caso de que elemento se muestre en pantalla, devuelve un true, en caso contrario un false
	*/
	browser.addCommand('isDisplayed', function (element, timeOut = 10, errorMessage = 'Verifying that \'' + element + '\' is displayed in ' + timeOut + 's.') {
		logger.debug(errorMessage);
		try {
			$(element).waitForDisplayed(timeOut * 1000);
			return true;
		} catch (error) {
			return false;
		}
	});


	/**
	 * Este método comprueba que un elemento no esta presente en un timeOut(por defecto, 1 segundo). En caso de estar presente fallará.
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	 * @param errorMessage Mensaje de error que se mostrá en el log
	*/
	browser.addCommand('isNotPresent', function (element, timeOut = 0, errorMessage = 'Element is present --> ' + element) {
		logger.debug('Verifying that \'' + element + '\' is not present in ' + timeOut + 's.');

		if (this.exists(element, timeOut)) {
			throw Error('The given element: \'' + element + '\' is present in ' + timeOut + 's.');
		}
	});

	/**
	 * Este método comprueba que un elemento esta presente en un timeOut(por defecto, 1 segundo). En caso de no estar presente fallará.
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
	 * @param errorMessage Mensaje de error que se mostrá en el log
	*/
	browser.addCommand('isPresent', function (element, timeOut = 1, errorMessage = 'Element is present --> ' + element) {
		logger.debug(errorMessage);

		if (!(browser.exists(element, timeOut))) {
			throw Error('The given element: \'' + element + '\' is NOT present in ' + timeOut + 's.');
		}
	});

	/**
	 * Este método realiza un scroll hasta el elemento pasado por parametro
	 *
	 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
	*/
	browser.addCommand('dragToFind', function (element) {
		logger.debug('Dragging to find element \'' + element + '\'.');
		if ($(element).isExisting())
			$(element).moveTo();
		else
			throw Error('The given element: \'' + element + '\' is not present to do scroll');
	});

	/**
		 * Este método comprueba que no existe un elemento en pantalla. Si no existe devuelve un 'true' y si existe, un 'false'
		 *
		 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
		 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
		 * @param errorMessage Mensaje de error que se mostrá en el log
		   * @returns Devuelve un booleano. En caso de que elemento no exista, devuelve un true, en caso contrario un false
	*/
	browser.addCommand('notExists', function (element, timeOut = 1, errorMessage = 'Element is not existing --> ' + element) {
		logger.debug('Verifying that \'' + element + '\' is not existing in ' + timeOut * 1000 + 's.');
		try {
			$(element).waitForDisplayed(timeOut * 1000);
			return false;
		} catch (error) {
			return true;
		}
	});

	browser.addCommand('pushOn', function (element, timeOut = 10) {
		console.log("Element: ", element)
		let isInternalId = (element !== undefined) ? element.hasOwnProperty('value') || element.hasOwnProperty('ELEMENT') : undefined;

		try {
			if (isInternalId) {
				logger.debug('Pushing on element id \'', element.ELEMENT + '\'...');
				browser.elementClick(element.ELEMENT);
			} else if (element !== undefined) {
				logger.debug('Pushing on \'' + element + '\'...');
				$(element).waitForDisplayed(timeOut * 1000);
				browser.elementClick($(element).ELEMENT);
			} else {
				throw Error('Element is undefined');
			}
		} catch (error) {
			logger.debug("Pushing via javascript")
			try {
				if (element.indexOf("//") !== -1) {
					this.executeScript(`document.evaluate(\"${element.replace(/\"/g, "'")}\", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();`);
				} else {
					this.executeScript(`document.querySelector(\"${element.replace(/\"/g, "'")}\").click();`);
				}
			} catch (error) {
				throw Error('Element not found: ' + element + "\n" + error);
			}
		}
		_AttachmentCommand('pushOn');
	});

	if (overwrite) {
		browser.addCommand('click', function (element, timeOut = 10) {
			logger.debug('Setting key: \'' + key + '\' with value: \'' + value + '\'.');
			data[key] = value;
			try {
				logger.debug('Pushing on \'' + element + '\'...');
				$(element).waitForDisplayed(timeOut * 1000);
				$(element).click();
			} catch (error) {
				logger.debug("Pushing via javascript")
				try {
					if (element.indexOf("//") !== -1) {
						this.executeScript(`document.evaluate(\"${element.replace(/\"/g, "'")}\", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();`);
					} else {
						this.executeScript(`document.querySelector(\"${element.replace(/\"/g, "'")}\").click();`);
					}
				} catch (error) {
					throw Error('Element not found: ' + element + "\n" + error);
				}
			}
			_AttachmentCommand('click');
		}, true);

		browser.addCommand('elementClick', function (element) {
			try {
				logger.debug('Pushing on element id \'', element.ELEMENT + '\'...');
				browser.elementClick(element.ELEMENT);
			} catch (error) {
				throw Error('Element not found: ' + element + "\n" + error);
			}
			_AttachmentCommand('elementClick');
		}, true);

		/**
		   * Este método realiza la acción de escribir un texto sobre un elemento del DOM
		   *
		   * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
		   * @param value El elemento valor que se escribirá sobre el elemento
		   * @param errorMessage El mensaje de error que debe mostrar en el log. Existe uno por defecto.
		   * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
		*/
		browser.addCommand('setValue', function (element, value, errorMessage = 'Element is not found or it is not possible insert --> ' + element, timeOut = 10) {
			logger.debug('Write into \'' + element + '\' the value: \'' + value + '\'.');
			try {
				$(element).waitForDisplayed(timeOut * 1000);
				$(element).setValue(value);
			} catch (error) {
				_AttachmentCommand('setValue');
				throw Error(errorMessage);
			}
		}, true);

		/**
		   * Este método obtiene el texto de un elemento del DOM
		   *
		   * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
		   * @param errorMessage El mensaje de error que debe mostrar en el log. Existe uno por defecto.
		   * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
		   * @returns Devuelve el texto encontrado en el elemento.
		*/
		browser.addCommand('getText', function (element, errorMessage = 'Element is not found or it is not possible insert --> ' + element, timeOut = 10) {
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
		}, true);

		/**
		   * Este método  obtiene la propiedad pasada por parametro de un elemento del DOM
		   *
		   * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
		   * @param property La propiedad del elemento que queremos obtener
		   * @param errorMessage El mensaje de error que debe mostrar en el log. Existe uno por defecto.
		   * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
		   * @returns Devuelve la propiedad seleccionada en la llamada,'property', del elemento encontrado.
		*/
		browser.addCommand('getAttribute', function (element, property, timeOut = 10, errorMessage = 'Element is not found or it is not possible insert --> ' + element) {
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
					return $(element).getText();
				} else {
					logger.debug(property + ' is : ' + $(element).getAttribute(property));
					return $(element).getAttribute(property);
				}
			}
			else
				throw Error('Element is not valid or it is undefined');
		}, true);

		/**
		 * Este método selecciona una opción de un combo
		 *
		 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
		 * @param option La opción que se debe seleccionar en el elemento.
		*/
		browser.addCommand('selectByVisibleText', function (element, option) {
			logger.debug('Selecting option by text \'' + option + '\' in <select> list.');
			$(element).selectByVisibleText(option);
			logger.debug('Selection done!');
			_AttachmentCommand('selectByVisibleText');
		}, true);

		/**
		 * Este método devueve el id del elemento, para ser usado en otro keyword.
		 *
		 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
		 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
		 * @returns Devuelve el id, del elemento encontrado
		*/
		browser.addCommand('element', function (element, timeOut = 10) {
			logger.debug('Fetching an element which matches the selector \'' + element + '\'.');
			try {
				$(element).waitForDisplayed(timeOut * 1000);
				logger.debug('Found element: ', $(element));
				return $(element);
			} catch (error) {
				logger.debug(error);
				return undefined;
			}
		}, true);

		browser.addCommand('elements', function (element, timeOut = 10) {
			logger.debug('Fetching elements which match the selector \'' + element + '\'.');
			try {
				$(element).waitForDisplayed(timeOut * 1000);
				let foundElements = $$(element);
				logger.debug('Found elements: ', foundElements.length);
				return foundElements;
			} catch (error) {
				logger.debug(error);
				return undefined;
			}
		}, true);

		/**
		 * Este método realiza una espera concreta de tiempo
		 *
		 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
		*/
		browser.addCommand('timeOut', function (timeOut) {
			logger.debug('Waiting ' + timeOut + 's.');
			browser.pause(timeOut * 1000);
		}, true);

		/**
		 * Este método realiza una espera hasta que el elemento esta presente. Si al finalizar el tiempo no esta presente, fallará el caso.
		 *
		 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
		 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
		*/
		browser.addCommand('waitForDisplayed', function (element, timeOut = 10) {
			logger.debug('Waiting for element -> ' + element + ' in ' + timeOut + 's.');
			try {
				browser.debug();
				$(element).waitForDisplayed(timeOut * 1000);
			} catch (error) {
				_AttachmentCommand('waitForDisplayed');
				throw Error('The given element: \'' + element + '\' is not present in ' + timeOut + 's.');
			}
		}, true);


		/**
		 * Este método realiza una espera hasta que el elemento deje exista en el DOM. Si al finalizar el tiempo sigue presente, fallará el caso.
		 *
		 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
		 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
		*/
		browser.addCommand('waitForExist', function (element, timeOut = 10) {
			logger.debug('Waiting ' + timeOut + 's for this element to exist -> ' + element + '.');
			try {
				$(element).waitForExist(timeOut * 1000);
			} catch (error) {
				_AttachmentCommand('waitForExist');
				throw Error('The given element: \'' + element + '\' is not present in ' + timeOut + 's.');
			}
		}, true);

		/**
		 * Este método comprueba que un elemento esta presente en un timeOut(por defecto, 1 segundo). En caso de no estar presente fallará.
		 *
		 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
		 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
		 * @param errorMessage Mensaje de error que se mostrá en el log
		*/
		browser.addCommand('isExisting', function (element, timeOut = 1, errorMessage = 'Verifying that \'' + element + '\' is present in ' + timeOut + 's.') {
			logger.debug(errorMessage);

			console.log($(element).isExisting());
			if (!(browser.exists(element, timeOut))) {
				throw Error('The given element: \'' + element + '\' is NOT present in ' + timeOut + 's.');
			}
		}, true);

		/**
		 * Este método realiza un scroll hasta el elemento pasado por parametro
		 *
		 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
		*/
		browser.addCommand('moveTo', function (element) {
			logger.debug('Dragging to find element \'' + element + '\'.');
			if ($(element).isExisting())
				$(element).moveTo();
			else
				throw Error('The given element: \'' + element + '\' is not present to do scroll');

		}, true);

		/**
		 * Este método realiza un scroll hasta mostrar en pantlalla el elemento pasado por parametro
		 * @param element El elemento sobre el que se realiza la acción.(Puede ser un xpath, css o el elementID)
		 * @param top En caso de ser 'true' posicionará el elemento en la parte superior de la pantalla. Con 'false' posicionará el elemento en la parte inferior.
		 * @param timeOut Contiene el tiempo(segundos) de espera al elemento. Por defecto contiene 10 segundos
		*/
		browser.addCommand('scrollIntoView', function (element, top = false, timeOut = 10) {
			logger.debug('Scrolling into view to find element \'' + element + '\'.');
			if ($(element).waitForExist(timeOut * 1000))
				$(element).scrollIntoView(top);
			else
				throw Error('The given element: \'' + element + '\' is not present to do scroll');
		}, true);
	}
	return browser;
}

module.exports = { init };