var now = new Date().toISOString();

function shallowCopy(obj) {
	var result = {};
	Object.keys(obj).forEach(function(key) {
		result[key] = obj[key];
	});
	return result;
}

var travisTag = process.env["TRAVIS_TAG"];

module.exports = function(grunt) {
	var path = require("path");

	grunt.initConfig({
		shell: {
			options: {
				stdout: true,
				stderr: true,
				failOnError: true
			},

			build_package: {
				command: "npm pack",
			},

			travis_publish: {
				command: [
				'git tag -a <%= versionTag %> -m "karma-nativescript-launcher v<%= versionTag %>" remotes/origin/master',
				'git push origin <%= versionTag %>'
				].join('&&')
			}
		},
	});

	grunt.loadNpmTasks("grunt-shell");

	grunt.registerTask("set_package_version", function(version) {
		version = version || travisTag;		
		if (!version) {
			return;
		}

		var packageJson = grunt.file.readJSON("package.json");
		packageJson.version = version;
		grunt.file.write("package.json", JSON.stringify(packageJson, null, "  "));
	});

	grunt.registerTask("pack", [
		"set_package_version",
		"shell:build_package",
	]);

	grunt.registerTask("publish", function(versionTag) {
		grunt.config.set('versionTag', versionTag);
		grunt.task.run('shell:travis_publish');
	});

	grunt.registerTask("default", "pack");
};
