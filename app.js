angular.module('messenger', [
  'ionic',
  'messenger.controllers',
  'messenger.services'
])

.run(function ($rootScope, $state){
  ionic.Platform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    console.error(error);
    if (error === 'AUTH_REQUIRED') {
      $state.go('app.login');
    }
  });
  $rootScope.$on('unauth', function (event) {
    $state.go('app.login');
  });
})

.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      views: {
        '': {
          template: '<ion-nav-view name="app"></ion-nav-view>'
        }
      }
    })
    .state('app.login', {
      url: '/login',
      views: {
        'app': {
      controller: 'LoginController',
      templateUrl: 'html/login.html'
          
        }
      }
    })
    .state('app.tabs', {
      url: '/tab',
      abstract: true,
      resolve: {
        'requireAuth': function(){
          return true;
        }
      },
      views: {
        'app': {
      controller: 'SettingsController',
      templateUrl: 'html/app-tabs.html'
          
        }
      }
    })
    .state('app.tabs.recent', {
      url: '/recent',
      views: {
        'recent-tab': {
          templateUrl: 'html/recent.html'
        }
      }
    })
    .state('app.tabs.groups', {
      url: '/groups',
      views: {
        'groups-tab': {
          templateUrl: 'html/groups.html'
        }
      }
    })
    .state('app.tabs.people', {
      url: '/people',
      views: {
        'people-tab': {
          templateUrl: 'html/people.html'
        }
      }
    })
    .state('app.tabs.settings', {
      url: '/settings',
      views: {
        'settings-tab': {
          templateUrl: 'html/settings.html',

          }
        }
    });
  $urlRouterProvider.otherwise('/app/tab/recent');
})
