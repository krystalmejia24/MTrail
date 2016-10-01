
angular.module('mTrail').controller('MenuController', ['$scope', '$http', '$state', '$stateParams',
  function ($scope, $http, $state, $stateParams) {



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
   *  Go to county map view
   */
  $scope.goToCounty = function () {
    $state.go('county');
  };

  /**
   *  Go to boundary map view
   */
  $scope.goToBoundary = function (boundary) {
    $state.go('boundary', {'boundaryId': boundary._id});
  };

}]);
