app.controller('DashboardController',function($ionicModal, $ionicPopup,$rootScope,$localStorage,ServicesService,UserModel,$stateParams,$timeout,$state,$scope,$ionicLoading,TicketService){
    var vm = this;
    vm.ticketDetails = {};
    
        $scope.ticketLists =  UserModel.getTicket();
    vm.addOntypeArr = ["SERVICES","CONSUMABLE","SPARE","OIL"];
    vm.addOnSvcCapture = {
        type : "",
        desc : "",
        price : "",
        serviceList : []
    };
    vm.addOnSvcItemArr = [];
    vm.getTickets  = function(){
        $ionicLoading.show({
            template :'Loading...'
        });
        TicketService.getAllTickets().get(function(response){
            console.log(response);
            $scope.ticketLists = response.data;
            UserModel.setTicket( response.data);
            $ionicLoading.hide();
           
            // if($state.current.name == "app.dashboard"){
                vm.canceledTicketArr = [];
                vm.resolvedTicketArr = [];
                vm.newTicketsArr = [];
                vm.wipTicketsArr = [];
                angular.forEach(response.data, function(item){
                    if(item.requestStatus == "RESOLVED"){
                        vm.resolvedTicketArr.push(item);
                    }
                    if(item.requestStatus == "CANCELED"){
                        vm.canceledTicketArr.push(item);
                    }
                    if(item.requestStatus == "CREATED" || item.requestStatus == "EMERGENCY"){
                        vm.newTicketsArr.push(item);
                    }
                    if(item.requestStatus == "WIP"){
                        vm.wipTicketsArr.push(item);
                    }
                });
            // }
        },function(error){
            console.log(error);
            $ionicLoading.hide();
            $scope.alertPop("Error", error.message);
        });
    }
    vm.ticketList = function(){
        $ionicLoading.show({
            template : 'Loading..'
        })
        if($stateParams.st){
            $localStorage.ticketListStateParams = $stateParams.st;
            vm.ticketCategory =  $localStorage.ticketListStateParams;
        }
        TicketService.getAllTickets().get(function(response){
            console.log(response);
            UserModel.setTicket( response.data);
            // 
            vm.selectedTicketArr = [];
            angular.forEach(response.data, function(item){
                if(item.requestStatus == $localStorage.ticketListStateParams){
                    vm.selectedTicketArr.push(item);
                }
                if((item.requestStatus == "CREATED" || item.requestStatus == "EMERGENCY") && $localStorage.ticketListStateParams == "NEW"){
                    vm.selectedTicketArr.push(item);
                }
            });  
            $timeout(function(){
                $ionicLoading.hide();
            },300)    
        },function(error){
            console.log(error);
            $ionicLoading.hide();
            $scope.alertPop("Error", error.message);
        });
            
    };                 
     
    vm.getOrderForTicket = function(){
        if($stateParams.ticketData){
            $localStorage.ticketDetailsData = $stateParams.ticketData;
        }
        vm.ticketDetails = $localStorage.ticketDetailsData;
        console.log(vm.ticketDetails);
        // TicketService.getOrderByOrderId($stateParams.order_id).get(function(response){
        //     console.log(response);
        //     vm.oredrDetails = response.data;
        // },function(error){
        //     console.log(error);
        // });
    };
    vm.openAddNewSvcModal = function(){
        vm.addOnSvcItemArr = [];
        $ionicModal.fromTemplateUrl('templates/modal/add_new_service_modal.html',{
            scope : $scope,
            animation : 'slide-in-up',
            controller : 'DashboardController'
          }).then(function(newSvcModal) {
            vm.newSvcModal = newSvcModal;        
            vm.newSvcModal.show();
        });
    };
    vm.closeNewSvcModal = function(){
        vm.newSvcModal.hide();
    };
    vm.getAllServices = function(){
        ServicesService.getAllServices().get(function(response){
            console.log(response);
            vm.ServiceArr = [];          
            vm.ServiceArr = response.data;
            vm.serviceFilterArr = response.data;
            console.log(vm.ServiceArr);
        },function(error){
            console.log(error);
        });
    };
    vm.addItemToArray = function(){
       
        if(vm.addOnSvcCapture.type == "SERVICES"){
            vm.addOnSvcCapture.serviceList = [];
            angular.forEach(vm.serviceFilterArr,function(service){
                if(service.isSelect){
                    vm.addOnSvcCapture.serviceList.push(service);
                }
            });
            if(vm.addOnSvcItemArr.length > 0){
                angular.forEach(vm.addOnSvcItemArr,function(items){
                    if(items.type == vm.addOnSvcCapture.type){
                        var index =  vm.addOnSvcItemArr.indexOf(items);
                        vm.addOnSvcItemArr.splice(index , 1);
                        vm.addOnSvcItemArr.push(vm.addOnSvcCapture);
                    }
                });
            }
            else {
                vm.addOnSvcItemArr.push(vm.addOnSvcCapture);
            }           
        }
        else {
            if(vm.addOnSvcItemArr.length > 0){
                angular.forEach(vm.addOnSvcItemArr,function(items){
                    if(items.type == vm.addOnSvcCapture.type){
                        var index =  vm.addOnSvcItemArr.indexOf(items);
                        vm.addOnSvcItemArr.splice(index , 1);
                        vm.addOnSvcItemArr.push(vm.addOnSvcCapture);
                    }
                    else {
                        var index =  vm.addOnSvcItemArr.indexOf(items);
                        if(vm.addOnSvcItemArr.length == index+1){
                            vm.addOnSvcItemArr.push(vm.addOnSvcCapture);
                        }
                    }
                });
            }
            else {
                vm.addOnSvcItemArr.push(vm.addOnSvcCapture);
            } 
        }
        vm.addOnSvcCapture = {};
        console.log(vm.addOnSvcItemArr);
    };
    vm.addNewServicesToUserCart = function(){
        $ionicLoading.show({
            template : 'Adding to user cart'
        })
        console.log(vm.addOnSvcItemArr);
        TicketService.newSvcAddOn($stateParams.order_id).save(vm.addOnSvcItemArr, function(response){
            console.log(response);
            vm.newSvcModal.hide();
            $timeout(function(){
                $ionicLoading.hide();
                
                $scope.successPop('Success', 'Orders added to user cart Successfully...'); 
            },500);

        },function(error){
            $ionicLoading.hide();
            console.log(error);
        });
    };
    vm.changeTicketStatus = function(status){
        var changeStatusPopup = $ionicPopup.confirm({
            title:'CONFIRM',
            template:'Are you sure ?<br> Request status will be changed'
        });
        changeStatusPopup.then(function(res){
            if(res == true){
                console.log(vm.ticketDetails);
                console.log(status);
                var obj = {};
                if(vm.ticketDetails){
                    obj.assignedQueue = vm.ticketDetails.assignedQueue;
                    obj.assignedToUserId = vm.ticketDetails.assignedToUserId;
                    obj.requestorUserId = vm.ticketDetails.userId;
                    obj.requestStatus = status;
                }
                TicketService.updateOrder().update({orderId : vm.ticketDetails.orderId},obj, function(response){
                console.log(response);
                vm.ticketDetails = response.data;
                $scope.successPop('Success', 'Status changed Successfully...');
                // $localStorage.loggedin_user = response.data;
                // $timeout(function(){
                //     vm.vehicleList = $localStorage.loggedin_user.userVehicles;
                //     $ionicLoading.hide();
                //     $scope.successPop('Success', 'Vehicle deleted Successfully...'); 
                // },500);
            },function(error){
                console.log(error);
                $scope.alertPop("Error", "some error occured");
            });
            }
    
        });
    };
});