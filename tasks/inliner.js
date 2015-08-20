/*
 * grunt-inliner
 * https://github.com/velomash/grunt-inliner
 *
 * Copyright (c) 2015 Adam Trimble
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var path = require('path');

  grunt.registerMultiTask('inliner', 'A utility to inline any file into any other.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', ',
      basePath: ''
    }),
    count = 0;

    // Iterate over all specified file groups.
    this.files.forEach(function(file, index, array) {
      // Concat specified files.
      var src = file.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        var injectElementRegex = /<inject\s*src=(['"])(.*)\1\s*>/gi,
          fileText = grunt.file.read(filepath);
        return fileText.replace(injectElementRegex, function(match, quoteType, svgPath, offset, original) {
          var svgAddress = path.join(__dirname, options.basePath, svgPath);
          if (grunt.file.exists(svgAddress)) {
            var fileText = grunt.file.read(svgAddress);
            count++;
            return fileText;
          } else {
            grunt.log.warn('Source file "' + svgPath + '" not found.');
            return original;
          }
        });
      });

      // Write the destination file.
      grunt.file.write(file.dest, src);

    });
    // Print a success message.
    grunt.log.writeln(count + ' files injected.');
  });

};

