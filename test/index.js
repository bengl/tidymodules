/* global describe, it, beforeEach, afterEach  */
var path = require('path')
var tmpDir = path.join(require('os').tmpdir(), 'tidymodules_test')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')
var assert = require('assert')
var touch = require('touch')
var log = console.log
var exists = function (x) {
  return require('fs').existsSync(x)
}
var tidy = require('../index')

var asked = false
var answer = true

require('yesno').ask = function (q, r, cb) {
  asked = true
  cb(answer)
}

function touchp (p, cb) {
  mkdirp(path.join(tmpDir, path.dirname(p)), function (err) {
    if (err) return cb(err)
    touch(p, cb)
  })
}

function touchall (list, cb) {
  require('async').each(list, function (item, next) {
    touchp(item, next)
  }, cb)
}

function test (prefiles, postfiles, dryrun, force, asks, done) {
  console.log = function () {}
  touchall(prefiles, function (err) {
    if (err) return done(err)
    tidy(['README.md', 'test/'], dryrun, force, function (err) {
      if (err) return done(err)
      postfiles.forEach(exists)
      if (asks) {
        assert(asked)
      }
      console.log = log
      done()
    })
  })
}

describe('index', function () {

  beforeEach(function (done) {
    answer = true
    asked = false
    mkdirp(tmpDir, function () {
      process.chdir(tmpDir)
      done()
    })
  })

  afterEach(function (done) {
    process.chdir(__dirname)
    rimraf(tmpDir, done)
  })

  it('no matching files', function (done) {
    var files = [
      'node_modules/foo/package.json',
      'node_modules/bar/package.json'
    ]
    test(
      files,
      files,
      false,
      false,
      false,
      done
    )
  })

  it('good case', function (done) {
    var prefiles = [
      'node_modules/foo/README.md',
      'node_modules/bar/README.md',
      'node_modules/bar/index.js'
    ]
    var postfiles = [
      'node_modules/bar/index.js'
    ]
    test(
      prefiles,
      postfiles,
      false,
      false,
      true,
      done
    )
  })

  it('not sure', function (done) {
    var files = [
      'node_modules/foo/README.md',
      'node_modules/bar/README.md',
      'node_modules/bar/index.js'
    ]
    answer = false
    test(
      files,
      files,
      false,
      false,
      true,
      done
    )
  })

  it('dryrun', function (done) {
    var files = [
      'node_modules/foo/README.md',
      'node_modules/bar/README.md',
      'node_modules/bar/index.js'
    ]
    test(
      files,
      files,
      true,
      false,
      false,
      done
    )
  })

  it('force', function (done) {
    var prefiles = [
      'node_modules/foo/README.md',
      'node_modules/bar/README.md',
      'node_modules/bar/index.js'
    ]
    var postfiles = [
      'node_modules/bar/index.js'
    ]
    test(
      prefiles,
      postfiles,
      false,
      true,
      false,
      done
    )
  })

})
