app.controller('VehicleController',function($scope,$state,$ionicPopup,$ionicModal){
var vm = this;
vm.vehicleList = [
    {
        'name':"BMW ",
        'model':"Q8",
        'image':"img/plan_bg.png"
    },
    {
        'name':"Audi ",
        'model':"A5",
        'image':"img/audi.jpg"
    },
    {
        'name':"Hyundai",
        'model':"city",
        'image':"img/honda.jpg"
    }
    
]
vm.updateVehicleData = {
    'status':"1"
}
vm.vehicle = {
    'status':"1"
}
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
vm.deleteVehicle = function(vehicleId){
    var vehicleDeletePopup = $ionicPopup.confirm({
        title:'Delete Vehicle',
        template:'Are you sure ypu want to delete the vehicle from your list'
    });
    vehicleDeletePopup.then(function(res){
        console.log(res);
        console.log("res");

    });
};
vm.updateVehicle = function(){
   var updateVehiclemodal = $ionicModal.fromTemplateUrl('templates/modal/update_vehicle_modal.html',{
        scope: $scope,
        controller: 'VehicleController',
        animation:'slide-in-up'
    });
    updateVehiclemodal.then(function(modal){
        vm.modal = modal;
        vm.modal.show();
    });
}
vm.closeModal = function(){
    vm.modal.hide();
}
vm.updateVehicleDetails = function(){
    console.log("coming");
    console.log(vm.updateVehicleData);
}
});