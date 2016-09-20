angular.module('starter').controller('CoreController', ['$scope', '$state', 'leafletData',
  function ($scope, $state, leafletData) {

  angular.extend($scope, {
    center: {
      lat: 29.6520,
			lng: -82.3250,
      zoom: 8
    }
  });

}
]);
