/*
Copyright 2015, Yahoo Inc. All rights reserved.
Code licensed under the MIT License.
See LICENSE.txt
*/

var glob = require('glob')
var rimraf = require('rimraf')
var async = require('async')
var yesno = require('yesno')

function makeGlobString (patterns) {
  return [prefix, patterns.join(','), '}'].join('')
}

function del (files, cb) {
  async.each(files, function (f, next) {
    console.log('Deleting', f)
    rimraf(f, next)
  }, function (err) {
    if (err) return cb(err)
    console.log('Complete.')
    cb()
  })
}

function run (patterns, dryrun, force, cb) {
  glob(makeGlobString(patterns), {}, function (err, files) {
    if (err) return cb(err)
    files.forEach(function (f) {
      console.log(f)
    })

    if (files.length === 0) {
      console.log('Couldn\'t find any matching files. Exiting.')
      return cb()

    }

    if (dryrun) {
      return cb()
    }

    console.log('\nThe files listed above will be deleted.')
    if (force) {
      return del(files, cb)
    }

    yesno.ask('Are you sure you want to \'rm -rf\' these files?', null, function (ok) {
      if (!ok) {
        console.log('\nLeaving files as-is. Exiting.')
        return cb()
      }
      del(files, cb)
    })
  })
}

module.exports = run

// holy moly vim was crapping out on this. keeping it down here where it's safe!
var prefix = '**/node_modules/*/{'
