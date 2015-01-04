
module.exports = function(grunt) {
    'use strict';
    var debug = !!grunt.option('debug');

    // measures the time each task takes
    require('time-grunt')(grunt);
    // autoload grunt tasks
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        banner: '/* Author: <%= pkg.authors %>, <%= grunt.template.today("yyyy-mm-dd") %> */\n',

        clean: {
            all: {
                src: [ 
                    'dist/**/*.html',
                    'dist/assets/**/*.*', 
                    'dist/css/**/*.css', 
                    'dist/js/**/*.js', 
                    'dist/fonts/**/*.*',  
                    'dist/img/**/*.*',
                    'dist/pic/**/*.*'
                ]
            },
            css: {
                src: [ 'dist/css/**/*.css' ]
            },
            js: {
                src: [ 'dist/js/**/*.js' ]
            },
            fonts: {
                src: [ 'dist/fonts/**/*.*' ]
            },
            html: {
                src: [ 'dist/**/*.html' ]
            },
            img: {
                src: [ 'dist/img/**/*.*' ]
            },
            pic: {
                src: [ 'dist/pic/**/*.*' ]
            },
            removeUnusedCss: {
                src: [ 'dist/css/**/*.css', '!dist/css/_.min.css' ]
            },
            removeUnusedJs: {
                //src: [ 'dist/js/*.js', '!dist/js/main.min.js', '!dist/js/vendor.min.js' ]
            }
        },

        copy: {
            main: {
                cwd: 'assets',
                src: [  'crossdomain.xml',
                        'CNAME'
                    ],
                dest: 'dist',
                expand: true, flatten: true, filter: 'isFile'
            },
            jsVendor: {
                cwd: 'assets/js',
                src: [  'vendor/html5shiv/dist/html5shiv.js',
                        'vendor/respond/dest/respond.min.js',
                        'vendor/ua/dist/ua.js',
                        'vendor/jquery.easing/js/jquery.easing.min.js'
                    ],
                dest: 'dist/assets/js/vendor',
                expand: true, flatten: true, filter: 'isFile'
            },
            css: {
                cwd: 'assets',
                src: [  'css/**/*.css' ],
                dest: 'dist/assets/css',
                expand: true, flatten: true, filter: 'isFile'
            },
            js: {
                cwd: 'assets',
                src: [  'js/**/*.js' ],
                dest: 'dist/assets/js',
                expand: true, flatten: true, filter: 'isFile'
            },
            fonts: {
                cwd: 'assets',
                src: [  'fonts/*.*' ],
                dest: 'dist/fonts',
                expand: true, flatten: true, filter: 'isFile'
            },
            img: {
                cwd: 'assets/img',
                src: [  '**/*.{png,jpg,gif,mpg,webm}', '!.src/*.*'],
                dest: 'dist/img',
                expand: true, flatten: false, filter: 'isFile'
            },
            pic: {
                cwd: 'assets/pic',
                src: [  '**/*.{png,jpg,gif,mpg,webm}'],
                dest: 'dist/pic',
                expand: true, flatten: false, filter: 'isFile'
            }

        },


        // STUFF TASKS
        stylus: {      
            options: {
                banner: '<%= banner %>',
                define: {
                    DEBUG: debug
                },
                use: [
                    function() {
                        return require('autoprefixer-stylus')('last 3 versions', 'ie 7', 'ie 8', 'ie 9');
                    }
                ]
            },

            main: {
                options: {
                    'include css': true,
                    'paths': ['assets/css/vendor/']
                },
                files: {
                    'dist/css/_.css': 'assets/styl/_.styl',
                    //'dist/css/_.ie.css': 'styl/_.ie.styl'
                }
            }
        },

        stencil: {
            development: {
                options: {
                    //env: grunt.file.readJSON('assets/json/stencil.json'), // @todo remove
                    partials: 'assets/partials',
                    templates: 'assets/templates',
                    dot_template_settings: { strip: false }
                },
                files: [{
                    expand: true,
                    cwd: 'assets/',
                    src: ['**/*.dot.html', '!partials/**/*.dot.html', '!templates/**/*.dot.html'],
                    dest: 'dist',
                    ext: '.html',
                    flatten: false
                }]
            },
            production: {
                options: {
                    //env: grunt.file.readJSON('assets/json/stencil.json'), // @todo remove
                    partials: 'assets/partials',
                    templates: 'assets/templates'
                },
                files: [{
                    expand: true,
                    cwd: 'assets/',
                    src: ['**/*.dot.html', '!partials/**/*.dot.html', '!templates/**/*.dot.html'],
                    dest: 'dist',
                    ext: '.html',
                    flatten: false
                }]
            }
        },

        devcode: {
            options: {
                html: true,        // html files parsing?
                js: false,          // javascript files parsing?
                css: false,         // css files parsing?
                clean: false,
                block: {
                    open: 'check', // open code block
                    close: 'endcheck' // close code block
                },
                dest: 'dist'
            },
            development: {           // settings for task used with 'devcode:development'
                options: {
                    source: 'dist',
                    dest: 'dist',
                    env: 'development'
                }
            },
            production: {             // settings for task used with 'devcode:production'
                options: {
                    source: 'dist',
                    dest: 'dist',
                    env: 'production'
                }
            }
        },

        imagemin: {
            development: {
                options: {
                    optimizationLevel: 2,
                    progressive: true,
                    interlaced: true
                },
                files: [{
                    expand: true,
                    cwd: 'assets/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'dist/img/'
                }]
            }
        },

        // COMPRESSORS
        cssmin: {
            main: {
                options: {
                    report: 'gzip'
                },
                files: {
                    'dist/css/_.min.css': [
                        'dist/assets/css/vendor/**/*.css',
                        'dist/assets/css/*.css',
                        'dist/css/_.css'
                    ]
                }
            }
        },
        uglify: {
            build: {
                options: {
                    mangle: false
                },
                files: {
                    'dist/js/main.min.js': [
                        'dist/assets/js/*.js', 
                        '!dist/assets/js/main.js', 
                        'dist/assets/js/main.js' 
                    ]
                }
            },
            vendor: {
                options: {
                    mangle: false
                },
                files: [{
                    src: [ // todo: перепроверить все ли подключено
                        /*
                         'vendor/jquery-modern/dist/jquery.min.js',
                         'vendor/bootstrap/dist/js/bootstrap.min.js',
                         'vendor/html5shiv/dist/html5shiv.js',
                         'vendor/respond/dest/respond.min.js',
                         */
                        'jquery.easing.min.js'
                    ].map(function( item ){
                        return 'dist/assets/js/vendor/' + item
                    }),
                    dest: 'dist/js/vendor.min.js'
            }]
            }
        },

        watch: {
            options: {
                livereload: true
            },
            html: {
                files: ['assets/**/*.html'],
                tasks: ['dohtml']
            },
            js: {
                files: ['assets/js/**/*.js'],
                //tasks: ['dojs']
            },
            fonts: {
                files: ['assets/fonts/**/*.*'],
                tasks: ['dofonts']
            },
            stylus: {
                files: 'assets/styl/**/*.styl',
                tasks: ['stylus:main', 'cssmin:main']
            },
            css: {
                files: ['assets/css/**/*.css'],
                tasks: ['docss']
            },
            img: {
                files: ['assets/img/**/*.jpg', 'assets/img/**/*.png', 'assets/img/**/*.gif', 'assets/img/**/*.mp4', 'assets/img/**/*.webm'],
                tasks: ['doimage']
            },
        },

        connect: {
            server: {
                options: {
                    port: 9001,
                    base: 'dist',
                    hostname: '*',
                    onCreateServer: function(server, connect, options) {
                        var io = require('socket.io').listen(server);
                        io.sockets.on('connection', function(socket) {
                            // do something with socket
                        });
                    }
                }
            }
        }

    });


    // BATCHES
    grunt.registerTask(
        'development',
        [ 'clean:all', 'docopy', 'stylus:main', 'cssmin:main'/*, 'clean:removeUnusedCss', 'autoprefixer', 'uglify:build', 'clean:removeUnusedJs'*/, 'stencil:development', 'devcode:development'/*, 'prettify'*/, 'copy:img'/*, 'jshint:development'*/, 'connect:server', 'watch' ]
    );

    grunt.registerTask(
        'production',
        [ 'clean:all', 'copy:main', 'docopy', 'stylus', 'cssmin', 'clean:removeUnusedCss'/*, 'autoprefixer', 'uglify', 'clean:removeUnusedJs'*/, 'stencil:production', 'devcode:production'/*, 'prettify', 'clean:img'*/, 'doimage'/*, 'jshint:production'*/ ]
    );

    grunt.registerTask(
        'docopy',
        [ /*'copy:jsVendor',*/ 'copy:css'/*, 'copy:js'*/, 'copy:fonts', 'copy:img' ]
    );

    grunt.registerTask(
        'dohtml',
        [ 'clean:html', 'stencil:development', 'devcode:development' ]
    );

    grunt.registerTask(
        'docss',
        [ 'clean:css', 'copy:css', 'stylus'/*, 'cssmin'*/, 'clean:removeUnusedCss' ]
    );

    grunt.registerTask(
        'dojs',
        [ 'clean:js', 'copy:js', 'uglify', 'clean:removeUnusedJs'/*, 'jshint:development'*/ ]
    );

    grunt.registerTask(
        'dofonts',
        [ 'clean:fonts', 'copy:fonts' ]
    );

    grunt.registerTask(
        'doimage',
        [ 'copy:img'/*, 'imagemin'*/ ]
    );

    return grunt.registerTask('default', ['development']);
};
