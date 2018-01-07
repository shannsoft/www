var app = angular.module('gsg_app', ['ionic','ionic-datepicker','ion-floating-menu','serviceModule','ui.utils','ngCordova','ngStorage','ngCookies']);

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

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider,$httpProvider) {
  // $httpProvider.interceptors.push(function ($q, $location, $window,$localStorage) {
  //   return {
  //     request: function (config) {
  //       var isSignInUrl = config.url.indexOf('login') > -1 ? true : false;
  //       if($localStorage.user_token ){
  //         config.headers = config.headers || {};
  //         config.headers['Authorization'] = 'bearer '+$localStorage.user_token;
  //       }
  //       return config;
  //     },
  //     response: function (response) {
  //       if (response.status === 401) {
  //         $location.path('/');
  //       }
  //       return response || $q.when(response);
  //     }
  //   };
  // });
  // $ionicConfigProvider.tabs.position('top');
  $urlRouterProvider.otherwise('/login');
  $stateProvider
  .state('login', {
    url: '/login',
    controller:'LoginController',
    controllerAs:'loginCtrl',
    templateUrl: 'templates/login.html',
    resolve: {
      logout: checkLoggedin
    }
  })
  // .state('pre-reset-password',{
  //   url: '/prpwd',
  //   controller:'LoginController',
  //   controllerAs:'preResPwdctrl',
  //   templateUrl: 'templates/pre_reset_password.html',
  //   resolve: {
  //     logout: checkLoggedin
  //   }
  // })
  .state('password-pre-reset',{
    url: '/prpwd',
    controller:'LoginController',
    controllerAs:'preResPwdctrl',
    templateUrl: 'templates/pre_reset_password.html',
    resolve: {
      logout: checkLoggedin
    }
  })
  .state('reset-pwd',{
    url: '/resetpwd/:number',
    controller:'LoginController',
    controllerAs:'ResPwdctrl',
    templateUrl: 'templates/reset_password.html',
    params :{
      number : null,
    },
    resolve: {
      logout: checkLoggedin
    }
  })
  .state('register', {
    url: '/register',
    controller:'LoginController',
    controllerAs:'regstrCtrl',
    templateUrl: 'templates/registration.html',
    resolve: {
      logout: checkLoggedin
    }
  })
  .state('otp', {
    url: '/otp/:number',
    controller:'LoginController',
    controllerAs:'otpCtrl',
    templateUrl: 'templates/otp_verification.html',
    params:{
      number:null 
    },
    resolve: {
      logout: checkLoggedin
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
    resolve: {
      logout: checkLoggedout
    },
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
    resolve: {
      logout: checkLoggedout
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/user/profile.html',
        controller:'ProfileController',
        controllerAs:'profileCtrl',
      }
    }
  })

  .state('app.tarrif-plan', {
    url: '/tarrif-plan',
    resolve: {
      logout: checkLoggedout
    },
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
    resolve: {
      logout: checkLoggedout
    },
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
    resolve: {
      logout: checkLoggedout
    },
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
    resolve: {
      logout: checkLoggedout
    },
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
    resolve: {
      logout: checkLoggedout
    },
    views:{
      'menuContent':{
        controller:'VehicleController',
        controllerAs:'vehicleCtrl',
        templateUrl:'templates/vehicles/vehicleList.html'
      }
    }
  })
  // if none of the above states are matched, use this as the fallback
  function checkLoggedin($q, $timeout, $rootScope,$http, $state, $localStorage) {
    var deferred = $q.defer();
    if($localStorage.user_token){
      $timeout(function(){
        deferred.resolve();
        $rootScope.is_loggedin = true;
        $state.go('app.mapView');
      },100)
    }
    else{
      $timeout(function(){
        $localStorage.user_token = null;
        $rootScope.is_loggedin = false;
        deferred.resolve();
        // $state.go('app.mapView');
      },100)
    }
  }
  function checkLoggedout($q, $timeout, $rootScope,$http, $state, $localStorage) {
    var deferred = $q.defer();
   if($localStorage.user_token) {
      $timeout(function(){
        $rootScope.is_loggedin = true;
          console.log("$state >>>>> ",$state.current.name)
          deferred.resolve();
      },200)
    }
    else{
     
      $timeout(function(){
        $localStorage.token = null;
        $rootScope.is_loggedin = false;
        deferred.resolve();
        $state.go('login');
      },200)
    
  }
}
});
app.constant('CONFIG', {
  
  //  'HTTP_HOST_APP':'http://localhost:8090',
   'HTTP_HOST_APP':'http://101.53.136.166:8090'
});
app.config(function (ionicDatePickerProvider) {
  var datePickerObj = {
    inputDate: new Date(),
    titleLabel: 'Select a Date',
    closeLabel: 'Close',
    todayLabel: 'Today',
    setLabel: 'Set',
    mondayFirst: false,
    weeksList: ["S", "M", "T", "W", "T", "F", "S"],
    monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
    templateType: 'popup',
    from: new Date(2012, 8, 1),
    to: new Date(2018, 8, 1),
    showTodayButton: true,
    dateFormat: 'dd MMMM yyyy',
    closeOnSelect: false,
    disableWeekdays: []
  };
  ionicDatePickerProvider.configDatePicker(datePickerObj);
})
