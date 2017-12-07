angular.module('impeller', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider) {
  
  $stateProvider

    .state('app', {
    url: '/app',
    //abstract: true,
    templateUrl: 'index.html'//,
    //controller: 'AppCtrl'
  })

  .state('app.history', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'history.html'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app');
})