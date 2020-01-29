'use strict';

let logger = require('./Utils/logger');

let BrowserManager = class BrowserManager {

	/**
	   * Este metodo realiza un debug sobre la siguiente linea que se ejecute
	   *
	   */
	debug() {
		browser.debug();
	}

	/**
	   * Este metodo realiza para obtener la url actual del navegador
	   *
	   * @returns Devuelve la url actual en la que se encuentra
	   */
	getUrl() {
		logger.debug('Getting url: ' + browser.getUrl());
		return browser.getUrl();
	}

	/**
	   * Este metodo realiza la acción de navegar a la url que se le pasa por
	   * parametro
	   *
	   * @param url Es la url a la que se quiere navegar.
	   * @returns Devuelve la url actual en la que se encuentra
	   */
	navigateTo(url) {
		logger.debug('Navigating to ' + url + '...');
		return browser.url(url);
	}

	/**
	   * Refresca la ventana que se está mostrando actualmente.
	   *
	   */
	refresh() {
		logger.debug('Refreshing browser...');
		return browser.refresh();
	}

	/**
	   * Pulsar el botón Forward del navegador.
	   *
	   */
	forwardButton() {
		logger.debug('Pushing on forward button...');
		return driver.forward();
	}

	/**
	   * Pulsar el botón Backward en el navegador.
	   *
	   */
	backButton() {
		logger.debug('Pushing on back button...');
		return browser.back();
	}

	/**
	   * Devuelve el título de la página que está actualmente en el navegador.
	   *
	   * @return String con el título de la págian que está en el navegador.
	   */
	getTitle() {
		logger.debug('Getting browser title...');
		return browser.getTitle();
	}

	/**
	   * Borra todas las cookies del navegador.
	   *
	   */
	deleteCookies() {
		logger.debug('Deleting cookies...');
		return browser.deleteCookies();
	}

	/**
	   * Maximiza la ventana del navegador.
	   *
	   */
	maximize() {
		logger.debug('Maximizing windows...');
		return browser.maximizeWindow();
	}

	/**
	   * Entra en el modo pantalla completa del navegador.
	   *
	   */
	fullScreen() {
		return browser.fullscreenWindow();
	}

	/**
	   * Obtiene el tamaño de la ventana del navegador en la pantalla.
	   *
	   * @return Objeto Dimension con el tamaño de la pantalla.
	   */
	getSize() {
		return getWindowRect();
	}

	/**
	   * Hace un cambio de pestaña en el navegador
	   *
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
	   */
	alertCancel() {
		logger.debug('Canceling alert...');
		browser.dismissAlert();
	}
};

module.exports = new BrowserManager();
