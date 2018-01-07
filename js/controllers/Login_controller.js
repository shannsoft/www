app.controller('LoginController', function($ionicModal,$stateParams, loginService,registrationService, $timeout,$state,$scope,$ionicLoading,UserModel,$localStorage,$resource, $http, $httpParamSerializer, $cookies,$rootScope,UserService) {
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
    
    
    vm.login = function() {
        $ionicLoading.show({
            template:'Signing in...'
        });
        $scope.data = {
            grant_type:"password",
            username: vm.user.contactNbr,
            password: vm.user.password
        };
         $scope.encoded = btoa("android-client:anrdroid-XY7kmzoNzl100");
        // if($scope.isOnline()){
            var req = {
                method: 'POST',
                url: "http://101.53.136.166:8090/gsg/oauth/token",
                headers: {
                    "Authorization": "Basic " + $scope.encoded,
                    "Content-type": "application/x-www-form-urlencoded"
                    } ,
                data: $httpParamSerializer($scope.data)
                }
            $http(req).then(function(data){                   
                console.log(data);
                $localStorage.user_token = data.data.access_token;
                $rootScope.is_loggedin = true;  
                UserService.getUserByCntctNo(vm.user.contactNbr).get(function(response){
                    $localStorage.loggedin_user = response.data;
                    UserModel.setUser(response.data);
                    $timeout(function(){
                        $ionicLoading.hide();
                        console.log(1);
                        $scope.$emit("LOGIN_SUCCESS");
                        $state.go('app.mapView');
                    });
                   
                },function(error){
                   console.log(error);
                });
                               
            },function(error){
                $ionicLoading.hide();
                console.log(error);
                if(error.status == 400){
                    $scope.alertPop('Error', 'Invalid username or password.'); 
                }
            });
          

    //     }
    // else{
    //     // $ionicLoading.show({
    //     //     template: 'No Internet connection....'
    //     // })
  
    // }
  }
    vm.basicDetails.password = "";
    vm.rePassword = "";
    
    vm.checkPassword = function(before,after){
        vm.showPasswordMisMatch = false;
        console.log(before +","+ after);
      if(before !== after){
        vm.showPasswordMisMatch = true;
      }
      return vm.showPasswordMisMatch;
    }
    vm.register = function(){
         UserModel.setRegisterData(vm.basicDetails);
         var obj = {
            contactNbr : vm.basicDetails.contactNbr
         };
        registrationService.preRegister().save(obj, function(response){
            console.log(response);
            $ionicLoading.hide();
                $state.go('otp',{"number":vm.basicDetails.contactNbr});
            },function(error){
            console.log(error);
            $ionicLoading.hide();
            if(error.status == 409){
                $scope.alertPop('Error', error.data.msg);
            }
            else {
             $scope.alertPop('Error', 'OTP can not send');
            }
        });
        // $state.go('otp',{"number":vm.basicDetails.contactNbr});            
    }
    vm.verifyOtp = function(){
        // $ionicLoading.show({
        //     template: 'Verifying OTP...'
        // });
        var userdata = UserModel.getRegisterData();
        userdata.otp = vm.otp;
        registrationService.register().save(userdata, function(response){
            console.log(response);
            // $localStorage.user = response;
            $ionicLoading.hide();
            //alertpop will be changed to successpop
            $scope.successPop('Success', 'Registered successfully.. Please login');
            $state.go('login');
            
        },function(error){
            $ionicLoading.hide();
            console.log(error);
            if(error.status == 406){
                $scope.alertPop('Error', error.data.message);
            }            
            else {
                $scope.alertPop('Error', 'Can not register user.');
            }
        });  
    }
    vm.logout = function(){
        $ionicLoading.show({
            template: 'Signing out...'
        });
        $timeout(function(){
            $ionicLoading.hide();
            $localStorage.user_token = null;
            $localStorage.loggedin_user = null;
            $rootScope.is_loggedin = false;
            // UserModel.unsetUser();
            $state.go('login');
          },1000)
       
    }
    vm.preResPwd = function(contactNbr){
        $ionicLoading.show({
            template : 'Verifying user'
        });
        console.log(contactNbr);
        var obj = {};
        obj.contactNbr = contactNbr;
        loginService.preResPwd(obj.contactNbr).save(obj, function(response){
            $ionicLoading.hide();
            if(response.status == "OK"){
                $state.go('reset-pwd',{"number": obj.contactNbr});
            }
            console.log(response);
        },function(error){
            $ionicLoading.hide();
            if(error.status == 404){
                $scope.alertPop('Error' , error.data.message);
            }
            console.log(error);
        });
    }
    vm.checkPassword = function(before,after){
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>" + before,after);
        vm.showPasswordMisMatch = false;
        if(before !== after){
        vm.showPasswordMisMatch = true;
        }
        return vm.showPasswordMisMatch;
    };
    vm.resetPwd = function(){
        $ionicLoading.show({
            template : 'Resetting password'
        });
        vm.resPwd.contactNbr = $stateParams.number;
        console.log(vm.resPwd);
        loginService.resetPwd().save(vm.resPwd, function(response){
            console.log(response);
            $ionicLoading.hide();   
            if(response.status == "OK"){
                $timeout(function(){
                               
                    $scope.successPop('Success', 'Password resetted successfully...','login'); 
                },500);
            }
            else {
                $state.go('login');
            }
        },function(error){
            $ionicLoading.hide();
            if(error.status == 406){
                $scope.alertPop('Error', error.data.message); 
            }
            else {
                $scope.alertPop('Error', 'Can not reset password','login'); 
            }
           
            console.log(error);
        });

    }

});