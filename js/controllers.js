app.controller('MainController', function($scope,$http,$window,$cordovaInAppBrowser, $ionicModal,$ionicLoading,PaymentService, $ionicPlatform, $timeout, $state, $ionicPopup,$cordovaNetwork,$cordovaDevice) {
  var vm = this;
  /*******************************************************************************/
  /**************************Use for alert pop up on******************************/
  /*******************************************************************************/
  $scope.alertPop = function(title, msg, state) {
    var alertPopup = $ionicPopup.alert({
      title: title || 'Alert',
      template: msg,
      cssClass:"gsg-popup",
      buttons: [{
        text: 'Ok',
        type: 'button-full'
      }]
    })
    alertPopup.then(function(res) {
      if (state != undefined) {
        $state.go(state);
      }
    });
  }
  $scope.successPop = function(title,msg, state){
    var successPopup = $ionicPopup.alert({
      title: title || 'success',
      template : msg,
      cssClass : "gsg-success-popup",
      buttons:[{
        text: 'Ok',
        type: 'button-positive',
        onTap: function(){
          successPopup.close();
        }
      }]
    })
    successPopup.then(function(res) {
      if (state != undefined) {
        $state.go(state);
      }
    });
  };
  $scope.getPaymentOptions = ["COD","INTERNET"];

  $scope.openCheckOutModal = function(datas){
    $ionicLoading.show({
        template : 'Loading...'
    })       
  $ionicModal.fromTemplateUrl('templates/modal/check_out_modal_test.html',{
    scope : $scope,
    animation : 'slide-in-up',
    controller : 'MainController',
  }).then(function(checkoutModal){        
    $scope.checkoutModal = checkoutModal;
    $scope.checkoutModal.show();
    $scope.paymentDatas = datas;
    console.log($scope.paymentDatas);
    $timeout(function(){
        $ionicLoading.hide();

      },500)
    
  });
};
$scope.payments = {};
$scope.paymentNow = function(){
  console.log($scope.payments);
  $scope.paymentDatas.tranMode = $scope.paymentType;
  if($scope.payments.paymentType == "COD"){
      $ionicLoading.show({
          template : 'Please wait...'
      });
      PaymentService.codPayment().save($scope.paymentDatas,function(response){
          console.log(response);
          $scope.checkoutModal.hide();
          $timeout(function(){
              $ionicLoading.hide();
              $scope.successPop('Success', response.data,'app.mapView'); 
          },400);

      },function(error){
          $ionicLoading.hide();
          $scope.alertPop('Error', error.data,'app.mapView'); 
      });
  }
  if($scope.payments.paymentType == "INTERNET"){
      console.log($scope.paymentDatas);
      // var req = {
      //     method: 'GET',
      //     url: $scope.paymentDatas.pgUrl,
      // }
      // $http(req).then(function(response){
      //     console.log(response);
      // },function(erro
      //     console.log(error);
      // });
      var options = {
        location: 'no',
        clearcache: 'yes',
        toolbar: 'no'
      };
      document.addEventListener("deviceready", function () {
        $cordovaInAppBrowser.open($scope.paymentDatas.pgUrl, '_blank', options)
          .then(function(event) {
            PaymentService.checkPaymentStatus($scope.paymentDatas.referenceno).get(function(response){
              console.log(response);
              $cordovaInAppBrowser.close();  
              $scope.successPop(response.data, response.data,'app.mapView'); 
            },function(error){
              console.log(error);
              $ionicLoading.hide();
              $scope.alertPop('Error', error.data,'app.mapView'); 
            });
          })
          .catch(function(event) {
            // error
          });
      }, false);
      // $ionicPlatform.ready(function() {
      //   if($scope.ref){
      //     $scope.ref.close();
      //   }
      //   $scope.ref = cordova.InAppBrowser.open(, '_blank','location=no');
      // })
  }
};
$scope.closeChekoutModal = function(){
  $scope.checkoutModal.hide();
};



  // $scope.isOnline = function(){
  //   if($cordovaNetwork.isOnline() == true){
  //     return true;
  //   }
  //   else{
  //     return false;
  //   }
  //   return true;
  // }
  $scope.getConstant = function(){
    //var deviceToken = $cordovaDevice.getUUID();
    var deviceToken = "83E75D61-6B1B-45CA-AC51-632F24DCD192";
    return deviceToken;
  }
  $ionicModal.fromTemplateUrl('templates/modal/change_location.html', {
    scope: $scope,
    animation: 'slide-in-right'
  }).then(function(modal) {
    vm.modal = modal;
  });
  vm.openChangeLocation = function(){
    vm.modal.show();
  }
  vm.closeModal = function() {
    vm.modal.hide();
  }
  
});
app.controller('HomeController', function($ionicModal, $timeout,$state) {
  var vm = this;
  $timeout(function(){
    $state.go('login');
  },5000);
});


app.controller('MapController',function($cordovaGeolocation,TicketService,$ionicModal,config,$scope,LocationModel,$ionicPlatform,$ionicLoading,$timeout,$state,$ionicPopup,$ionicHistory,$localStorage){
  var vm = this;
  var diagnostic;
  var locationAccuracy;
  vm.mapInit = function(){
    $scope.location = '';
    $ionicPlatform.ready(function() {
     diagnostic = cordova.plugins.diagnostic;
     locationAccuracy = cordova.plugins.locationAccuracy;
    diagnostic.isLocationEnabled(function(available){
      if(!available){
        locationAccuracy.canRequest(function(canRequest){
          if(canRequest){
              locationAccuracy.request(function (success){
                  console.log("Successfully requested accuracy: "+success.message);
                  $timeout(function(){
                    vm.loadMap();
                  })
              }, function (error){
                console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
                if(error.code !== locationAccuracy.ERROR_USER_DISAGREED){
                  if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
                    diagnostic.switchToLocationSettings();
                  }
                }
                else{
                  $ionicHistory.goBack();
                }
              },locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
          }
        });
      }
      else{
        $timeout(function(){
          vm.loadMap();
        })
      }
      console.log("Location is " + (available ? "available" : "not available"));
    }, function(error){
      console.error("The following error occurred: "+error);
    });
  })
  // vm.loadMap();
  }
  vm.loadMap = function(){
    var options = {timeout: 20000, enableHighAccuracy: true};
    $ionicLoading.show();
    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
      $ionicLoading.hide();
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      var myLatlng = {lat: lat, lng: lng}
      // LocationModel.setCurrentLocation(myLatlng);
      vm.loadMapLocation(myLatlng);
      var latLng = lat + "," + lng;
      vm.getLocationName(myLatlng);
    }, function(error) {
      $ionicLoading.hide();
      console.log('Could not get location: ', error);
      $scope.alertPop('Warning', 'Something went wrong please try again.');
    });
  }

  $scope.changeLocation = function(latLng){
    var myLatlng = {lat: latLng.lat, lng: latLng.lng}
    vm.location = latLng.location;
    vm.loadMapLocation(myLatlng);
  }
  vm.loadMapLocation = function(latLng){
    var mapOptions = {
      streetViewControl: true,
      center: latLng,
      zoom: 13
    };
    map = new google.maps.Map(document.getElementById('map'),mapOptions);
    var myElements = angular.element(document.querySelector('#map'));
    var div = angular.element("<div class='centerMarker'></div>");
    myElements.append(div);
    // marker = new google.maps.Marker({
    //     position: latLng,
    //     map: map
    // });
    google.maps.event.addListener(map, 'center_changed', function() {
      window.setTimeout(function() {
        var center = map.getCenter();
        var myLatlng = {lat: center.lat(), lng: center.lng()}
        vm.getLocationName(myLatlng);
      }, 100);
    });
  }
  vm.getLocationName = function(latLng){
      LocationModel.setCurrentLocation(latLng);
      var latlong = latLng.lat+','+latLng.lng;
    config.getLocationName(latlong).then(function(response) {
      vm.place = response.data.results[0];
      vm.location = vm.place;
    },function(err) {
    });
  }
  vm.emergencyTicket = {};
  vm.confirmEmegReq = function(){
    console.log("coming");
    var confirmPopup = $ionicPopup.alert({
      title: 'Confirm',
      template: 'Are you sure ? An emergency ticket will be created',
      cssClass:"gsg-popup",
      buttons: [{
        text: 'Cancel',
        type: 'button',
        onTap: function(){
          confirmPopup.close();
        }
      },
      {
        text: 'Ok',
        type: 'button',
        onTap: function(){
          var latlngObj = LocationModel.getCurrentLocation();
          vm.emergencyTicket.location=[latlngObj.lat,latlngObj.lng];
          vm.emergencyTicket.userId = $localStorage.loggedin_user.userId;
          vm.emergencyTicket.serviceType = "EMERGENCY"; 
          console.log(vm.emergencyTicket);
          TicketService.createTicket().save(vm.emergencyTicket,function(response){
            console.log(response);
            $scope.successPop('Success', `Your request has been captured successfully.  Our support team will get back to you shortly.`);
          },function(error){
            console.log(error);
          });
        }
      }
    ]
    })
    // confirmPopup.then(function(res) {
    //   var latlngObj = LocationModel.getCurrentLocation();
    //   vm.emergencyTicket.location=[latlngObj.lat,latlngObj.lng];
    //   vm.emergencyTicket.userId = $localStorage.loggedin_user.userId;
    //   vm.emergencyTicket.serviceType = "EMERGENCY"; 
    //   TicketService.createTicket().save(vm.emergencyTicket,function(response){
    //     console.log(response);
    //     $scope.successPop('Success', `Your request has been captured successfully.  Our support team will get back to you shortly.`);
    //   },function(error){
    //     console.log(error);
    //   });
    // },function(err){
    //   confirmPopup.close();
    // });
}
vm.myCartOrders = function(){
  console.log("coming");
  TicketService.getCardOrders().get(function(response){
      console.log(response);
      vm.cartOrders = response.data;
  },function(error){

  });
};
  
});
app.controller("HelpController",function($scope){
  var vm = this;
  vm.queryList = [
    {
      'question':"What type of driver's licence is required",
      'answer':"GSG Requires a valid Indian driver's licence. It's critical that licence is an original. The Licence must be for a light motor vehicle(car). Members do NOT need a specific cab licence that is associated with a yellow board plate"
    },
    {
      'question':"What type of driver's licence is required",
      'answer':"GSG Requires a valid Indian driver's licence. It's critical that licence is an original. The Licence must be for a light motor vehicle(car). Members do NOT need a specific cab licence that is associated with a yellow board plate"
    }
  ];
  console.log(vm.queryList)
  vm.toggleGroup = function(list) {
    console.log(list);
    if (vm.isGroupShown(list)) {
      vm.shownGroup = null;
    } else {
      vm.shownGroup = list;
    }
  };
  vm.isGroupShown = function(list) {
    return vm.shownGroup === list;
  };
});


