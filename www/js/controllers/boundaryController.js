
angular.module('mTrail').controller('BoundaryController', ['$scope',
                                                          'leafletData',
                                                          '$state',
                                                          '$stateParams',
                                                          '$http',
                                                          '$ionicLoading',
                                                          'Tiles',
                                                          '$ionicModal',
  function ($scope, leafletData, $state, $stateParams, $http, $ionicLoading, Tiles, $ionicModal) {

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
    tiles: $stateParams.tiles || Tiles.getTiles('Outdoors'),
    center: {
      lat: 29.59599854794921,
      lng: -82.24021911621094,
      zoom: 13
    }
  });

  /**
   *  Format boundary description for modal
   */
  $scope.formatBoundaryDescription = function() {
      if($scope.boundary.properties.DESC2 !== 'ZZ'){
          $scope.boundary.description = $scope.boundary.properties.DESC1 + $scope.boundary.properties.DESC2;
      } else if ($scope.boundary.properties.DESC1 !== 'ZZ'){
          $scope.boundary.description = $scope.boundary.properties.DESC1;
      } else {
          $scope.boundary.description = 'No description available. ';
      }
  }

  /**
   *  Retrieve boundary map and set $scope.map to further extend
   */
  leafletData.getMap('boundary').then(function(map) {
      $scope.map = map;
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
          fillColor: Tiles.getColor($scope.tiles.name),
          weight: 2,
          opacity: 0.5,
          color: Tiles.getColor($scope.tiles.name),
          dashArray: '1',
          fillOpacity: 0.1
        },
        onEachFeature: function (feature, layer) {
          var poly = L.geoJson(feature);
          $scope.center = poly.getBounds().getCenter();
          $scope.center.zoom = 13;
          //make clickable - open modal
          layer.on('click', function (e) {
            $scope.openModalInfo();
          });
        }
      }
    });
    // format boundary info
    $scope.boundary = data;
    $scope.formatBoundaryDescription();
    $ionicLoading.hide();
  });

  /**
   *  Change Tile settings
   */
   $scope.changeTiles = function (tile) {
     $scope.tiles = Tiles.getTiles(tile);
     $scope.geojson.style.color = Tiles.getColor($scope.tiles.name);
     $scope.geojson.style.fillColor = Tiles.getColor($scope.tiles.name);
     $scope.closeModalSettings();
   };

   /**
    *  Find Current Tile - Modal functionality
    */
   $scope.isCurrentTile = function (tile) {
     if ($scope.tiles.name === tile) {
       return true;
     } else {
       return false;
     }
   };

   /**
    *  Initialize Settings Modal
    */
   $ionicModal.fromTemplateUrl('templates/settings.html', {
       scope: $scope,
       animation: 'slide-in-up'
    }).then(function(modal) {
       $scope.modalSettings = modal;
    });

    /**
     *  Open Settings Modal
     */
    $scope.openModalSettings = function() {
      $scope.modalSettings.show();
    };

    /**
     *  Close Settings Modal
     */
    $scope.closeModalSettings = function() {
      $scope.modalSettings.hide();
    };

    /**
     *  Initialize Property Info Modal
     */
    $ionicModal.fromTemplateUrl('templates/boundary-info.html', {
        scope: $scope,
        animation: 'slide-in-up'
     }).then(function(modal) {
        $scope.modalInfo = modal;
     });

     /**
      *  Open Info Modal
      */
     $scope.openModalInfo = function() {
       $scope.directionsButton = true;
       $scope.modalInfo.show();
     };

     /**
      *  Close Info Modal
      */
     $scope.closeModalInfo = function() {
       $scope.modalInfo.hide();
     };

     /**
      *  Open default map application (Google Maps or Apple Maps)
      */
     $scope.getDirections = function() {
         $scope.closeModalInfo();
         launchnavigator.navigate([$scope.center.lat, $scope.center.lng]);
     };

     /**
      *  Back to main menu
      */
     $scope.goHome = function() {
       $scope.closeModalSettings();
       $state.go('menu');
     };

     /**
      *  Go to Property List
      */
     $scope.viewList = function() {
       $scope.closeModalSettings();
       $state.go('list');
     };

}]);
