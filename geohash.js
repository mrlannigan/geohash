/**
 * Copyright (c) 2014, Julian Lannigan.
 * Copyright (c) 2011, Sun Ning.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

;(function () {

  /** Semantic version number */
  var version = '1.0.0';

  /** Used as a reference to the global object */
  var root = (objectTypes[typeof window] && window) || this;

  /** Detect free variable `exports` */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module` */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }

  /** Detect the popular CommonJS extension `module.exports` */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /** Main geohash object */
  var geohash = {};

  var BASE32_CODES = "0123456789bcdefghjkmnpqrstuvwxyz";
  var BASE32_CODES_DICT = {};
  for(var i=0; i<BASE32_CODES.length; i++) {
    BASE32_CODES_DICT[BASE32_CODES.charAt(i)]=i;
  }

  function encode (latitude, longitude, precision) {
    var chars = [],
      bits = 0,
      code,
      mid,
      islon = true,
      hash_value = 0,
      maxlat = 90, minlat = -90,
      maxlon = 180, minlon = -180;

    precision = precision || 9;

    while (chars.length < precision) {
      if (islon) {
        mid = (maxlon + minlon) / 2;
        if(longitude > mid) {
          hash_value = (hash_value << 1) + 1;
          minlon = mid;
        } else {
          hash_value = (hash_value << 1) + 0;
          maxlon = mid;
        }
      } else {
        mid = (maxlat + minlat) / 2;
        if (latitude > mid) {
          hash_value = (hash_value << 1) + 1;
          minlat = mid;
        } else {
          hash_value = (hash_value << 1) + 0;
          maxlat = mid;
        }
      }
      islon = !islon;

      bits++;
      if (bits == 5) {
        code = BASE32_CODES[hash_value];
        chars.push(code);
        bits = 0;
        hash_value = 0;
      } 
    }
    return chars.join('');
  }

  function decode_bbox (hash_string) {
    var islon = true,
      hash_value = 0,
      i = 0,
      l = hash_string.length,
      code,
      bits,
      bit,
      mid,
      maxlat = 90, minlat = -90,
      maxlon = 180, minlon = -180;

    for(; i < l; i++) {
      code = hash_string[i].toLowerCase();
      hash_value = BASE32_CODES_DICT[code];

      for (bits = 4; bits >= 0; bits--) {
        bit = (hash_value >> bits) & 1;
        if (islon) {
          mid = (maxlon + minlon) / 2;
          if (bit == 1) {
            minlon = mid;
          } else {
            maxlon = mid;
          }
        } else {
          mid = (maxlat + minlat) / 2;
          if (bit == 1) {
            minlat = mid;
          } else {
            maxlat = mid;
          }
        }
        islon = !islon;
      }
    }
    
    return [minlat, minlon, maxlat, maxlon];
  }

  function decode (hash_string) {
    var bbox = decode_bbox(hash_string),
      lat = (bbox[0] + bbox[2]) / 2,
      lon = (bbox[1] + bbox[3]) / 2,
      laterr = bbox[2] - lat,
      lonerr = bbox[3] - lon;

    return {
      lat: lat, 
      lon: lon, 
      error: {
        lat: laterr,
        lon: lonerr
      }
    };
  }

  /**
   * direction [lat, lon], i.e.
   * [1,0] - north
   * [1,1] - northeast
   * ...
   */
  function neighbor (hashstring, direction)  {
    var lonlat = decode(hashstring),
      neighbor_lat = lonlat.lat + direction[0] * lonlat.error.lat * 2,
      neighbor_lon = lonlat.lon + direction[1] * lonlat.error.lon * 2;

    return encode(neighbor_lat, neighbor_lon, hashstring.length);
  }

  geohash.VERSION = version;
  geohash.encode = encode;
  geohash.decode = decode;
  geohash.decode_bbox = decode_bbox;
  geohash.neighbor = neighbor;

  // some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose geohash to the global object even when an AMD loader is present in
    // case geohash is loaded with a RequireJS shim config.
    // See http://requirejs.org/docs/api.html#config-shim
    root.geohash = geohash;

    define('geohash', function() {
      return geohash;
    });
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports && freeModule) {
    // in Node.js or RingoJS
    if (moduleExports) {
      (freeModule.exports = geohash).geohash = geohash;
    }
    // in Narwhal or Rhino -require
    else {
      freeExports.geohash = geohash;
    }
  }
  else {
    // in a browser or Rhino
    root.geohash = geohash;
  }

}.call(this));
