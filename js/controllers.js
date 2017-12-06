app.controller('MainController', function($scope, $ionicModal, $timeout, $state, $ionicPopup,$cordovaNetwork,$cordovaDevice) {
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
  $scope.isOnline = function(){
    // if($cordovaNetwork.isOnline() == true){
    //   return true;
    // }
    // else{
    //   return false;
    // }
    return true;
  }
  $scope.getConstant = function(){
    //var deviceToken = $cordovaDevice.getUUID();
    var deviceToken = "83E75D61-6B1B-45CA-AC51-632F24DCD192";
    return deviceToken;
  }
});
app.controller('HomeController', function($ionicModal, $timeout,$state) {
  var vm = this;
  $timeout(function(){
    $state.go('login');
  },5000);
});
app.controller('LoginController', function($ionicModal,$stateParams, loginService,registrationService, $timeout,$state,$scope,$ionicLoading) {
  var vm = this;
  var map;
  var marker;
  
  if($stateParams.number){
    vm.mobile_number = $stateParams.number;
  }
  if($stateParams.user_id){
    vm.userId = $stateParams.user_id;
  }
  if($stateParams.vehicle_id){
    vm.vehicleId = $stateParams.vehicle_id;
  }
  // vm.user = {username:'',password:'',mobile:''};
  vm.user = {email:'',code:''};
  vm.login = function() {
    vm.user.role = {
      roleId:1
    };
   vm.user.status = 1;
   console.log(vm.user);
   if($scope.isOnline()){
    loginService.saveEmployee().save(vm.user,function(response){
      console.log("response", response);
      $ionicLoading.hide();
      // if(response.data.statusCode == 200){
      //   $state.go('app.dashboard');
      // }
    },function(err){
      $ionicLoading.hide();
    });
  }
  else{

  }


  }
  vm.getOtp = function(){
    
    console.log(vm.user.contact_no);
    $ionicLoading.show({
      template: 'Sending OTP...'
    });
    $ionicLoading.hide();
       $state.go('otp',{"number":vm.user.contact_no});
    // registrationService.getOtp(vm.user.contact_no).save(vm.user.contact_no, function(response){
    //   console.log(response);
    //   $ionicLoading.hide();
    //    $state.go('otp',{"number":vm.user.contact_no});
    // },function(error){
    //   console.log(error);
    //   $ionicLoading.hide();
    //   $scope.alertPop('Something Wrong', 'OTP can not send.');
    // });
          
  }
  vm.verifyOtp = function(){
    var obj = {};
    obj.contact_no = $stateParams.number;
    obj.otp = vm.otp;
    $ionicLoading.show({
      template: 'Verifying OTP...'
    });
    $ionicLoading.hide();
    $state.go('basicInfo',{"number":obj.contact_no});
    // registrationService.verifyOtp( obj.contact_no,obj.otp).save(obj, function(response){
    //   console.log(response);
    //   if(response.type == "success"){
    //     $ionicLoading.hide();
    //     $state.go('basicInfo',{"number":obj.contact_no});
    //   }
    //   if(response.type == "error"){
    //     $ionicLoading.hide();
    //     $scope.alertPop('Error', 'OTP is wrong please try again.');
    //   }
    // },function(error){
    //   console.log(error);
    // });    
  }
  vm.register = function(){
    $ionicLoading.show({
      template: 'Registering...'
    });
  vm.basicDetails.contactNo = vm.mobile_number;
  vm.basicDetails.role = {
        roleId:1
      };
   vm.basicDetails.status = 1;
  registrationService.addUser().save(vm.basicDetails, function(response){
    $ionicLoading.hide();
    console.log(response);
    console.log(response.userId);
    vm.Id = response.userId;
    $state.go('user-details',{"user_id":vm.Id});
   
  },function(error){
    $ionicLoading.hide();
    console.log(error);
    $scope.alertPop('Error', 'Error in registering user.');
  });
  }
  vm.addUserDetails = function(){
    $ionicLoading.show({
      template: 'Saving User Details...'
    });
    vm.userDetails.user = {
      userId : vm.userId
    };
    console.log(vm.userDetails);
    registrationService.addUserDetails().save(vm.userDetails,function(response){
      $ionicLoading.hide()
      console.log(response);
      $state.go('add-vehicle',{"user_id":vm.userId});
        },function(error){
          $ionicLoading.hide();
          $scope.alertPop('Error','Something wrong, Cannot add user details');
    });


  }
  vm.checkPassword = function(before,after){
    vm.showPasswordMisMatch = false;
    if(before !== after){
      vm.showPasswordMisMatch = true;
    }
    return vm.showPasswordMisMatch;
  }
  vm.addVehicle = function(){
    $ionicLoading.show({
      template: 'Saving Vehicle Details...'
    });
    vm.vehicle.user = {
      userId : vm.userId
    };
    registrationService.addVehicle().save(vm.vehicle,function(response){
      $ionicLoading.hide()
      if(vm.vehicle.insurance == "1"){
        $state.go('insurance',{"vehicle_id":response.vehicleId});
      }
      else{
        $state.go('app.mapView');
      }
     },function(error){
      $ionicLoading.hide();
      $scope.alertPop('Error','Something wrong, Cannot add vehicle');
    });
  }
  vm.addInsuranceDetails = function(){
    $ionicLoading.show({
      template: 'Saving Insurance Details...'
    });
    vm.insuranceDetails.vehicle = {
      vehicleId : vm.vehicleId
    };
    registrationService.addInsuranceDetail().save(vm.insuranceDetails,function(response){
      $ionicLoading.hide()
      console.log(response);
        $state.go('app.mapView');
      
     },function(error){
      $ionicLoading.hide();
      $scope.alertPop('Error','Something wrong, Cannot add Insurance');
    });
    $state.go('app.mapView');
  }
  
});

app.controller('MapController',function($cordovaGeolocation,config,$scope,$ionicPlatform,$ionicLoading,$timeout,$state,$ionicHistory){
  var vm = this;
  var diagnostic = cordova.plugins.diagnostic;
  var locationAccuracy = cordova.plugins.locationAccuracy;
  vm.mapInit = function(){
    $scope.location = '';
    $ionicPlatform.ready(function() {
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
  }
  vm.loadMap = function(){
    var options = {timeout: 20000, enableHighAccuracy: true};
    $ionicLoading.show();
    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
      $ionicLoading.hide();
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      var myLatlng = {lat: lat, lng: lng}
      vm.loadMapLocation(myLatlng);
      var latLng = lat + "," + lng;
      config.getLocationName(latLng).then(function(response) {
        vm.place = response.data.results[0];
        vm.location = vm.place;
        console.log(vm.place.formatted_address);
      },function(err) {
      });
    }, function(error) {
      $ionicLoading.hide();
      console.log('Could not get location: ', error);
      $scope.alertPop('Warning', 'Something went wrong please try again.');
    });
  }

  $scope.changeLocation = function(latLng){
    var myLatlng = {lat: latLng.lat, lng: latLng.lng}
    //$scope.latLong =  $scope.location.geometry.location.lat + "," +  $scope.location.geometry.location.lng;
    //console.log($scope.latLong);
    vm.location = latLng.location;
    vm.loadMapLocation(myLatlng);
    //map.setCenter(new google.maps.LatLng(myLatlng.lat,myLatlng.lng));
  }
  vm.loadMapLocation = function(latLng){
    var mapOptions = {
      streetViewControl: true,
      center: latLng,
      zoom: 13
    };
    map = new google.maps.Map(document.getElementById('map'),mapOptions);
    marker = new google.maps.Marker({
        position: latLng,
        map: map
    });
  }
});
