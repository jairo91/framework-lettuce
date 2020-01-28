const spawnSync = require('child_process').spawnSync;
const _ = require('lodash');
const logger = require('./Utils/logger');

class SfdxData {
	bulkUpsert(sObjectId, csvFile, externalId) {
		console.log("Inserting " + csvFile + " in " + sObjectId + " with id: " + externalId);
		this._execute(`sfdx force:data:bulk:upsert -s ${sObjectId} -f ${csvFile} -i ${externalId} -w 10`, this._out(),
			error => {
				console.error(`Bulk upsert over ${sObjectId} has failed\n${error.stderr}`);
			});
	}

	bulkDelete(sObjectId, csvFile) {
		console.log("Deleting " + csvFile + " in " + sObjectId);
		this._execute(`sfdx force:data:bulk:delete -s ${sObjectId} -f ${csvFile} -w 10`, this._out(),
			error => {
				console.error(`Bulk upsert over ${sObjectId} has failed\n${error.stderr}`);
			});
	}

	recordDelete(sObjectId, where) {
		this._execute(`sfdx force:data:record:delete -s ${sObjectId} -w "${where}"`, out => console.log(out), error => {
			console.error(`Record delete over ${sObjectId} has failed\n${error.stderr}`);
		})
	}

	soqlQuery(query, resultFormat) {
		let ret = '';
		logger.debug(query);
		this._execute(`sfdx force:data:soql:query --query "${query}" --resultformat ${resultFormat}`, out => ret = out, error => {
			console.error(`Soql query execute ${query} has failed\n${error.stderr}`);
		});
		logger.debug("Data founded: \n" + ret);
		return ret;
	}

	_execute(command, out, error) {
		let splitted = this._escape(command).split(' ');
		let cmd = _.head(splitted);
		let args = _.tail(splitted).map(value => this._unescape(value));

		if (cmd !== 'cmd' && cmd !== 'sh') {
			const patch = this._windowsPatch(cmd, args);
			cmd = patch.cmd;
			args = patch.args;
		}

		let result;
		result = spawnSync(cmd, args);

		if (out) {
			out(result.stdout ? result.stdout.toString() : '');
		}

		if ((result.error || result.status !== 0) && error) {
			error({ code: result.error, stderr: result.stderr ? result.stderr.toString() : '' });
		}

		return result;
	}

	_escape(string) {
		return _.replace(string, /".*"/, match => escape(match));
	}

	_unescape(string) {
		return _.replace(string, /%22.*%22/, match => {
			let res = unescape(match);
			return res.substr(1, res.length - 2);
		});
	}

	_windowsPatch(cmd, args) {
		if (this._isWin()) {
			return {
				cmd: 'cmd',
				args: ['/c', cmd].concat(args)
			};
		}

		return { cmd: cmd, args: args };
	}

	_isWin() {
		return process.env.OS && process.env.OS.indexOf('Windows') >= 0;
	}

	_out() {
		return out => {
			console.log(out);
			let cmd = out.match(/sfdx.*status.*/g);
			let batch = out.match(/Batch ID: \w*/g);
			if (cmd && batch && cmd.length > 0 && batch.length > 0) {
				let batchId = batch[0].substring(10);
				let command = cmd[0].replace('[<batchId>]', batchId);
				this._execute(command, out => {
					let failed = out.match(/state:.*Failed/g);
					if (failed && failed.length > 0) {
						console.log(command, out)
					}
				});
			}
		}
	}
}

module.exports = new SfdxData();
