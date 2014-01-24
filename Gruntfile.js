module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    //Read the package.json (optional)
    pkg: grunt.file.readJSON('package.json'),

    // Metadata.
    meta: {
      sassPath: 'templates/sass/',
      cssPath: 'app/assets/stylesheets/',
      coffeePath: 'templates/coffee/',
      jsPath: 'app/assets/javascripts/'
    },

    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> ',

    // Task configuration.
    compass: {
      dist: {
        expand: true,
        cwd: '<%= meta.sassPath %>',
        src: ['{,*/}*.sass', '{,*/}*.scss', '!_*.*'],
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

    coffeelint: {
      app: ['<%= meta.coffeePath %>*.coffee'],
      options: {
        'max_line_length': {
          'level': 'ignore'
        }
      }
    },

    shell: {
      csslint: {
        command: "compass csslint",
        options: {
          stdout: true
        }
      }
    },

    watch: {
      scripts: {
        files: [
          '<%= meta.sassPath %>/**/*.sass',
          '<%= meta.coffeePath %>/**/*.coffee'
        ],
        tasks: ['coffeelint', 'compass', 'coffee']
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');
 
  // Default task.
  grunt.registerTask('default', ['coffeelint', 'shell:csslint', 'coffee']);
 
}
