module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    var projects = {
        kFundamental: {
            debugHead: [
                'src/fundamental/head.p.ts',
                'src/debug.p.ts',
            ],
            shipHead: ['src/fundamental/head.p.ts'],
            tail: ['src/fundamental/tail.p.ts'],
            sources: [
                'src/fundamental/IDisposable.p.ts',
                'src/fundamental/ErrorUtil.p.ts',
                'src/fundamental/Disposer.p.ts',
                'src/fundamental/CssTextBuilder.p.ts',
                'src/fundamental/DynamicStylesheet.p.ts',
            ],
        },
        kLayouter: {
            debugHead: [
                'src/layouter/head.p.ts',
                'src/debug.p.ts',
            ],
            shipHead: ['src/layouter/head.p.ts'],
            tail: ['src/layouter/tail.p.ts'],
            sources: [
                'src/layouter/Stack.p.ts',
                'src/layouter/Layouter.p.ts',
            ],
        },
    };
    var config = {
        pkg: grunt.file.readJSON('package.json'),
        srcFiles: [
            'src/*.ts',
        ],
        bower: {
            install: {
                options: {
                    targetDir: 'lib/bower',
                }
            },
        },
        jasmine: {
            debug: {
                src: '<%= ts.debug.out %>',
                options: {
                    specs: 'test/*.spec.js',
                },
            },
            ship: {
                src: 'build/',
                options: {
                    specs: 'test/*.spec.js',
                },
            }
        },
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['bower'],
            },
            configFiles: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            },
            /*
            test_debug: {
                files: ['<%= jasmine.debug.options.specs %>'],
                tasks: ['jasmine:debug'],
            },
            test_ship: {
                files: ['<%= jasmine.ship.options.specs %>'],
                tasks: ['jasmine:ship'],
            },
            */
        },
    };

    config.concat = {};
    config.copy = {};
    config.ts = {};
    config.uglify = {
        ship: {
            files: {}
        }
    };
    var uglifyFiles = []

    for (var name in projects) {
        var src = [];

        for (var i in projects[name].debugHead) {
            src.push(projects[name].debugHead[i]);
        }
        for (var i in projects[name].sources) {
            src.push(projects[name].sources[i]);
        }
        for (var i in projects[name].tail) {
            src.push(projects[name].tail[i]);
        }
        config.concat[name + '_debug'] = {
            src: src,
            dest: 'intermediate/' + name + '.ts',
        };
        config.watch['concat_' + name + '_debug'] = {
            files: config.concat[name + '_debug'].src,
            tasks: ['concat:' + name + '_debug'],
        };

        config.ts[name + '_debug'] = {
            src: ['inc/jquery.d.ts', 'inc/jquery.migrate.d.ts', 'intermediate/' + name + '.ts'],
            options: {
                target: 'es5',
                declaration: true,
                removeComments: false,
                module: 'amd',
            },
        };
        config.watch['ts_' + name + '_debug'] = {
            files: config.ts[name + '_debug'].src,
            tasks: ['ts:' + name + '_debug'],
        };

        config.copy[name + '_debug'] = {
            files: [{
                expand: true,
                cwd: 'intermediate/',
                src: [name + '.ts', name + '.js', name + '.d.ts', name + '.js.map'],
                dest: 'build/',
                flatten: true,
                filter: 'isFile'
            }],
        };

        var copyFiles = config.copy[name + '_debug'].files[0].src.slice();

        for (var j = 0; j < copyFiles.length; j++) {
            copyFiles[j] = 'intermediate/' + copyFiles[j];
        }
        config.watch['copy_' + name + '_debug'] = {
            files: copyFiles,
            tasks: ['copy:' + name + '_debug'],
        };
    }

    for (var name in projects) {
        var src = [];

        for (var i in projects[name].shipHead) {
            src.push(projects[name].shipHead[i]);
        }
        for (var i in projects[name].sources) {
            src.push(projects[name].sources[i]);
        }
        for (var i in projects[name].tail) {
            src.push(projects[name].tail[i]);
        }
        config.concat[name + '_ship'] = {
            src: src,
            dest: 'intermediate/' + name + '.ship.ts',
        };
        config.watch['concat_' + name + '_ship'] = {
            files: config.concat[name + '_ship'].src,
            tasks: ['concat:' + name + '_ship'],
        };

        config.ts[name + '_ship'] = {
            src: ['inc/jquery.d.ts', 'inc/jquery.migrate.d.ts', 'intermediate/' + name + '.ship.ts'],
            options: {
                target: 'es5',
                declaration: true,
                removeComments: false,
                module: 'amd',
            },
        };
        config.watch['ts_' + name + '_ship'] = {
            files: config.ts[name + '_ship'].src,
            tasks: ['ts:' + name + '_ship'],
        };
        config.uglify.ship.files['build/' + name + '.min.js'] = ['intermediate/' + name + '.ship.js'];
        uglifyFiles.push('intermediate/' + name + '.ship.js');
    }

    config.watch['uglify'] = {
        files: uglifyFiles,
        tasks: ['uglify:ship'],
    };

    // console.log(JSON.stringify(config, null, 2));

    var debugTask = [];
    var shipTask = [];

    for (var name in projects) {
        debugTask.push('concat:' + name + '_debug');
        shipTask.push('concat:' + name + '_ship');
    }
    for (var name in projects) {
        debugTask.push('ts:' + name + '_debug');
        shipTask.push('ts:' + name + '_ship');
    }
    for (var name in projects) {
        debugTask.push('copy:' + name + '_debug');
    }

    shipTask.push('uglify:ship');

    grunt.initConfig(config);
    grunt.registerTask('debug', debugTask);
    grunt.registerTask('ship', shipTask);
    grunt.registerTask('build', ['debug', 'ship']);
    grunt.registerTask('test', ['jasmine:debug', 'jasmine:ship']);
    grunt.registerTask('demo', ['bower']);
    grunt.registerTask('all', ['build', 'test', 'demo']);

    // Default task(s).
    grunt.registerTask('default', 'No default task', function() {
        grunt.log.write('The old default task has been moved to "build" to prevent accidental triggering');
    });
};
