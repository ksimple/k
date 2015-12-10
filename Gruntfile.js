module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    var config = {
        pkg: grunt.file.readJSON('package.json'),
        srcFiles: [
            'src/*.ts',
        ],
        concat: {
            fundamental: {
                src: [
                    'src/fundamental/head.p.ts',
                    'src/fundamental/IDisposable.p.ts',
                    'src/fundamental/ErrorUtil.p.ts',
                    'src/fundamental/Disposer.p.ts',
                    'src/fundamental/CssTextBuilder.p.ts',
                    'src/fundamental/DynamicStylesheet.p.ts',
                    'src/fundamental/tail.p.ts',
                ],
                dest: 'intermediate/kFundamental.ts'
            },
            layouter: {
                src: [
                    'src/layouter/head.p.ts',
                    'src/layouter/Stack.p.ts',
                    'src/layouter/Layouter.p.ts',
                    'src/layouter/tail.p.ts',
                ],
                dest: 'intermediate/kLayouter.ts'
            },
        },
        copy: {
            fundamental: {
                files: [
                    {
                        expand: true,
                        cwd: 'intermediate/',
                        src: ['kFundamental.ts', 'kFundamental.js', 'kFundamental.d.ts', 'kFundamental.js.map'],
                        dest: 'build/',
                        flatten: true,
                        filter: 'isFile'
                    }],
            },
            layouter: {
                files: [
                    {
                        expand: true,
                        cwd: 'intermediate/',
                        src: ['kLayouter.ts', 'kLayouter.js', 'kLayouter.d.ts', 'kLayouter.js.map'],
                        dest: 'build/',
                        flatten: true,
                        filter: 'isFile'
                    }],
            },
        },
        ts: {
            fundamental: {
                src: ['inc/jquery.d.ts', 'intermediate/kFundamental.ts'],
                // out: 'build/fundamental.js',
                options: {
                    target: 'es5',
                    declaration: true,
                    removeComments: false,
                    module: 'amd',
                },
            },
            layouter: {
                src: ['inc/jquery.d.ts', 'intermediate/kLayouter.ts'],
                // out: 'build/layouter.js',
                options: {
                    target: 'es5',
                    declaration: true,
                    removeComments: false,
                    module: 'amd',
                },
            },
        },
        bower: {
            install: {
                options: {
                    targetDir: 'lib/bower',
                }
            },
        },
        uglify: {
            ship: {
                files: {
                    'build/kFundamental.min.js': ['build/kFundamental.js'],
                    'build/kLayouter.min.js': ['build/kLayouter.js'],
                },
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
            configFiles: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            },
            test_debug: {
                files: ['<%= jasmine.debug.options.specs %>'],
                tasks: ['jasmine:debug'],
            },
            test_ship: {
                files: ['<%= jasmine.ship.options.specs %>'],
                tasks: ['jasmine:ship'],
            },
        },
    };

    for (var i in config.concat) {
        config.watch['concat_' + i] = {
            files: config.concat[i].src,
            tasks: ['concat:' + i],
        };
    }
    for (var i in config.ts) {
        config.watch['ts_' + i] = {
            files: config.ts[i].src,
            tasks: ['ts:' + i],
        };
    }
    for (var i in config.copy) {
        var files = config.copy[i].files[0].src.slice();

        for (var j = 0; j < files.length; j++) {
            files[j] = 'intermediate/' + files[j];
        }
        config.watch['copy_' + i] = {
            files: files,
            tasks: ['copy:' + i],
        };
    }

    var uglifyFiles = []
    for (var i in config.uglify.ship.files) {
        uglifyFiles.push(config.uglify.ship.files[i][0]);
    }

    config.watch['uglify'] = {
        files: uglifyFiles,
        tasks: ['uglify:ship'],
    };


    // console.log(JSON.stringify(config, null, 2));
    grunt.initConfig(config);
    grunt.registerTask('debug', ['concat:*', 'ts:*', 'copy:*']);
    grunt.registerTask('ship', ['debug', 'uglify:ship']);
    grunt.registerTask('build', ['debug', 'ship']);
    grunt.registerTask('test', ['jasmine:debug', 'jasmine:ship']);
    grunt.registerTask('demo', ['bower']);
    grunt.registerTask('all', ['build', 'test', 'demo']);

    // Default task(s).
    grunt.registerTask('default', 'No default task', function() {
        grunt.log.write('The old default task has been moved to "build" to prevent accidental triggering');
    });
};
