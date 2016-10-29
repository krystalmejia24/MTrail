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
            $scope.boundary = feature;
            $scope.openModalInfo();
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
    $scope.openModalInfo = function(feature) {
      $scope.formatBoundaryDescription();
      $scope.seeMoreButton = true;
      $scope.modalInfo.show();
    };

    /**
     *  Close Info Modal
     */
    $scope.closeModalInfo = function() {
      $scope.modalInfo.hide();
    };

    /**
     *  Initialize Filters Modal
     */
    $ionicModal.fromTemplateUrl('templates/filters.html', {
        scope: $scope,
        animation: 'slide-in-up'
     }).then(function(modal) {
        $scope.modalFilters = modal;
     });

     /**
      *  Open Filters Modal
      */
     $scope.openModalFilters = function() {
       $scope.modalFilters.show();
       $scope.filter= {
           initialRadius: '50'
       }
     };

     /**
      *  Close Filters Modal
      */
     $scope.closeModalFilters = function() {
       $scope.modalFilters.hide();
     };

    /**
     *  Go to Boundary View
     */
    $scope.seeMore = function() {
      $scope.closeModalInfo();
      $state.go('boundary', {'boundaryId': $scope.boundary._id});
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

   /**
    *  Set filters
    */
   $scope.setFilters = function() {
     console.log($scope.filter.radius);
   };

   /**
    *  Set filters acre size
    */
   $scope.filterAcreSize = function(size) {
     if(size === 'large'){
         $scope.filter.acres = {
             min: 1000,
             max: 10000
         }
     } else if(size === 'medium'){
         $scope.filter.acres = {
             min: 400,
             max: 999
         }
     } else if(size === 'small'){
         $scope.filter.acres = {
             min: 0,
             max: 399
         }
     }
   };

}]);
