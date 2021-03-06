const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const PATH = 'general/credentials/';
// const PATH = '';

let mailData = {};
// let mailData = {
// 	typeUser: `contactUser`,
// 	To: `usuario.gm.contact@gmail.com`,
// 	From: `jairo.mendez@grupoonetec.com`,
// 	Subject: `subject prueba `,
// 	Body: `body prueba `
// }

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly',
	'https://www.googleapis.com/auth/gmail.send'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
let TOKEN_PATH = `/token.json`;


let Email = {
	/**
	 * Create an OAuth2 client with the given credentials, and then execute the
	 * given callback function.
	 * @param {Object} credentials The authorization client credentials.
	 * @param {function} callback The callback to call with the authorized client.
	 */
	authorize: (credentials, callback) => {
		const { client_secret, client_id, redirect_uris } = credentials.installed;
		const oAuth2Client = new google.auth.OAuth2(
			client_id, client_secret, redirect_uris[0]);

		// Check if we have previously stored a token.

		TOKEN_PATH = `${PATH}${mailData.typeUser}${TOKEN_PATH}`;
		fs.readFile(TOKEN_PATH, (err, token) => {
			if (err) return Email.getNewToken(oAuth2Client, callback);
			oAuth2Client.setCredentials(JSON.parse(token));
			callback(oAuth2Client);
		});
	},

	/**
	 * Get and store new token after prompting for user authorization, and then
	 * execute the given callback with the authorized OAuth2 client.
	 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
	 * @param {getEventsCallback} callback The callback for the authorized client.
	 */
	getNewToken: (oAuth2Client, callback) => {
		const authUrl = oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES,
		});
		console.log('Authorize this app by visiting this url:', authUrl);
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		rl.question('Enter the code from that page here: ', (code) => {
			rl.close();
			oAuth2Client.getToken(code, (err, token) => {
				if (err) return console.error('Error retrieving access token', err);
				oAuth2Client.setCredentials(token);
				// Store the token to disk for later program executions
				fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
					if (err) return console.error(err);
					console.log('Token stored to', TOKEN_PATH);
				});
				callback(oAuth2Client);
			});
		});
	},


	makeBody: (to, from, subject, message) => {
		var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
			"MIME-Version: 1.0\n",
			"Content-Transfer-Encoding: 7bit\n",
			"to: ", to, "\n",
			"from: ", from, "\n",
			"subject: ", subject, "\n\n",
			message
		].join('');

		var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
		return encodedMail;
	},

	_sendMessage: (auth) => {
		var gmail = google.gmail('v1');
		var raw = Email.makeBody(mailData.To, mailData.From, mailData.Subject, mailData.Body);

		gmail.users.messages.send({
			auth: auth,
			userId: 'me',
			resource: {
				raw: raw
			}
		}, function (err, response) {
			console.log(err || response);
		});
	},

	sendMessage: (data) => {
		// Load client secrets from a local file.
		mailData = data;
		console.log(`PATH : ${PATH}${mailData.typeUser}/credentials.json`);
		fs.readFile(`${PATH}${mailData.typeUser}/credentials.json`, (err, content) => {
			if (err) return console.log('Error loading client secret file:', err);
			// Authorize a client with credentials, then call the Gmail API.

			Email.authorize(JSON.parse(content), Email._sendMessage);
		});
	}
}

module.exports = Email;

// fs.readFile(`credentials.json`, (err, content) => {
// 	if (err) return console.log('Error loading client secret file:', err);
// 	// Authorize a client with credentials, then call the Gmail API.

// 	Email.authorize(JSON.parse(content), Email._sendMessage);
// });