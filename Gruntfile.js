module.exports = function(grunt) {
 
    // Project configuration.
    grunt.initConfig({
 
        //Read the package.json (optional)
        pkg: grunt.file.readJSON('package.json'),
 
        // Metadata.
        meta: {
            sassPath: 'templates/sass/',
            cssPath: 'public/css/',
            coffeePath: 'templates/coffee/',
            jsPath: 'public/js/'
        },
 
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> ',
 
        // Task configuration.
        compass: {
            dist: {
                  expand: true,
                  cwd: '<%= meta.sassPath %>',
                  src: ['{,*/}*.sass'],
                  dest: '<%= meta.cssPath %>',
                  ext: '.css'
            }
        },

        coffee: {
            dist: {
                  expand: true,
                  cwd: '<%= meta.coffeePath %>',
                  src: ['{,*/}*.coffee'],
                  dest: '<%= meta.jsPath %>',
                  ext: '.js'
            }
        },
 
        watch: {
            scripts: {
                files: [
                    '<%= meta.sassPath %>/**/*.sass',
                    '<%= meta.coffeePath %>/**/*.coffee'
                ],
                tasks: ['compass', 'coffee']
            }
        }
 
    });
 
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-watch');
 
    // Default task.
    grunt.registerTask('default', ['compass', 'coffee']);
 
}
