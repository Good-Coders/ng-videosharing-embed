'use strict';

module.exports = function (grunt) {
	var karma = require('karma');

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		datetime: Date.now(),

		less: {
			options: {
				relativeUrls: true
			},
			module: {
				files: [
					{
						expand: true,
						cwd: 'src/styles/less',
						src: '*.less',
						dest: 'temp/styles/',
						ext: '.css'
					}
				]
			}
		},

		copy: {
			css: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: 'temp/styles',
						dest: 'build',
						src: '*.css'
					}
				]
			}
		},

		concat: {
			'module': {
				src: 'temp/scripts/ngmin/**/*.js',
				dest: 'temp/scripts/ng-videosharing-embed.js'
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= pkg.description %> - ' +
				'built <%= grunt.template.today("yyyy-mm-dd") %> - License <%= pkg.license %> (http://www.opensource.org/licenses/<%= pkg.license %>) */\n',
				mangle: {toplevel: true},
				squeeze: {dead_code: false},
				codegen: {quote_keys: true}
			},
			'module': {
				src: 'temp/scripts/ng-videosharing-embed.js',
				dest: 'build/ng-videosharing-embed.min.js'
			}
		},

		// Allow the use of non-minsafe AngularJS files. Automatically makes it
		// minsafe compatible so Uglify does not destroy the ng references
		ngmin: {
			module: {
				files: [
					{
						expand: true,
						cwd: 'src',
						src: ['**/*.js'],
						dest: 'temp/scripts/ngmin'
					}
				]
			}
		},
		karma: {
			unit: {
				configFile: 'config/karma.conf.js'
			},
			unitc9: {
				configFile: 'config/karma.conf.c9.js'
			}
		}
	});

	// Default task.
	grunt.registerTask('default', ['less:module','copy:css','ngmin:module','concat:module', 'uglify:module']);
	grunt.registerTask('test', ['karma:unit']);
	grunt.registerTask('test-c9', ['karma:unitc9']);
};