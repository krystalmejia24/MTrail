angular.module('mTrail').controller('CountyController', ['$scope', '$state', 'leafletData', '$http', '$state', '$stateParams',
  function ($scope, $state, leafletData, $http, $state, $stateParams) {

  /**
   *  Initialize map
   */
  angular.extend($scope, {
    center: {
      lat: 29.6520,
			lng: -82.3250,
      zoom: 13
    }
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
          fillColor: 'green',
          weight: 2,
          opacity: 0.5,
          color: 'green',
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
  });

}]);