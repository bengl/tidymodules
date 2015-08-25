#!/usr/bin/env node

/*
Copyright 2015, Yahoo Inc. All rights reserved.
Code licensed under the MIT License.
See LICENSE.txt
*/

var patterns = 'README.md,README.txt,test,tests,.gitignore,.npmignore'
var argv = require('yargs').argv

if (argv.patterns) {
  patterns = argv.patterns
}

require('../index')((argv.patterns || patterns).split(','), argv.dryrun, argv.force, function (err) {
  if (err) {
    console.error(err.stack)
    process.exit(1)
    return
  }

  process.exit(0)
})
