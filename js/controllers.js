app.controller('MainController', function($scope, $ionicModal, $timeout, $state, $ionicPopup,$cordovaNetwork) {
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
  vm.basicDetails.contactNo = vm.mobile_number;
  vm.basicDetails.role = {
    roleId:1
  };
  vm.basicDetails.status = 1;
  $state.go('add-vehicle');
  // registrationService.addUser().save(vm.basicDetails, function(response){
  //   console.log(response);
  //   $state.go('add-vehicle');
  // },function(error){
  //   console.log(error);
  // });
  }
  vm.checkPassword = function(before,after){
    vm.showPasswordMisMatch = false;
    if(before !== after){
      vm.showPasswordMisMatch = true;
    }
    return vm.showPasswordMisMatch;
  }
  
});

app.controller('MapController',function($cordovaGeolocation,config,$scope,$ionicLoading){
  var vm = this;
  vm.mapInit = function(){
    var options = {timeout: 20000, enableHighAccuracy: true};
    $ionicLoading.show();
    // $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(function(position) {
      $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
        $ionicLoading.hide();
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var myLatlng = {lat: lat, lng: lng}
        vm.loadMapLocation(myLatlng);
        var latLng = lat + "," + lng;
        config.getLocationName(latLng).then(function(response) {
          vm.place = response.data.results[0];
          $scope.location = vm.place;
          console.log(vm.place.formatted_address);
        },function(err) {
        });
      }, function(error) {
        $ionicLoading.hide();
        console.log('Could not get location: ', error);
        $scope.alertPop('Warning', 'Something went wrong please try again.');
        vm.location = 'Could not get location: ' + error + ' :: ' + JSON.stringify(error);
      });
    // }
  }

  $scope.changeLocation = function(latLng){
    var myLatlng = {lat: latLng.lat, lng: latLng.lng}
    //$scope.latLong =  $scope.location.geometry.location.lat + "," +  $scope.location.geometry.location.lng;
    //console.log($scope.latLong);
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
