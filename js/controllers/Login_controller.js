app.controller('LoginController', function($ionicModal,$stateParams, loginService,registrationService, $timeout,$state,$scope,$ionicLoading,UserModel,$localStorage,$resource, $http, $httpParamSerializer, $cookies) {
    var vm = this;
    var map;
    var marker;
    vm.basicDetails = {};
    if($stateParams.number){
      vm.contactNo = $stateParams.number;
    }
    if($stateParams.user_id){
      vm.userId = $stateParams.user_id;
    }
    if($stateParams.vehicle_id){
      vm.vehicleId = $stateParams.vehicle_id;
    }
    
    vm.user = {contactNbr:'',password:''};
    
    $scope.data = {
        grant_type:"password",
        username: vm.user.contactNbr,
        password: vm.user.password,
        client_id: "testjwtclientid"
    };
    console.log($scope.data);
    $scope.encoded = btoa("testjwtclientid:XY7kmzoNzl100");
    vm.login = function() {
        $scope.data = {
            grant_type:"password",
            username: vm.user.contactNbr,
            password: vm.user.password,
            client_id: "testjwtclientid"
        };
        console.log($scope.data);
        console.log(vm.user);
     if($scope.isOnline()){
    //   loginService.loginOAuth(vm.user.contactNbr,vm.user.password).save(vm.user,function(response){
    //     console.log("response", response);
    //     $ionicLoading.hide();
    //    $state.go('app.mapView');
    //   },function(err){
    //     $ionicLoading.hide();
    //     console.log(err);
    //   });
        var req = {
            method: 'POST',
            url: "http://localhost:8090/gsg/oauth/token",
            headers: {
                "Authorization": "Basic " + $scope.encoded,
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
                },
            data: $httpParamSerializer($scope.data)
            }
        $http(req).then(function(data){
            $http.defaults.headers.common.Authorization = 'Bearer ' + data.data.access_token;
            $cookies.put("access_token", data.data.access_token);
            window.location.href="index";
        });
    }
    else{
  
    }
  }
    // vm.getOtp = function(){
      
    //   console.log(vm.user.contact_no);
    //   $ionicLoading.show({
    //     template: 'Sending OTP...'
    //   });
    //   $ionicLoading.hide();
    //      $state.go('otp',{"number":vm.user.contact_no});
    //   // registrationService.getOtp(vm.user.contact_no).save(vm.user.contact_no, function(response){
    //   //   console.log(response);
    //   //   $ionicLoading.hide();
    //   //    $state.go('otp',{"number":vm.user.contact_no});
    //   // },function(error){
    //   //   console.log(error);
    //   //   $ionicLoading.hide();
    //   //   $scope.alertPop('Something Wrong', 'OTP can not send.');
    //   // });
            
    // }
    // vm.verifyOtp = function(){
    //   var obj = {};
    //   obj.contact_no = $stateParams.number;
    //   obj.otp = vm.otp;
    //   $ionicLoading.show({
    //     template: 'Verifying OTP...'
    //   });
    //   $ionicLoading.hide();
    //   $state.go('basicInfo',{"number":obj.contact_no});
    //   // registrationService.verifyOtp( obj.contact_no,obj.otp).save(obj, function(response){
    //   //   console.log(response);
    //   //   if(response.type == "success"){
    //   //     $ionicLoading.hide();
    //   //     $state.go('basicInfo',{"number":obj.contact_no});
    //   //   }
    //   //   if(response.type == "error"){
    //   //     $ionicLoading.hide();
    //   //     $scope.alertPop('Error', 'OTP is wrong please try again.');
    //   //   }
    //   // },function(error){
    //   //   console.log(error);
    //   // });    
    // }
    // vm.register = function(){
    //   $ionicLoading.show({
    //     template: 'Registering...'
    //   });
    // vm.basicDetails.contactNo = vm.mobile_number;
    // vm.basicDetails.role = {
    //       roleId:1
    //     };
    //  vm.basicDetails.status = 1;
    // registrationService.addUser().save(vm.basicDetails, function(response){
    //   $ionicLoading.hide();
    //   console.log(response);
    //   console.log(response.userId);
    //   vm.Id = response.userId;
    //   $state.go('user-details',{"user_id":vm.Id});
     
    // },function(error){
    //   $ionicLoading.hide();
    //   console.log(error);
    //   $scope.alertPop('Error', 'Error in registering user.');
    // });
    // }
    // vm.addUserDetails = function(){
    //   $ionicLoading.show({
    //     template: 'Saving User Details...'
    //   });
    //   vm.userDetails.user = {
    //     userId : vm.userId
    //   };
    //   console.log(vm.userDetails);
    //   registrationService.addUserDetails().save(vm.userDetails,function(response){
    //     $ionicLoading.hide()
    //     console.log(response);
    //     $state.go('add-vehicle',{"user_id":vm.userId});
    //       },function(error){
    //         $ionicLoading.hide();
    //         $scope.alertPop('Error','Something wrong, Cannot add user details');
    //   });
  
  
    // }
    // vm.checkPassword = function(before,after){
    //   vm.showPasswordMisMatch = false;
    //   if(before !== after){
    //     vm.showPasswordMisMatch = true;
    //   }
    //   return vm.showPasswordMisMatch;
    // }
    vm.register = function(){
         UserModel.setRegisterData(vm.basicDetails);
        // registrationService.getOtp(vm.basicDetails.contactNo).save(vm.basicDetails.contactNo, function(response){
        //     console.log(response);
        //     $ionicLoading.hide();
        //         $state.go('otp',{"number":vm.basicDetails.contactNo});
        //     },function(error){
        //     console.log(error);
        //     $ionicLoading.hide();
        //      $scope.alertPop('Something Wrong', 'OTP can not send.');
        //     //$state.go('otp',{"number":vm.basicDetails.contactNo});
        // });
        $state.go('otp',{"number":vm.basicDetails.contactNbr});            
    }
    vm.verifyOtp = function(){
        $ionicLoading.show({
            template: 'Verifying OTP...'
            });
        var obj = {
            'contact_no':vm.contactNo,
            'otp':vm.otp
        };
        console.log("coming");
        var userdata = UserModel.getRegisterData();
        // registrationService.verifyOtp( obj.contact_no,obj.otp).save(obj, function(response){
        //     if(response.type == "success"){
        //         $ionicLoading.hide();
        //         $ionicLoading.show({
        //             template: 'Saving user...'
        //             });
        //         registrationService.addUser().save(userdata, function(response){
        //             $ionicLoading.hide();
        //             $state.go('app.mapView',{"user_id":vm.Id});
                    
        //         },function(error){
        //             $ionicLoading.hide();
        //             console.log(error);
        //             $scope.alertPop('Error', 'Can not register user.');
        //         });

        //     }
        //     if(response.type == "error"){
        //         $ionicLoading.hide();
        //         $scope.alertPop('Error', 'OTP is wrong please try again.');
        //     }
        // },function(error){
        // console.log(error);
        // });  
        registrationService.register().save(userdata, function(response){
            console.log(response);
            $localStorage.user = response;
            $ionicLoading.hide();
            $scope.alertPop('Success', 'Registered successfully. Please login');
            $state.go('login');
            
        },function(error){
            $ionicLoading.hide();
            console.log(error);
            $scope.alertPop('Error', 'Can not register user.');
        });  
}

});