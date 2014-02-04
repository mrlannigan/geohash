var assert = require('assert'),
  geohash = require('../geohash');

var test_hashes = [
  {hash: 'dq9c0m0wjvtc', lat: 36.76680679433048, lon: -76.27713488414884},
  {hash: '9q59xbd8eupu', lat: 34.01652649976313, lon: -118.48394410684705},
  {hash: 'sr60kgfm1grf', lat: 40.846670838072896, lon: 14.27441580221057},
  {hash: 'rbsm15g1hgxc', lat: -41.28780369646847, lon: 174.77484209463},
  {hash: 'dks8', lat: 25.400390625, lon: -72.24609375},
  {hash: 'f280sd', lat: 47.91412353515625, lon: -78.5467529296875},
  {hash: 'y5', lat: 64.6875, lon: 95.625},
  {hash: 'g', lat: 67.5, lon: -22.5}
];

var test_bboxes = [
  {hash: 'dks8', bbox: [25.3125, -72.421875, 25.48828125, -72.0703125]},
  {hash: 'dq9c0m0wjvtc', bbox: [36.766806710511446, -76.2771350517869, 36.76680687814951, -76.27713471651077]}
];

var test_neighbors = [
  {
    hash: 'd9cw',
    neighbors: [
      {hash: 'd9cx', direction: 'north'},
      {hash: 'd9cz', direction: 'northeast'},
      {hash: 'd9cy', direction: 'east'},
      {hash: 'd9cv', direction: 'southeast'},
      {hash: 'd9ct', direction: 'south'},
      {hash: 'd9cm', direction: 'southwest'},
      {hash: 'd9cq', direction: 'west'},
      {hash: 'd9cr', direction: 'northwest'}
    ]
  }, {
    hash: '3kw23',
    neighbors: [
      {hash: '3kw29', direction: 'north'},
      {hash: '3kw2d', direction: 'northeast'},
      {hash: '3kw26', direction: 'east'},
      {hash: '3kw24', direction: 'southeast'},
      {hash: '3kw21', direction: 'south'},
      {hash: '3kw20', direction: 'southwest'},
      {hash: '3kw22', direction: 'west'},
      {hash: '3kw28', direction: 'northwest'}
    ]
  }
];

var DIRECTIONS = {
  'north': [1, 0],
  'northeast': [1, 1],
  'east': [0, 1],
  'southeast': [-1, 1],
  'south': [-1, 0],
  'southwest': [-1, -1],
  'west': [0, -1],
  'northwest': [1, -1]
};

describe('geohash', function() {
  describe('#encode()', function() {
    test_hashes.forEach(function (test) {
      it('should return ' + test.hash + ' when encoded', function() {
        assert.equal(geohash.encode(test.lat, test.lon, test.hash.length), test.hash);
      });
    });
  });

  describe('#decode()', function() {
    test_hashes.forEach(function (test) {
      it('hash ' + test.hash + ' should return ' + test.lat + ', ' + test.lon + ' when decoded', function() {
        var decode = geohash.decode(test.hash);
        assert.equal(decode.lat, test.lat);
        assert.equal(decode.lon, test.lon);
      });
    });
  });

  describe('#decode_bbox()', function() {
    test_bboxes.forEach(function (test) {
      it('should return correct bounding box of ' + test.hash + ' hash', function() {
         assert.deepEqual(geohash.decode_bbox(test.hash), test.bbox);
      });
    });
  });

  describe('#neighbor()', function() {
    test_neighbors.forEach(function (test) {
      describe('hash ' + test.hash, function() {
        test.neighbors.forEach(function (neighbor) {
          it('should return correct neighbor in direction of ' + neighbor.direction, function() {
            assert.equal(geohash.neighbor(test.hash, DIRECTIONS[neighbor.direction]), neighbor.hash);
          });
        });
      });
    });
  });
});