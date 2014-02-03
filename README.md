geohash
============

Geohash library for Node.js & Browser.

Usage
-----

### geohash.encode (latitude, longitude, precision=9)

Encode a pair of latitude and longitude into geohash. The third argument is
optional, you can specify a length of this hash string, which also affect on
the precision of the geohash.

### geohash.decode (hashstring)

Decode a hash string into pair of latitude and longitude. A javascript object
is returned with key `lat` and `lon`.

### geohash.neighbor (hashstring, direction)

Find neighbor of a geohash string in certain direction. Direction is a 
two-element array, i.e. [1,0] means north, [-1,-1] means southwest.

### geohash.decode_bbox (hashstring)

Decode hashstring into a bound box matches it. Data returned in a four-element
array: [minlat, minlon, maxlat, maxlon]

About Geohash
-------------

Check [Wikipedia](http://en.wikipedia.org/wiki/Geohash "Wiki page for geohash")
for more information.
    
