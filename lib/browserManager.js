'use strict';

let logger = require('./Utils/logger');

let BrowserManager = class BrowserManager {

	/**
	   * Este metodo realiza un debug sobre la siguiente linea que se ejecute
	   *
	   * @author jairo
	   */
	debug() {
		browser.debug();
	}

	/**
	   * Este metodo realiza para obtener la url actual del navegador
	   *
	   * @author jairo
	   */
	getUrl() {
		logger.debug('Getting url: ' + browser.getUrl());
		return browser.getUrl();
	}

	/**
	   * Este metodo realiza la acción de navegar a la url que se le pasa por
	   * parametro
	   *
	   * @author jairo
	   * @param url Es la url a la que se quiere navegar.
	   */
	navigateTo(url) {
		logger.debug('Navigating to ' + url + '...');
		return browser.url(url);
	}

	/**
	   * Refresca la ventana que se está mostrando actualmente.
	   *
	   * @author Jairo
	   */
	refresh() {
		logger.debug('Refreshing browser...');
		return browser.refresh();
	}

	/**
	   * Pulsar el botón Forward del navegador.
	   *
	   * @author Jairo
	   */
	forwardButton() {
		logger.debug('Pushing on forward button...');
		return driver.forward();
	}

	/**
	   * Pulsar el botón Backward en el navegador.
	   *
	   * @author Jairo
	   */
	backButton() {
		logger.debug('Pushing on back button...');
		return browser.back();
	}

	/**
	   * Devuelve el título de la página que está actualmente en el navegador.
	   *
	   * @return String con el título de la págian que está en el navegador.
	   * @author Jairo
	   */
	getTitle() {
		logger.debug('Getting browser title...');
		return browser.getTitle();
	}

	/**
	   * Borra todas las cookies del navegador.
	   *
	   * @author Jairo
	   */
	deleteCookies() {
		logger.debug('Deleting cookies...');
		return browser.deleteCookies();
	}

	/**
	   * Maximiza la ventana del navegador.
	   *
	   * @author Jairo
	   */
	maximize() {
		logger.debug('Maximizing windows...');
		return browser.maximizeWindow();
	}

	/**
	   * Entra en el modo pantalla completa del navegador.
	   *
	   * @author Jairo
	   */
	fullScreen() {
		return browser.fullscreenWindow();
	}

	/**
	   * Obtiene el tamaño de la ventana del navegador en la pantalla.
	   *
	   * @return Objeto Dimension con el tamaño de la pantalla.
	   * @author Jairo
	   */
	getSize() {
		return getWindowRect();
	}

	/**
	   * Hace un cambio de pestaña en el navegador
	   *
	   * @author Jairo
	   */
	switchWindow() {
		logger.debug('Switching window...');
		let actualWindow = browser.getWindowHandle();
		let allWindows = browser.getWindowHandles();

		for (let i in allWindows) {
			if (allWindows[i] !== actualWindow) {
				browser.switchToWindow(allWindows[i]);
				logger.debug('Switched to ', browser.getWindowHandle().getTitle());
				break;
			}
		}
	}

	/**
	   * Realiza la acción de cerrar todas las pestañas menos una
	   *
	   * @author Jairo
	   */
	closeWindows() {
		while (browser.getWindowHandles().length > 1) {
			browser.closeWindow();
		}
	}

	/**
	   * Realiza la acción de cambiar de frame. Si se le pasa el selector del frame accederá al mismo. En caso
	   * de pasar null como parametro, volverá a la raiz del DOM.
	   * @param frame frame de la ventana a la que acceder
	   * @param timeOut Tiempo maximo para encontrar el elemento Frame
	   * 
	   * @author Jairo
	   */
	switchToFrame(frame = null, timeOut = 10) {
		logger.debug('Switching frame...');

		if (frame != null) {
			$(frame).waitForExist(timeOut * 1000);
			logger.debug('Switching to frame : ' + frame);
			browser.switchToFrame($(frame));
		}
		else
			browser.switchToFrame(frame);

		logger.debug('Switched to frame ', frame);
	}

	/**
	   * Realiza la acción de aceptar la alerta emergente
	   *
	   * @author Jairo
	   */
	alertAccept() {
		logger.debug('Accepting alert...');
		try {
			browser.acceptAlert();
		} catch (error) {
			logger.debug("Alert is not existing");
		}
	}

	/**
	   * Realiza la acción de cancelar la alerta emergente
	   *
	   * @author Jairo
	   */
	alertCancel() {
		logger.debug('Canceling alert...');
		browser.dismissAlert();
	}
};

module.exports = new BrowserManager();
