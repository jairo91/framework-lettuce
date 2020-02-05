const defaultTimeoutInterval = process.env.DEBUG ? (60 * 60 * 500) : 9000000;
const { generate } = require('multiple-cucumber-html-reporter');
const cucumberJson = require('wdio-cucumberjs-json-reporter').default
const { removeSync } = require('fs-extra');
var path = require('path');
const sfdx = require('framework-lettuce/lib/sfdx');
var firstExecution = true;
let sfdxInitialization = true;

exports.config = {

	specs: [
		'./features/**/login.feature',
	],

	// Patterns to exclude.
	exclude: [

		// 'path/to/excluded/files'
	],

	//
	// ============
	// Capabilities
	// ============
	// Define your capabilities here. WebdriverIO can run multiple capabilities at the same
	// time. Depending on the number of capabilities, WebdriverIO launches several test
	// sessions. Within your capabilities you can overwrite the spec and exclude options in
	// order to group specific specs to a specific capability.
	//
	// First, you can define how many instances should be started at the same time. Let's
	// say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
	// set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
	// files and you set maxInstances to 10, all spec files will get tested at the same time
	// and 30 processes will get spawned. The property handles how many capabilities
	// from the same test should run tests.
	//
	maxInstances: 10,

	capabilities: [
		{
			browserName: 'chrome',
			'goog:chromeOptions': {
				args: ['--disable-notifications ', 'start-maximized', 'window-size=1920,1080']
			},
		},
	],

	// ===================
	// Test Configurations
	// ===================
	// Define all options that are relevant for the WebdriverIO instance here
	//
	// By default WebdriverIO commands are executed in a synchronous way using
	// the wdio-sync package. If you still want to run your tests in an async way
	// e.g. using promises you can set the sync option to false.
	sync: true,
	logLevel: 'silent',     // Level of logging verbosity: silent | verbose | command | data | result | error
	coloredLogs: true,      // Enables colors for log output.
	screenshotPath: './reports/errorShots/',   // Saves a screenshot to a given path if a command fails.
	//
	// Set a base URL in order to shorten url command calls. If your url parameter starts
	// with "/", then the base url gets prepended.
	baseUrl: 'http://localhost:8080',
	waitforTimeout: 100000,            // Default timeout for all waitFor* commands.
	connectionRetryTimeout: 90000,    // Default timeout in milliseconds for request  if Selenium Grid doesn't send response
	connectionRetryCount: 3,          // Default request retries count

	// Services take over a specific job you don't want to take care of. They enhance
	// your test setup with almost no effort. Unlike plugins, they don't add new
	// commands. Instead, they hook themselves up into the test process.

	services: ['selenium-standalone'],

	//services: ['selenium-standalone', 'phantomjs', 'appium'],
	//
	framework: 'cucumber',
	reporters: ['spec', 'cucumberjs-json'],
	// reporters: ['spec', 'allure', 'json-cucumber', 'cucumber', 'multiple-cucumber-html'],

	// If you are using Cucumber you need to specify the location of your step definitions.
	cucumberOpts: {
		require: ['./stepsDefinition/SalesForce_Services/*'],   // <string[]> (file/dir) require files before executing features
		backtrace: true,    // <boolean> show full backtrace for errors
		compiler: ['js:babel-core/register'], // <string[]> filetype:compiler used for processing required features
		failAmbiguousDefinitions: true,       // <boolean< Treat ambiguous definitions as errors
		dryRun: false,      // <boolean> invoke formatters without executing steps
		failFast: false,    // <boolean> abort the run on first failure
		ignoreUndefinedDefinitions: false,    // <boolean> Enable this config to treat undefined definitions as warnings
		name: [],           // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
		format: ['pretty'], // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
		colors: true,       // <boolean> disable colors in formatter output
		snippets: false,    // <boolean> hide step definition snippets for pending steps
		source: false,      // <boolean> hide source uris
		profile: [],        // <string[]> (name) specify the profile to use
		strict: true,       // <boolean> fail if there are any undefined or pending steps
		tagExpression: '@CloseCase_010', // <string> (expression) only execute the features or scenarios with tags matching the expression
		timeout: defaultTimeoutInterval,    // <number> timeout for step definitions
		tagsInTitle: false,                 // <boolean> add cucumber tags to feature or scenario name
		snippetSyntax: undefined,           // <string> specify a custom snippet syntax
	},

	// Visual Regression Service
	// http://webdriver.io/guide/services/visual-regression.html. http://webdriver.io/guide/services/visual-regression.html
	// visualRegression: {
	// 	compare: new VisualRegressionCompare.LocalCompare({
	// 		referenceName: getScreenshotName(path.join(process.cwd(), 'screenshots/reference')),
	// 		screenshotName: getScreenshotName(path.join(process.cwd(), 'screenshots/screen')),
	// 		diffName: getScreenshotName(path.join(process.cwd(), 'screenshots/diff')),
	// 		misMatchTolerance: 5,
	// 	}),
	// 	viewportChangePause: 300,
	// 	viewports: [{ width: 1024, height: 768 }],
	// 	orientations: ['landscape', 'portrait'],
	// },

	//
	// =====
	// Hooks
	// =====
	// WedriverIO provides several hooks you can use to interfere with the test process in order to enhance
	// it and to build services around it. You can either apply a single function or an array of
	// methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
	// resolved to continue.
	//
	// Gets executed before test execution begins. At this point you can access all global
	// variables, such as `browser`. It is the perfect place to define custom commands.

	/**
     * Gets executed once before all workers get launched.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
	onPrepare: function (config, capabilities) {
		if (firstExecution) {
			try {
				const execSync = require('child_process').execSync;
				execSync('rm -rf test/reports');
				console.log('Allure-report deleted', Date());
			} catch (error) {
				console.log("There are not report to delete")
			}
			console.log("Initialize sfdx : " + sfdxInitialization);
			if (sfdxInitialization)
				sfdx._execute("sfdx force:config:set defaultusername=egs --global", out => {
					if (out) {
						console.log(out);
					}
				});
			firstExecution = false;
		}
		removeSync('.tmp/');
	},
	/**
   * Gets executed after all workers have shut down and the process is about to exit.
   * An error thrown in the `onComplete` hook will result in the test run failing.
   * @param {Object} exitCode 0 - success, 1 - fail
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {<Object>} results object containing test results
   */
	onComplete: function (exitCode, config, capabilities, results) {
		// Generate the report when it all tests are done
		try {
			generate({
				// Required
				// This part needs to be the same path where you store the JSON files
				// default = '.tmp/json/'
				jsonDir: '.tmp/json/',
				reportPath: '.tmp/report/',
				// for more options see https://github.com/wswebcreation/multiple-cucumber-html-reporter#options
			});
		} catch (error) { }
	},

	/**
	* Gets executed before test execution begins. At this point you can access to all global
	* variables like `browser`. It is the perfect place to define custom commands.
	* @param {Array.<Object>} capabilities list of capabilities details
	* @param {Array.<String>} specs List of spec file paths that are to be run
	*/
	before: function (capabilities, specs) {
		require('../../lib/commands').init(browser, true);
	},


	/**
 	* Cucumber-specific hooks
 	*/
	// beforeFeature: function (uri, feature, scenarios) {
	// },
	beforeScenario: function (uri, feature, scenario, sourceLocation) {
		console.log('\n=======> SCENARIO : ' + scenario.name + "\n");
	},
	beforeStep: function (uri, feature, stepData, context) {
		console.log('\n=======> STEP : ', stepData.step.text + "\n");
	},
	// afterStep: function (uri, feature, { error, result, duration, passed }, stepData, context) {
	// },
	afterScenario: function (uri, feature, scenario, result, sourceLocation) {
		cucumberJson.attach(browser.takeScreenshot(), 'image/png');
	},
	// afterFeature: function (uri, feature, scenarios) {
	// }
};
