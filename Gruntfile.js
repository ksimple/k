module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
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
                        src: ['kFundamental.js', 'kFundamental.d.ts', 'kFundamental.js.map'],
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
                        src: ['kLayouter.js', 'kLayouter.d.ts', 'kLayouter.js.map'],
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
            concat_fundamental: {
                files: ['<%= concat.fundamental.src %>'],
                tasks: ['concat:fundamental']
            },
            ts: {
                files: ['<%= ts.debug.src %>'],
                tasks: ['uglify:ship', 'jasmine:ship']
            },
            uglify: {
                files: ['<%= ts.debug.out %>'],
                tasks: ['ts:debug', 'jasmine:ship']
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
    });

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
