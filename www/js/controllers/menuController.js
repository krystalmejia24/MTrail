
angular.module('mTrail').controller('MenuController', ['$scope',
                                                      '$http',
                                                      '$state',
                                                      '$stateParams',
                                                      'Tiles',
  function ($scope, $http, $state, $stateParams, Tiles) {



  /**
   *  Find a list of Boundaries
   */
  $scope.find = function () {
    $http.get("https://act-trailblazer.herokuapp.com/api/boundaries")
    .success(function(data, status) {
        $scope.boundaries = data;
    });
  };

  /**
   *  Go to list boundary view
   */
  $scope.goToList = function () {
    $state.go('list');
  };

  /**
   *  Go to settings
   */
  $scope.goToFilters = function () {
    $state.go('filters');
  };

  /**
   *  Go to county map view
   */
  $scope.goToCounty = function () {
    $state.go('county');
  };

  /**
   *  Go to boundary map view
   */
  $scope.goToBoundary = function (boundary) {
    $state.go('boundary', {'boundary': boundary, 'boundaryName': $scope.boundary.properties.MANAME});
  };

}]);
