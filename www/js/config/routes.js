angular.module('mTrail').config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  //States go here
  .state('menu', {
    url: '/',
    templateUrl: 'templates/menu.html',
    controller: 'MenuController'
  })
  .state('list', {
    url: '/list',
    templateUrl: 'templates/list.html',
    controller: 'MenuController',
  })
  .state('county', {
    url: '/county',
    templateUrl: 'templates/county.html',
    controller: 'CountyController',
  })
  .state('boundary', {
    url: '/boundary',
    templateUrl: 'templates/boundary.html',
    controller: 'BoundaryController',
    params: {
          boundaryId: Number,
          tiles: null
    },
  });

  $urlRouterProvider.otherwise("/");
});
