
angular.module('mTrail').controller('BoundaryController', ['$scope', '$state', 'leafletData', '$state', '$stateParams', '$http',
  function ($scope, $state, leafletData, $state, $stateParams, $http) {

  /**
   *  Initialize map
   */
  angular.extend($scope, {
    center: {
      lat: $stateParams.center.lat,
			lng: $stateParams.center.lng,
      zoom: 13
    }
  });
  console.log($stateParams.center);

  /**
   *  Retrieve Boundaries - HTTP GET request
   */
  $http.get("https://act-trailblazer.herokuapp.com/api/boundaries/" + $stateParams.boundaryId)
  .success(function(data, status) {
    $scope.boundary = data;
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
        }
      }
    });
  });

}]);
