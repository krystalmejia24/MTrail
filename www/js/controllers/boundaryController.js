
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
   *  Custom style settings for the maps
   */
  $scope.setStyle = function() {
      return {
          fillColor: Tiles.getColor($scope.tiles.name),
          weight: 2,
          opacity: 0.5,
          color: Tiles.getColor($scope.tiles.name),
          dashArray: '1',
          fillOpacity: 0.01
      }
  };

  /**
   *  Draw Icons on map
   */
  $scope.drawIcons = function() {
      var headIcon = L.Icon.Default.extend({
         options: {
            iconUrl: 'img/icons/black/head.svg',
             shadowSize: [0, 0]
         }
      });

      var parkingIcon = L.Icon.Default.extend({
         options: {
            iconUrl: 'img/icons/black/parking.svg',
             shadowSize: [0, 0]
         }
      });

      for (var i = 0; i < $scope.icons.length; i++) {
          var location = L.latLng($scope.icons[i].geometry.coordinates[1], $scope.icons[i].geometry.coordinates[0]);

          if ($scope.icons[i].properties.Name === 'parking') {
              var icon = new parkingIcon();
              L.marker(location, {icon: icon}).addTo($scope.map);
          }

          if ($scope.icons[i].properties.Name === 'head') {
              var icon = new headIcon();
              L.marker(location, {icon: icon}).addTo($scope.map);
          }
      }

  };

  /**
   *  Draw Boundary on Map
   */
   $scope.drawBoundary = function() {
       $scope.boundary = $stateParams.boundary;
       $scope.geoLayer = L.geoJson($scope.boundary, {
          style: $scope.setStyle,
          onEachFeature: function (feature, layer) {
              var poly = L.geoJson(feature);
              $scope.center = poly.getBounds().getCenter();
              $scope.center.zoom = 13;
          }
      }).addTo($scope.map);

      // format boundary info
      $scope.formatBoundaryDescription();
      $scope.drawIcons();
      $ionicLoading.hide();
    };

  /**
   *  Retrieve Trails (HTTP GET request)
   */
   $http.get("https://act-trailblazer.herokuapp.com/api/trails")
   .success(function(data, status) {
      $scope.trails = [];
      $scope.icons = [];
      for (var i = 0; i < data.length; i++) {
           if(data[i].properties.boundary === $stateParams.boundary.properties.MANAME && data[i].properties.color != 'null') {
              $scope.trails.push(data[i]);
          } else if (data[i].properties.boundary === $stateParams.boundary.properties.MANAME) {
              $scope.icons.push(data[i]);
          }
       }
       L.geoJson($scope.trails, {
         style: function(feature){
              return {
                  color: feature.properties.color,
                  weight : 2,
                  dashArray: '3'
              };
         }
      }).addTo($scope.map);
     $scope.drawBoundary();
     });

  /**
   *  Change Tile settings
   */
   $scope.changeTiles = function (tile) {
     $scope.tiles = Tiles.getTiles(tile);
     $scope.geoLayer.setStyle($scope.setStyle);
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
