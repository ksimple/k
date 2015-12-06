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
                dest: 'intermediate/fundamental.ts'
            },
        },
        copy: {
            fundamental: {
                files: [
                    {
                        expand: false,
                        src: ['intermediate/fundamental.js'],
                        dest: 'build/fundamental.js',
                        filter: 'isFile'
                    }],
            },
        },
        ts: {
            fundamental: {
                src: ['inc/jquery.d.ts', 'intermediate/fundamental.ts'],
                // out: 'build/fundamental.js',
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
                    'build/fundamental.min.js': ['build/fundamental.js'],
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
                src: 'build/fundamental.min.js',
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

    grunt.registerTask('debug', ['concat:fundamental', 'ts:fundamental', 'copy:fundamental']);
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
