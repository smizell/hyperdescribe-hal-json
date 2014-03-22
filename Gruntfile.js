module.exports = function(grunt) {

  grunt.initConfig({
    coffee: {
      compile: {
        files: {
          'lib/describer.js': 'src/describer.litcoffee',
          'lib/builder.js': 'src/builder.litcoffee'
        }
      }
    },
    browserify: {
      dist: {
        files: {
          'dist/haljson.hyperdescribe.js': 'index.js',
        }
      }
    },
    uglify: {
      my_target: {
        files: {
          'dist/haljson.hyperdescribe.min.js': 'dist/haljson.hyperdescribe.js'
        }
      }
    },
    docco: {
      options: {
        layout : "linear",
        output : "docs/"
      },
      all: {
        files: {
          src: ['src/**/*.litcoffee']
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-docco-multi');

  // Custom task to parse hal doc
  grunt.registerTask('describeExample', 'Describe example', function() {
    var halDoc = require('./examples/hal_example'),
        parser = require('./lib/describer')
        results = parser(halDoc);
    grunt.log.writeln('Describe hal example');
    grunt.file.write('./examples/haljson.hyperdescribe.json', JSON.stringify(results, null, 2));
  });

  // Custom task to build HAL doc
  grunt.registerTask('buildExample', 'Describe example', function() {
    var hd = require('./examples/source.hyperdescribe'),
        builder = require('./lib/builder')
        results = builder(hd);
    grunt.log.writeln('Build HAL');
    grunt.file.write('./examples/built.hal.json', JSON.stringify(results, null, 2));
  });

  grunt.registerTask( "build", ["coffee", "browserify", "uglify", "buildExample", "docco"] );
}