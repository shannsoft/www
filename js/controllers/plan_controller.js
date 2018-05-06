app.controller("PlanController",function($ionicModal,$stateParams,$timeout,$state,$scope,$ionicLoading,$ionicPopup,PlanService,$localStorage){
   var vm = this;
   vm.myPlan = {};
   vm.toggleGroup = function(list){
    if(vm.isGroupShown(list)){
        vm.shownGroup = null;
    }
    else{
        vm.shownGroup = list;
    }
};
vm.isGroupShown = function(list){
    return vm.shownGroup === list;
}
   vm.getSchemes = function(){
       $ionicLoading.show({
           template: 'Loading...'
       })
        PlanService.getSchemes().get(function(response){
            console.log(response);
            $timeout(function(){
                $ionicLoading.hide();
                vm.shemelist = response.data;
            },400)

        },function(error){
            console.log(error);
            $ionicLoading.hide();
        })

    };
    vm.planListModal = function(scheme_detail){
        $ionicModal.fromTemplateUrl('templates/modal/planList_modal.html', {
            scope: $scope,
            animation: 'slide-in-right'
        }).then(function(subscrpModal) {
            vm.subscrpModal = subscrpModal;
            vm.subscrpModal.show();
            vm.planSrvcDtls = scheme_detail;
        });
    };
    vm.referralArr = [
      {
        type : "Internet",
        data : "",
        isSelect:false,
      },
      {
        type : "Social",
        data : "",
        isSelect:false,
      },
      {
        type : "Friend",
        data : {
          refCode : "",
          info:""
        },
        isSelect:false,
      },
      {
        type : "Employee",
        data : {
          refCode : "",
          info:""
        },
        isSelect:false,
      },
    ];
    vm.selectedReferral = null;
    vm.onReferral = function($index) {

      angular.forEach(vm.referralArr , function(value, key) {
        if($index == key)
        {
          value.isSelect = true;
          vm.selectedReferral = value;
        }
        else {
          value.isSelect = false;
        }
      });
    }
    vm.resetReferral = function() {
        vm.selectedReferral = {};
        angular.forEach(vm.referralArr , function(value, key) {
            value.isSelect = true;
            if(value.data) {
                value.data.refCode = "",
                value.data.info = ""
            }
          });
    }
    vm.validateRefCode = function(referral) {
      // referral.data.info = "xxxxxxx"; // hardcoded , as service not prepared.
      PlanService.getReferralUser(referral.data.refCode).get(function(response){
          if(response.data && response.data.name != "") {
            referral.data.info = response.data.name;
          }
          else{
            // alert("Please enter valid ref code !");
            $ionicPopup.alert({
             title: 'Error',
             template: 'Please enter valid ref code !',
             // buttons: [
             //   {text:"ok"},
             //   { type: 'button-assertive' },
             // ]
           });
          }
      },function(error){
          console.log(error);
          // alert("Error Occured !");
          $ionicPopup.alert({
           title: 'Error',
           template: error.message,
           // buttons: [
           //   {text:"ok"},
           //   { type: 'button-assertive' },
           // ]
         });
      });
    }
    vm.subscribePlan = function(planToSubscribe){
        $ionicLoading.show({
            template:'Subscribing...'
        })
        var obj = {};
        var referralObj = {};
        obj.user_id = $localStorage.loggedin_user.userId;
        obj.schemeId = planToSubscribe.schemeId;
        // checking for the friend and employee sanity test
        if( (vm.selectedReferral.type == "Friend" || vm.selectedReferral.type == "Employee") && vm.selectedReferral.data.info == "" ){
          // alert("Please enter valid ref code !");
          $ionicPopup.alert({
           title: 'Error',
           template: 'Please enter valid ref code !',
           // buttons: [
           //   {text:"ok"},
           //   { type: 'button-assertive' },
           // ]
         });
          $ionicLoading.hide();
          return;
        }
        if(vm.selectedReferral) {
          referralObj = {
            referType : vm.selectedReferral.type,
            referralCd : vm.selectedReferral.data ? vm.selectedReferral.data.refCode : "",
          }

        }

        PlanService.subscribePlan(obj).save(referralObj,function(response){
            console.log(response);
            vm.resetReferral();
            $ionicLoading.hide();
            vm.subscrpModal.remove();
            $scope.openCheckOutModal(response.data);
            // $timeout(function(){
            //     $ionicLoading.hide();
            //     $scope.successPop('Success', 'Plan Subscribed Successfully...','app.mapView');
            // },500);
        },function(error){
            console.log(error);
            vm.resetReferral();
            vm.subscrpModal.hide();
            vm.subscrpModal.remove();
            $timeout(function(){
                $ionicLoading.hide();
                $scope.alertPop('Error', error.data.message);
            },500);
        });
    };
   vm.getMyPlan = function(){
       PlanService.getUserSchemes().get(function(response){
        console.log(response);
        vm.myPlan = response.data;
        $localStorage.loggedin_user.schemes = vm.myPlan;
        angular.forEach(vm.myPlan, function(item){
            var sbscrptnDate = moment(item.subscriptionDt);
            var validtyLeft = moment().diff(sbscrptnDate, 'days');
            item.validityLeft = item.durationInDays-validtyLeft;

        });
       },function(error){
        console.log(error);
       });
   }
    vm.closePlanListModal = function() {
        vm.subscrpModal.hide();
        vm.subscrpModal.remove();
    }

});
