// Ionic mTrail App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'mTrail' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('mTrail', ['ionic', 'leaflet-directive', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  //States go here
  .state('menu', {
    url: '/',
    templateUrl: 'templates/menu.html',
    controller: 'MenuController'
  })
  .state('list', {
    url: '/list',
    templateUrl: 'templates/list.html',
    controller: 'MenuController',
  })
  .state('county', {
    url: '/county',
    templateUrl: 'templates/county.html',
    controller: 'CountyController',
  })
  .state('boundary', {
    url: '/boundary',
    templateUrl: 'templates/boundary.html',
    controller: 'BoundaryController',
    params: {
          boundaryId: Number
    },
  });

  $urlRouterProvider.otherwise("/");

})

.service('Tiles', function () {
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

  this.getTiles = function(){
    return customTiles;
  };
  
});
