angular.module('mTrail').controller('CountyController', ['$scope',
                                                        'leafletData',
                                                        '$http',
                                                        '$ionicHistory',
                                                        '$state',
                                                        '$stateParams',
                                                        '$ionicLoading',
                                                        '$ionicModal',
                                                        'Tiles',
                                                        '$cordovaGeolocation',
  function ($scope, leafletData, $http, $ionicHistory, $state, $stateParams, $ionicLoading, $ionicModal, Tiles, $cordovaGeolocation) {

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
    *  Show indicator for filtering
    */
    $scope.filterIndicator = function (setting){
        if (ionic.Platform.isIOS() && setting === 'on') {
            $ionicLoading.show({
                template: 'Searching <br><br><ion-spinner icon="ios"></ion-spinner>'
            });
        } else if (ionic.Platform.isAndroid() && setting === 'on') {
            $ionicLoading.show({
                template: 'Searching <br><br><ion-spinner icon="android"></ion-spinner>'
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
   *  Custom style settings for the maps
   */
  $scope.setStyle = function() {
      return {
          fillColor: Tiles.getColor($scope.tiles.name),
          weight: 2,
          opacity: 0.5,
          color: Tiles.getColor($scope.tiles.name),
          dashArray: '1',
          fillOpacity: 0.1
      }
  };

  /**
   *  Retrieve county map and set $scope.map to further extend
   */
  leafletData.getMap('county').then(function(map) {
      $scope.map = map;
  });

  /**
   *  Filter out private properties
   */
  $scope.privateFilter = function() {
      for (var i = 0; i < $scope.boundaries.length; i++) {
          if($scope.boundaries[i].properties.OWNER === 'Private Individual(s)') {
             $scope.boundaries.splice(i,1);
          }
      }
  };

  /**
   *  Find current location
   */
  $scope.findUser = function() {
     $scope.locationIndicator('on');
     $scope.map.locate({ setView : true, maxZoon: 13, enableHighAccuracy: true});
     $scope.map.on('locationfound', function (e) {
          $scope.currentLocation = e.latlng;
          $scope.addCustomLocationMarker(e.accuracy);
     });
     $scope.map.on('locationerror', function(e){
         console.log(e);
         alert(e);
     });
  };

  $scope.locationOptions = function() {
      return {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0
      }
  };

  $scope.test = function() {
    $scope.locationIndicator('on');
    $cordovaGeolocation.getCurrentPosition($scope.locationOptions).then(function (position) {
        $scope.currentLocation = L.latLng(position.coords.latitude, position.coords.longitude);
        $scope.addCustomLocationMarker(position.coords.accuracy);
    }, function(err) {
            $scope.locationIndicator('off');
            alert(err);
    });
  };

  /**
   * Add custom current location marker
   */
  $scope.addCustomLocationMarker = function(accuracy) {
    // add radius circle marker
    if($scope.radiusCircle){
        $scope.map.removeLayer($scope.radiusCircle);
    }
    $scope.radiusCircle = L.circle($scope.currentLocation, accuracy, {
        stroke: false,
        fillColor: '#3473e2',
        opacity: 0.2,
        fillOpacity: 0.2
    }).addTo($scope.map);

    // add outer circle marker
    if($scope.outerCircle){
        $scope.map.removeLayer($scope.outerCircle);
    }
    $scope.outerCircle = L.circleMarker($scope.currentLocation, {
        fillColor: '#3473e2',
        opacity: 0.5,
        weight: 1,
        fillOpacity: 0.5
    }).setRadius(10).addTo($scope.map);

    // add inner circle marker
    if($scope.innerCircle){
        $scope.map.removeLayer($scope.innerCircle);
    }
    $scope.innerCircle = L.circleMarker($scope.currentLocation, {
        fillColor: '#3473e2',
        color: 'white',
        opacity: 1,
        weight: 2,
        fillOpacity: 1
    }).setRadius(7).addTo($scope.map);
    $scope.map.setView($scope.currentLocation, 12, { animate: true, duration: 0.5 });

    // turn off location indicator
    $scope.locationIndicator('off');
  };


  /**
   *  Retrieve Boundaries - HTTP GET request
   */
  $http.get("https://act-trailblazer.herokuapp.com/api/boundaries")
  .success(function(data, status) {
    $scope.boundaries = data;
    $scope.privateFilter();
    $scope.geoLayer = L.geoJson($scope.boundaries, {
        style: $scope.setStyle,
        onEachFeature: function (feature, layer) {
            layer.on('click', function (e) {
                $scope.boundary = feature;
                $scope.openModalInfo();
            });
        }
    }).addTo($scope.map);
    $ionicLoading.hide();
  });

  /**
   *  Change Tile Settings - Modal functionality
   */
  $scope.changeTiles = function (tile) {
    $scope.tiles = Tiles.getTiles(tile);
    $scope.geoLayer.setStyle($scope.setStyle);
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
       $scope.filter = {
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
      $state.go('boundary', {'boundaryId': $scope.boundary._id, 'tiles': $scope.tiles});
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
    *  Set filters acre size
    */
   $scope.filterAcreSize = function(size) {
     $scope.acreFilter = true;
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

   /**
    *  Redraws map based on filters
    */
   $scope.redraw = function(list) {
      if(!$scope.filter.radius && $scope.circleMileRadius){
           $scope.map.removeLayer($scope.circleMileRadius);
      }
      $scope.geoLayer = L.geoJson(list, {
          style: $scope.setStyle,
          onEachFeature: function (feature, layer) {
              layer.on('click', function (e) {
                  $scope.boundary = feature;
                  $scope.openModalInfo();
              });
          }
      }).addTo($scope.map);

      // set filters to false
      $scope.acreFilter = null;
      $scope.filter.radius = null;
    };

    /**
     *  Update filtered List
     */
    $scope.updateFilterList = function() {
        //create new empty list
        filterList = [];

        //check if acre size has been setand update filter list
        if ($scope.acreFilter) {
            var min = $scope.filter.acres.min;
            var max = $scope.filter.acres.max;
            for (var i = 0; i < $scope.boundaries.length; i++) {
                if(min <= $scope.boundaries[i].properties.TOTACRES && $scope.boundaries[i].properties.TOTACRES <= max) {
                    filterList.push($scope.boundaries[i]);
                }
            }
        }

        //check for radius filter and update filter list
        if ($scope.filter.radius) {
            for (var i = 0; i < $scope.boundaries.length; i++) {
                var poly = L.geoJson($scope.boundaries[i]);
                if($scope.circleMileRadius.getBounds().contains(poly.getBounds().getCenter())){
                    filterList.push($scope.boundaries[i]);
                }
            }
        }

        $scope.redraw(filterList);
        $scope.filterIndicator('off');
    };

    /**
     *  Updates/Creates the marker for the radius filter
     */
   $scope.createRadiusMarker = function() {
       if($scope.circleMileRadius){
           $scope.map.removeLayer($scope.circleMileRadius);
       }
       $scope.circleMileRadius = L.circle($scope.currentLocation, $scope.filter.radius * 1609.34, {
           clickable: false,
           stroke: true,
           fillColor: '#3473e2',
           weight: 1,
           opacity: 1,
           fillOpacity: 0.05
        }).addTo($scope.map);

        $scope.updateFilterList();
   };

   /**
    *  Retrieve current location before updating the radius mile marker
    */
   $scope.filterLocation = function() {
       $scope.map.locate({ setView : true, maxZoon: 13});
       $scope.map.on('locationfound', function (e) {
            $scope.currentLocation = e.latlng;
            $scope.addCustomLocationMarker(e);
            $scope.createRadiusMarker();
       });
       $scope.map.on('locationerror', function(e){
              alert(e);
       });
       /*
       $cordovaGeolocation.getCurrentPosition($scope.locationOptions).then(function (position) {
           $scope.currentLocation = L.latLng(position.coords.latitude, position.coords.longitude);
           $scope.addCustomLocationMarker(position.coords.accuracy);
           $scope.createRadiusMarker();
       }, function(err) {
               $ionicLoading.hide();
               alert(err);
       });
       */
    };

    /**
     *  Set filters
     *  To Do : output error window that no filters were selected
     */
    $scope.setFilters = function() {
      if ($scope.filter.radius || $scope.acreFilter) {
          $scope.map.removeLayer($scope.geoLayer);
          $scope.filterIndicator('on');
          $scope.closeModalFilters();

          //call appropriate filters based on input
          if ($scope.filter.radius) {
              if($scope.currentLocation) {
                  $scope.createRadiusMarker();
              } else {
                   $scope.filterLocation();
              }
          } else{
              $scope.updateFilterList();
          }
      } else {
          console.log('error');
      }
    };

    /**
     *  Clear filters
     */
    $scope.clearFilters = function() {
      if($scope.circleMileRadius){
          $scope.map.removeLayer($scope.circleMileRadius);
      }
      $scope.closeModalFilters();
    };

}]);
