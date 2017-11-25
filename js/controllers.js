app.controller('MainController', function($scope, $ionicModal, $timeout, $state, $ionicPopup) {
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
});
app.controller('HomeController', function($ionicModal, $timeout,$state) {
  var vm = this;
  $timeout(function(){
    $state.go('login');
  },5000);
});
app.controller('LoginController', function($ionicModal,loginService, $timeout,$state,$scope,$ionicLoading) {
  var vm = this;
  vm.user = {username:'',password:'',mobile:''};
  vm.login = function() {
       if(vm.user.username == "" || vm.user.password == ""){
    $scope.alertPop('Alert', 'Enter Email and Password');
    }
else{
    $ionicLoading.show({
      template: 'Signing In...'
    });
    // loginService.delete().get(function(response){
    //   console.log("response", response);
    //   $ionicLoading.hide();
    //   // if(response.data.statusCode == 200){
    //   //   $state.go('app.dashboard');
    //   // }
    // },function(err){
    //   $ionicLoading.hide();
    // })

    // $timeout(function(){
    //   $ionicLoading.hide();
    //   $state.go('otp');
    // },6000)
  }
  }
  vm.register = function(){
    $ionicLoading.show({
      template: 'Sending OTP...'
    });
    $timeout(function(){
    if (vm.user.mobile == "") {
      $ionicLoading.hide();
      $scope.alertPop('Alert', 'Please Enter a Mobile number');
    } 
    else{
      
      $ionicLoading.hide();
      $state.go('otp');
        
    }
  },3000)
  }
});