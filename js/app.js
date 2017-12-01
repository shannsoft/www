// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('gsg_app', ['ionic','serviceModule','ui.utils','ngCordova']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('home', {
    url: '/home',
    controller:'HomeController',
    controllerAs:'homeCtrl',
    templateUrl: 'templates/home.html'
  })
  .state('login', {
    url: '/login',
    controller:'LoginController',
    controllerAs:'loginCtrl',
    templateUrl: 'templates/login.html'
  })
  .state('register', {
    url: '/register',
    controller:'LoginController',
    controllerAs:'loginCtrl',
    templateUrl: 'templates/register.html'
  })
  .state('otp', {
    url: '/otp/:number',
    controller:'LoginController',
    controllerAs:'loginCtrl',
    templateUrl: 'templates/otp_verification.html',
    params:{
      number:null 
    }
  })
  .state('basicInfo', {
    url: '/basicInfo/:number',
    controller:'LoginController',
    controllerAs:'loginCtrl',
    templateUrl: 'templates/basic_info.html',
    params:{
      number:null 
    }
  })
  .state('password', {
    url: '/pwd',
    controller:'LoginController',
    controllerAs:'loginCtrl',
    templateUrl: 'templates/set_password.html'
  })
  .state('add-vehicle', {
    url: '/add-vehicle/:user_id',
    controller:'LoginController',
    controllerAs:'loginCtrl',
    templateUrl: 'templates/add-vehicle.html',
    params:{
      user_id : null
    }
  })
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })
  .state('app.mapView', {
    url: '/mapView',
    views: {
      'menuContent': {
        templateUrl: 'templates/mapView.html',
        controller:'MapController',
        controllerAs:'mapCtrl',
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');
});
app.constant('CONFIG', {
  // 'HTTP_HOST_APP':'http://localhost:8100/api'
  'HTTP_HOST_APP':'http://101.53.136.166:8090'
});
