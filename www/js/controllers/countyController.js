angular.module('mTrail').controller('CountyController', ['$scope',
                                                        'leafletData',
                                                        '$http',
                                                        '$state',
                                                        '$stateParams',
                                                        '$ionicLoading',
  function ($scope, leafletData, $http, $state, $stateParams, $ionicLoading) {

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
   *  Initialize Map
   */
  angular.extend($scope, {
    tiles: tilesDict.Default,
    center: {
      lat: 29.6520,
			lng: -82.3250,
      zoom: 13
    },
  });

  /**
   *  Retrieve Boundaries - HTTP GET request
   */
  $http.get("https://act-trailblazer.herokuapp.com/api/boundaries")
  .success(function(data, status) {
    angular.extend($scope, {
      geojson: {
        data: data,
        style: {
          fillColor: '#9BC152',
          weight: 2,
          opacity: 0.5,
          color: 'black',
          dashArray: '1',
          fillOpacity: 0.1
        },
        onEachFeature: function (feature, layer) {
          layer.on('click', function (e) {
            $state.go('boundary', {'boundaryId': feature._id});
          });
        }
      }
    });

    $scope.boundaries = data;
    $ionicLoading.hide();
  });

}]);
