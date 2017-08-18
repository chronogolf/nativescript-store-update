'use strict';

var fork = require('child_process').fork;
var which = require('shelljs').which;

var fs = require('fs');
var os = require('os');
var path = require('path');
var URL = require('url');
var util = require('util');

var TEST_RUNNER_DIR = path.join(__dirname, 'runner');

function getTnsCliExecutablePath() {
	var pathToTnsExecutable = which('tns');
	return path.join(path.dirname(pathToTnsExecutable), "nativescript.js");
}

function NativeScriptLauncher(baseBrowserDecorator, logger, config, args, emitter, executor) {
	var self = this;

	baseBrowserDecorator(self);
	self.log = logger.create('launcher');

	if (!args.platform) {
		self.log.error('No platform specified.');
		process.exit(1);
	}

	self.platform = args.platform;

	var launcherConfig = config._NS || {};

	emitter.on('browser_register', function(browser) {
		if (!browser.id || browser.id.indexOf('NativeScript') !== 0) {
			return;
		}

		self.markCaptured();

		executor.schedule();
	});

	function logDebugOutput(data) {
		process.stdout.write(data);
	}

	// Consider removing this in case we drop support for `tns dev-test` command
	self.liveSyncAndRun = function() {
		var tnsArgs = ['dev-test', self.platform, '--port', self.parsedUrl.port];
		if (args.arguments) {
			tnsArgs = tnsArgs.concat(args.arguments);
		}

		if (launcherConfig.log) {
			tnsArgs = tnsArgs.concat(['--log', launcherConfig.log]);
		}

		if (typeof launcherConfig.path !== 'undefined') {
			tnsArgs = tnsArgs.concat(['--path', launcherConfig.path]);
		}

		var tnsCli = launcherConfig.tns || getTnsCliExecutablePath();
		self.log.debug('Starting "' + tnsCli + '" ' + tnsArgs.join(' '));

		var runner = fork(tnsCli, tnsArgs);

		runner.on('message', function(data) {
			if (data === "ready") {
				// Child process is ready to read the data
				var optionsStr = JSON.stringify(launcherConfig.options);
				runner.send(optionsStr);
			}
		});

		runner.on('error', logDebugOutput);
		runner.on('data', logDebugOutput);
		runner.on('exit', function(code) {
			self.log.info('NativeScript deployment completed with code ' + code);
			if (code) {
				process.exit(code);
			}
		});
	}

	self.start = function(url) {
		self.parsedUrl = URL.parse(url);
		process.send({ url: self.parsedUrl, launcherConfig: JSON.stringify(launcherConfig.options) });
	}
}

NativeScriptLauncher.prototype = {
	name: 'NativeScript Unit Test Runner'
}

module.exports = {
  'launcher:NS': ['type', NativeScriptLauncher]
};
