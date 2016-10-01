
angular.module('mTrail').controller('BoundaryController', ['$scope',
                                                          'leafletData',
                                                          '$state',
                                                          '$stateParams',
                                                          '$http',
                                                          '$ionicLoading',
                                                          'Tiles',
  function ($scope, leafletData, $state, $stateParams, $http, $ionicLoading, Tiles) {

  /**
   *  Show loading indicator, styling based on platform
   */
  if (ionic.Platform.isIOS()) {
    $ionicLoading.show({
      template: 'Loading Property <br><br><ion-spinner icon="ios"></ion-spinner>'
    });
  } else {
    $ionicLoading.show({
      template: 'Loading Property <br><br><ion-spinner icon="android"></ion-spinner>'
    });
  }

  /**
   *  Initialize map w/ default params
   */
  angular.extend($scope, {
    tiles: Tiles.getTiles().Outdoors,
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
