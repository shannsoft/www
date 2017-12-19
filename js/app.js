var app = angular.module('gsg_app', ['ionic','serviceModule','ui.utils','ngCordova','ngStorage','ngCookies']);

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
  // $ionicConfigProvider.tabs.position('top');
  $urlRouterProvider.otherwise('/login');
  $stateProvider
  .state('login', {
    url: '/login',
    controller:'LoginController',
    controllerAs:'loginCtrl',
    templateUrl: 'templates/login.html',
    // resolve: {
    //   logout: checkLoggedin
    // }
  })
  .state('register', {
    url: '/register',
    controller:'LoginController',
    controllerAs:'regstrCtrl',
    templateUrl: 'templates/registration.html',
    // resolve: {
    //   logout: checkLoggedin
    // }
  })
  .state('otp', {
    url: '/otp/:number',
    controller:'LoginController',
    controllerAs:'otpCtrl',
    templateUrl: 'templates/otp_verification.html',
    params:{
      number:null 
    },
    // resolve: {
    //   logout: checkLoggedin
    // }
  })
  // .state('basicInfo', {
  //   url: '/basicInfo/:number',
  //   controller:'LoginController',
  //   controllerAs:'loginCtrl',
  //   templateUrl: 'templates/basic_info.html',
  //   params:{
  //     number:null 
  //   }
  // })
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
    url: '/add-vehicle',
    controller:'VehicleController',
    controllerAs:'vehicleCtrl',
    templateUrl: 'templates/vehicles/add-vehicle.html',
    // params:{
    //   user_id : null
    // }
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
  // .state('change-password',{
  //   url:'/change-password',
  //   controller:'userController',
  //   controllerAs:'chngPwdCtrl',
  //   templateUrl:'templates/user/change_password.html'
  // })
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
        templateUrl: 'templates/user/profile.html',
        controller:'ProfileController',
        controllerAs:'profileCtrl',
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
  .state('app.requests', {
    url: '/myRequests',
    views: {
      'menuContent': {
        controller:'RequestController',
        controllerAs:'reqCtrl',
        templateUrl: 'templates/requests.html'
      }
    }
  })
  .state('app.history', {
    url: '/history',
    views: {
      'menuContent': {
        controller:'RequestController',
        controllerAs:'historyCtrl',
        templateUrl: 'templates/history.html'
      }
    }
  })
  .state('app.contactUs', {
    url: '/contactUs',
    views: {
      'menuContent': {
        controller:'HelpController',
        controllerAs:'helpCtrl',
        templateUrl: 'templates/contact.html'
      }
    }
  })
  .state('app.vehicles',{
    url:'/vehicles',
    views:{
      'menuContent':{
        controller:'VehicleController',
        controllerAs:'vehicleCtrl',
        templateUrl:'templates/vehicles/vehicleList.html'
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
  'HTTP_HOST_APP_OAUTH':'testjwtclientid=XY7kmzoNzl100@localhost:8090',
   'HTTP_HOST_APP':'http://localhost:8090',
  // 'HTTP_HOST_APP':'http://101.53.136.166:8090'
});
