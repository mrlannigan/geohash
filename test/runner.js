var path = require('path'),
  assert = require('assert'),
  blanket = require('blanket')();

function clearGeohashCache() {
  delete require.cache[path.normalize(__dirname + '/../geohash.js')];
}

require('./geohash_test');

describe('AMD module', function() {
  before(function() {
    clearGeohashCache();
  });

  it('should be setup as a AMD module', function() {
    global.define = function (moduleName, module) {
      var root = {};

      assert.equal(moduleName, 'geohash');
      assert.equal(typeof module(), 'object');
    }
    global.define.amd = {};

    require('../geohash');
  });

  after(function() {
    delete global.define;
  });
});
