angular.module('mTrail').controller('CoreController', ['$scope', '$state', 'leafletData', '$http', '$state', '$stateParams',
  function ($scope, $state, leafletData, $http, $state, $stateParams) {

  /**
   *  Initialize map
   */
  angular.extend($scope, {
    center: {
      lat: 29.6520,
			lng: -82.3250,
      zoom: 9
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
            //Construct center of boundary
            var poly = L.geoJson(feature);
            var center = poly.getBounds().getCenter();
            console.log(center);
            //go to boundary view
            $state.go('boundary', {'boundaryId': feature._id, 'center': center});
          });
        }
      }
    });
  });

}]);
