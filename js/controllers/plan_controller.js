app.controller("PlanController",function($ionicModal,$stateParams,$timeout,$state,$scope,$ionicLoading,PlanService,$localStorage){
   var vm = this;
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
    vm.subscribePlan = function(planToSubscribe){
        $ionicLoading.show({
            template:'Subscribing...'
        })
        var obj = {};
        obj.user_id = $localStorage.loggedin_user.userId;
        obj.schemeId = planToSubscribe.schemeId;
        PlanService.subscribePlan(obj).get(function(response){  
            console.log(response);   
            // $localStorage.loggedin_user = response.data;
            vm.subscrpModal.hide();  
            $scope.openCheckOutModal(response.data);    
            // $timeout(function(){
            //     $ionicLoading.hide();
            //     $scope.successPop('Success', 'Plan Subscribed Successfully...','app.mapView'); 
            // },500);
        },function(error){          
            console.log(error);
            $ionicLoading.hide();
            vm.subscrpModal.hide();
            $timeout(function(){
               
                $scope.alertPop('Error', error.data.message);
            },500);          
        });
    };
   vm.getMyPlan = function(){
       vm.myPlan = $localStorage.loggedin_user.schemes;
       console.log(vm.myPlan);
   }
    vm.closeModal = function() {
        vm.subscrpModal.hide();
    }
    
});