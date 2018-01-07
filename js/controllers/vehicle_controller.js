app.controller('VehicleController',function($scope,$state,$ionicPopup,$ionicModal,$localStorage,VehicleService,$ionicLoading,$timeout){
var vm = this;
vm.vehicle = {};
vm.vehicleList = {};
vm.currentDate = new Date();
$scope.minDate = new Date();
$scope.maxDate = new Date(2027, 1, 1);
$scope.insExpPickerCallback = function (val) {
    if (!val) {	
        console.log('Date not selected');
    } else {
        vm.vehicle.expiryDate = moment(val).format('DD-MM-YYYY');
        console.log('Selected date is : ', vm.vehicle.expiryDate);
    }
};
if($localStorage.loggedin_user){
    vm.loggedin_user_id = $localStorage.loggedin_user.userId;
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
        template:'Are you sure to delete the vehicle from your list'
    });
    vehicleDeletePopup.then(function(res){
        if(res == true){
        VehicleService.deleteVehicle(vm.loggedin_user_id,vehicleId).delete(function(response){
            $timeout(function(){
                $localStorage.loggedin_user = response.data;
                $ionicLoading.hide();
                $scope.successPop('Success', 'Vehicle deleted Successfully...','app.mapView'); 
            },500);
        },function(error){
            console.log(error);
        });
        }

    });
};
vm.updateVehicleData = {};
vm.updateVehicle = function(vehicle,position){
   var updateVehiclemodal = $ionicModal.fromTemplateUrl('templates/modal/update_vehicle_modal.html',{
        scope: $scope,
        controller: 'VehicleController',
        animation:'slide-in-up'
    });
    updateVehiclemodal.then(function(modal){
        vm.modal = modal;
        vm.modal.show();
        // vm.VehicleToUpdateData(vehicle,position);
        vm.updateVehicleData = vehicle;
        vm.updateVehicleData.vehiclePosition = position;
        console.log(" vm.updateVehicleData  ", vm.updateVehicleData);
    });
}

// vm.VehicleToUpdateData = function(vehicle,position){
//     vm.updateVehicleData = vehicle;
   
//     vm.updateVehicleData = {
//         vehiclePosition : position
//     }
//      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",vm.updateVehicleData);
// }
vm.closeModal = function(){
    vm.modal.hide();
}
vm.updateVehicleDetails = function(){
};
vm.getVehicleList = function(){
    $ionicLoading.show({
        template: 'Loading...'
    })
    vm.vehicleList = $localStorage.loggedin_user.userVehicles;
    console.log(vm.vehicleList);
    $timeout(function(){
        $ionicLoading.hide();
    },600);
};

vm.getVehicledata = function(){
    VehicleService.getVehicleMakeModel().get(function(response){
        console.log(response);
        vm.vehicleMakeList = response.data;
        //vm.updateVehicleData = vm.vehicleMakeList[0];
        for(var i in  vm.vehicleMakeList){
            if( vm.vehicleMakeList[i].make == vm.updateVehicleData.vehicle.make) {
                vm.selectedMaker =  vm.vehicleMakeList[i];
            }
        }
    },function(error){
        console.log(error);
    });
};
vm.getModel = function(selectedVehicle){
    vm.vehicleModelList = [];
    angular.forEach( vm.vehicleMakeList,function(item){
        if(item.make == selectedVehicle){
            vm.vehicleModelList = item.vehicles;
        }
    });
};
vm.getVehicleType = function(model){
    angular.forEach( vm.vehicleModelList,function(item){
        if(item.models == model){
            vm.type = item.type;
            vm.subType = item.subType;
            vm.wheels = item.wheels;
        }
    });
};
vm.addVehicle = function(){
    $ionicLoading.show({
        template : 'Adding Vehicle Details...'
    });

    vm.vehicle.vehicle = {
        make : vm.vehicle.make,
        models : vm.vehicle.model,
        subType : vm.subType,
        type :  vm.type,
        wheels : vm.wheels
    }
     VehicleService.addVehicle(vm.loggedin_user_id).save(vm.vehicle,function(response){
         $localStorage.loggedin_user = response.data;
         $timeout(function(){
             $ionicLoading.hide();
             $scope.successPop('Success', 'Vehicle Added Successfully...','app.vehicles'); 
         },500);
     },function(error){
         $ionicLoading.hide();
         $scope.alertPop('Error', 'Something went wrong'); 
         console.log(error);
     });
     
 }
});