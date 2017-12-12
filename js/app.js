var app = angular.module('gsg_app', ['ionic','serviceModule','ui.utils','ngCordova','ngStorage']);

app.run(function($ionicPlatform,$ionicPopup) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      //cordova.plugins.Keyboard.disableScroll(false);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    /*******************************************************************************/
    /**************************This function is for exist app***********************/
    /*******************************************************************************/
    $ionicPlatform.registerBackButtonAction(function() {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Alert',
        template: 'Do you want to exit from the App',
        okType: 'button-assertive'
      });
      confirmPopup.then(function(res) {
        if (res) {
          navigator.app.exitApp();
        } else {}
      });
    },100);
  });
})

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('top');
  $urlRouterProvider.otherwise('/register');
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
    templateUrl: 'templates/login.html',
    resolve: {
      logout: checkLoggedin
    }
  })
  .state('register', {
    url: '/register',
    controller:'LoginController',
    controllerAs:'loginCtrl',
    templateUrl: 'templates/register.html',
    resolve: {
      logout: checkLoggedin
    }
  })
  .state('otp', {
    url: '/otp/:number',
    controller:'LoginController',
    controllerAs:'loginCtrl',
    templateUrl: 'templates/otp_verification.html',
    params:{
      number:null 
    },
    resolve: {
      logout: checkLoggedin
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
  .state('user-details', {
    url: '/user-details/:user_id',
    controller:'LoginController',
    controllerAs:'userCtrl',
    templateUrl: 'templates/user_details.html',
    params:{
      user_id:null 
    }
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
  .state('insurance', {
    url: '/insurance/:vehicle_id',
    controller:'LoginController',
    controllerAs:'loginCtrl',
    templateUrl: 'templates/insurance.html',
    params:{
      vehicle_id : null
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
  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html'
      }
    }
  })
  .state('app.edit-profile', {
    url: '/edit-profile',
    views:{
      'menuContent':{
        templateUrl:'templates/profile-edit.html'
      }
    }
  })
  .state('app.tarrif-plan', {
    url: '/tarrif-plan',
    views: {
      'menuContent': {
        controller:'PlanController',
        controllerAs:'planCtrl',
        templateUrl: 'templates/tarrif-plan/tarrif-plan.html'
      }
    }
  })
  // if none of the above states are matched, use this as the fallback
  function checkLoggedin($q, $localStorage, $state, $timeout) {
    var deferred = $q.defer();
    if($localStorage.user){
      $timeout(function(){
        deferred.resolve();
        $state.go('app.mapView');
      },100)
    }
    else{
      $timeout(function(){
        deferred.resolve();
        $state.go('app.mapView');
      },100)
    }
  }
});
app.constant('CONFIG', {
  // 'HTTP_HOST_APP':'http://localhost:8090',
  'HTTP_HOST_APP':'http://101.53.136.166:8090'
});
