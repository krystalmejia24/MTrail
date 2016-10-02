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

  /**
   *  Change Tile Settings - Modal functionality
   */
  $scope.changeTiles = function (tile) {
    $scope.tiles = Tiles.getTiles(tile);
    $scope.closeModal();
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
   *  Initialize Modal
   */
  $ionicModal.fromTemplateUrl('templates/settings.html', {
      scope: $scope,
      animation: 'slide-in-up'
   }).then(function(modal) {
      $scope.modal = modal;
   });

   /**
    *  Open Modal
    */
   $scope.openModal = function() {
     $scope.modal.show();
   };

   /**
    *  Close Modal
    */
   $scope.closeModal = function() {
     $scope.modal.hide();
   };

   /**
    *  Back to main menu
    */
   $scope.goHome = function() {
     $state.go('menu');
   };

   /**
    *  Go Back
    */
   $scope.goBack = function() {
     $scope.closeModal();
     $ionicHistory.goBack(-1);
   };

}]);
