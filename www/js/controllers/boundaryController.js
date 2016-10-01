
angular.module('mTrail').controller('BoundaryController', ['$scope',
                                                          'leafletData',
                                                          '$state',
                                                          '$stateParams',
                                                          '$http',
                                                          '$ionicLoading',
  function ($scope, leafletData, $state, $stateParams, $http, $ionicLoading) {

  /**
   *  Show loading indicator, styling based on platform
   */
  if (ionic.Platform.isIOS())
  {
    $ionicLoading.show({
      template: 'Loading Property <br><br><ion-spinner icon="ios"></ion-spinner>'
    });
  } else {
    $ionicLoading.show({
      template: 'Loading Property <br><br><ion-spinner icon="android"></ion-spinner>'
    });
  }

  /**
   *  Initialize Tiles
   */
   var tilesDict = {
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
     }
  };

  /**
   *  Initialize map w/ default params
   */
  angular.extend($scope, {
    tiles: tilesDict.Default,
    center: {
      lat: 29.59599854794921,
			lng: -82.24021911621094,
      zoom: 13
    }
  });

  /**
   *  Retrieve Boundaries (HTTP GET request)
   *  Draw Map, Update center
   *  TO DO: Update zoom
   *         Update boundary info view
   */
  $http.get("https://act-trailblazer.herokuapp.com/api/boundaries/" + $stateParams.boundaryId)
  .success(function(data, status) {
    angular.extend($scope, {
      geojson: {
        data: data,
        style: {
          fillColor: 'green',
          weight: 2,
          opacity: 0.5,
          color: 'black',
          dashArray: '1',
          fillOpacity: 0.1
        },
        onEachFeature: function (feature, layer) {
          var poly = L.geoJson(feature);
          $scope.center = poly.getBounds().getCenter();
          $scope.center.zoom = 13;
        }
      }
    });
    $scope.boundary = data;
    $ionicLoading.hide();
  });

}]);
