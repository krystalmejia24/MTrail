angular.module('mTrail').factory('Tiles', function () {

  var customTiles = {
    Default: {
      name: 'Mapbox Default',
      url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
      type: 'xyz',
      options: {
        apikey: 'pk.eyJ1IjoibWVhbmd1cmx6IiwiYSI6ImNpa2g1cnF4YjAxNGx2dGttcGFmcm5nc3MifQ.ftvskKymYXv1VfqJPU9tnQ',
        mapid: 'meangurlz.cd22205e'
      }
    },
    Satellite: {
      name: 'Mapbox Satellite',
      url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
      type: 'xyz',
      options: {
        apikey: 'pk.eyJ1IjoibWVhbmd1cmx6IiwiYSI6ImNpa2g1cnF4YjAxNGx2dGttcGFmcm5nc3MifQ.ftvskKymYXv1VfqJPU9tnQ',
        mapid: 'mapbox.satellite'
      }
    },
    Dark: {
      name: 'Mapbox Dark',
      url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
      type: 'xyz',
      options: {
        apikey: 'pk.eyJ1IjoibWVhbmd1cmx6IiwiYSI6ImNpa2g1cnF4YjAxNGx2dGttcGFmcm5nc3MifQ.ftvskKymYXv1VfqJPU9tnQ',
        mapid: 'mapbox.dark'
      }
    },
    Basic: {
      name: 'Mapbox Basic',
      url: 'http://api.mapbox.com/styles/v1/{user}/{mapid}/tiles/256/{z}/{x}/{y}?access_token={apikey}',
      type: 'xyz',
      options: {
        user: 'meangurlz',
        apikey: 'pk.eyJ1IjoibWVhbmd1cmx6IiwiYSI6ImNpa2g1cnF4YjAxNGx2dGttcGFmcm5nc3MifQ.ftvskKymYXv1VfqJPU9tnQ',
        mapid: 'cikh5ua2y005t97m65v647lkx'
      }
    },
    Outdoors: {
      name: 'Mapbox Outdoors',
      url: 'http://api.mapbox.com/styles/v1/{user}/{mapid}/tiles/256/{z}/{x}/{y}?access_token={apikey}',
      type: 'xyz',
      options: {
        user: 'meangurlz',
        apikey: 'pk.eyJ1IjoibWVhbmd1cmx6IiwiYSI6ImNpa2g1cnF4YjAxNGx2dGttcGFmcm5nc3MifQ.ftvskKymYXv1VfqJPU9tnQ',
        mapid: 'citr3xfde000e2isha34urz40'
      }
    }
  };

  var customColor = {
      'Mapbox Default': '#25602b',
      'Mapbox Dark': '#9BC152',
      'Mapbox Satellite': 'white',
      'Mapbox Outdoors': 'black',
      'Mapbox Basic': 'black',
  };

  var service = {};

  service.getTiles = function(tile){
    return customTiles[tile];
  };

  service.getColor = function(tile){
    return customColor[tile];
  };

  return service;
});
