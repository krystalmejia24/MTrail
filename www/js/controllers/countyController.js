angular.module('mTrail').controller('CountyController', ['$scope',
                                                        'leafletData',
                                                        '$http',
                                                        '$ionicHistory',
                                                        '$state',
                                                        '$stateParams',
                                                        '$ionicLoading',
                                                        '$ionicModal',
                                                        'Tiles',
  function ($scope, leafletData, $http, $ionicHistory, $state, $stateParams, $ionicLoading, $ionicModal, Tiles) {

  /**
   *  Show loading indicator, styling based on platform
   */
  if (ionic.Platform.isIOS()) {
    $ionicLoading.show({
      template: 'Loading Map <br><br><ion-spinner icon="ios"></ion-spinner>'
    });
  } else {
    $ionicLoading.show({
      template: 'Loading Map <br><br><ion-spinner icon="android"></ion-spinner>'
    });
  }

  /**
   *  Show indicator for finding location
   */
   $scope.locationIndicator = function (setting){
       if (ionic.Platform.isIOS() && setting === 'on') {
           $ionicLoading.show({
               template: 'Finding Current Location <br><br><ion-spinner icon="ios"></ion-spinner>'
           });
       } else if (ionic.Platform.isAndroid() && setting === 'on') {
           $ionicLoading.show({
               template: 'Finding Current Location <br><br><ion-spinner icon="android"></ion-spinner>'
           });
       } else if (setting === 'off'){
           $ionicLoading.hide();
       }
   }

  /**
   *  Initialize Map
   */
  angular.extend($scope, {
    tiles: Tiles.getTiles('Outdoors'),
    center: {
      lat: 29.6520,
      lng: -82.3250,
      zoom: 13
    },
  });

  /**
   *  Retrieve county map and set $scope.map to further extend
   */
  leafletData.getMap('county').then(function(map) {
      $scope.map = map;
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
          fillColor: 'black',
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
      },
      findUser: function(){
        $scope.locationIndicator('on');
        $scope.map.locate({ setView : true, maxZoon: 17});
        $scope.map.on('locationfound', $scope.addCustomLocationMarker);
      },
      addCustomLocationMarker: function(e) {
        // add radius circle marker
        if($scope.radiusCircle){
            $scope.map.removeLayer($scope.radiusCircle);
        }
        $scope.radiusCircle = L.circle(e.latlng, e.accuracy, {
            stroke: false,
            fillColor: '#3473e2',
            opacity: 0.2,
            fillOpacity: 0.2
        }).addTo($scope.map);

        // add outer circle marker
        if($scope.outerCircle){
            $scope.map.removeLayer($scope.outerCircle);
        }
        $scope.outerCircle = L.circleMarker(e.latlng, {
            fillColor: '#3473e2',
            opacity: 0.5,
            weight: 1,
            fillOpacity: 0.5
        }).setRadius(10).addTo($scope.map);

        // add inner circle marker
        if($scope.innerCircle){
            $scope.map.removeLayer($scope.innerCircle);
        }
        $scope.innerCircle = L.circleMarker(e.latlng, {
            fillColor: '#3473e2',
            color: 'white',
            opacity: 1,
            weight: 2,
            fillOpacity: 1
        }).setRadius(7).addTo($scope.map);

        // turn off location indicator
        $scope.locationIndicator('off');
      }
    });
    $scope.boundaries = data;
    $ionicLoading.hide();
  });

  /**
   *  Change Tile Settings - Modal functionality
   */
  $scope.changeTiles = function (tile) {
    $scope.tiles = Tiles.getTiles(tile);
    $scope.closeModalSettings();
  };

  /**
   *  Find Current Tile - Modal functionality
   */
  $scope.isCurrentTile = function (tileName) {
    if ($scope.tiles.name === tileName) {
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
    *  Back to main menu
    */
   $scope.goHome = function() {
     $scope.closeModalSettings();
     $state.go('menu');
   };

   /**
    *  Go To property list
    */
   $scope.viewList = function() {
     $scope.closeModalSettings();
     $state.go('list');
   };

}]);
