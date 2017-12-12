app.controller("PlanController",function($ionicModal,$stateParams,$timeout,$state,$scope,$ionicLoading){
   var vm = this;
    
    vm.specialPlanListModal = function(){
        $ionicModal.fromTemplateUrl('templates/modal/planList_modal.html', {
            scope: $scope,
            animation: 'slide-in-right'
        }).then(function(modal) {
            vm.modal = modal;
            vm.modal.show();
        });
    }
    vm.silverPlanListModal = function(){
        $ionicModal.fromTemplateUrl('templates/modal/silverPlanList_modal.html', {
            scope: $scope,
            animation: 'slide-in-right'
        }).then(function(modal) {
            vm.modal = modal;
            vm.modal.show();
        });
    }
    vm.goldPlanListModal = function(){
        $ionicModal.fromTemplateUrl('templates/modal/goldPlanList_modal.html', {
            scope: $scope,
            animation: 'slide-in-right'
        }).then(function(modal) {
            vm.modal = modal;
            vm.modal.show();
        });
    }
    vm.platinumPlanListModal = function(){
        $ionicModal.fromTemplateUrl('templates/modal/platinumPlanList_modal.html', {
            scope: $scope,
            animation: 'slide-in-right'
        }).then(function(modal) {
            vm.modal = modal;
            vm.modal.show();
        });
    }
    vm.closeModal = function() {
        vm.modal.hide();
    }
});