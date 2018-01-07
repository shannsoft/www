app.controller('ServiceController',function($scope,$state,$ionicModal,ServicesService,$localStorage,TicketService,$ionicLoading,$timeout,LocationModel){
    var vm = this;
    vm.reqTktDataObj = {};
    vm.currentDate = new Date();
    $scope.minDate = new Date();
    $scope.maxDate = new Date(2020,6,5);
    $scope.servicedatePickercallback = function (val) {
        if (!val) {	
            console.log('Date not selected');
        } else {
            vm.reqTktDataObj.serviceDate = moment(val).format('YYYY-MM-DD');
            console.log('Selected date is : ', vm.reqTktDataObj.serviceDate);
        }
    };
    vm.toggleGroup = function(scheme){
        if(vm.isGroupShown(scheme)){
            vm.shownGroup = null;
        }
        else{
            vm.shownGroup = scheme;
        }
    };
    vm.isGroupShown = function(scheme){
        return vm.shownGroup === scheme;
    };
    vm.getUserScheme = function(schemeType){
        angular.forEach($localStorage.loggedin_user.schemes,function(item){
            if(item.schemeType == schemeType){
                vm.userScheme = item;
                vm.schemeId = item.schemeId;
            }
        });
        // vm.userScheme = $localStorage.loggedin_user.schemes;
        console.log(vm.userScheme);
    };
    vm.getVehicleList = function(){
        vm.vehicleList = $localStorage.loggedin_user.userVehicles;
        console.log(vm.vehicleList);
    };
    vm.servicesLeft = function(serviceType){
        $ionicLoading.show({
            template : 'Loading...'
        })
        $ionicModal.fromTemplateUrl('templates/modal/service_left_modal.html',{
          scope : $scope,
          animation : 'slide-in-up',
          controller : 'ServiceController'
        }).then(function(modal) {
          vm.modal = modal;        
          vm.modal.show();
          vm.serviceType = serviceType;      
          $timeout(function(){
            vm.myDesiredService(vm.serviceType);
            $ionicLoading.hide();
          },700)
      });
    };
    vm.myDesiredService = function(serviceType){
        ServicesService.getAllServices().get(function(response){
            console.log(response);
            vm.ServiceArr = [];
            if(serviceType == "all"){
                vm.ServiceArr = response.data;
                vm.serviceFilterArr = response.data;
            }
            else{
                angular.forEach(response.data,function(item){
                    if(item.category == serviceType){
                        vm.ServiceArr.push(item);
                    }
                });
            }
            console.log(vm.ServiceArr);
        },function(error){
            
        });
    }
    vm.serviceSearch = function(serviceType){
        $ionicLoading.show({
            template : 'Loading...'
        })       
      $ionicModal.fromTemplateUrl('templates/modal/service_search_modal.html',{
        scope : $scope,
        animation : 'slide-in-up',
        controller : 'ServiceController'
      }).then(function(modal){        
        vm.modal = modal;
        vm.modal.show();
        $timeout(function(){
            vm.serviceType = serviceType;
            vm.myDesiredService(vm.serviceType);
            $ionicLoading.hide();
          },500)
        
      });
    };
    vm.searchService = function(searchQuery){
        vm.serviceFilterArr = vm.ServiceArr.filter(function(service){
            if(service.subCategory.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 ){
                return true;
            }
        })
    };
    vm.selectedServices = function(from) {
        vm.selectedServicesArr = [];
        if(from){
            angular.forEach(vm.serviceFilterArr,function(service){
                if(service.isSelect){
                    vm.selectedServicesArr.push(service);
                }
            });

        }
        else{
            angular.forEach(vm.ServiceArr,function(service){
                if(service.isSelect){
                    vm.selectedServicesArr.push(service);
                }
            });
        }
        console.log(vm.selectedServicesArr);
        $ionicModal.fromTemplateUrl('templates/modal/confirm_service_request_modal.html',{
            scope : $scope,
            animation : 'slide-in-right',
            controller : 'ServiceController'
          }).then(function(confirmModal){
            vm.confirmModal = confirmModal;
            vm.confirmModal.show();
            
          });
    };
    vm.requestTicket = function(){
       $ionicLoading.show({
           template:'Creating Ticket...'
       })
        vm.reqTktDataObj.userId = $localStorage.loggedin_user.userId;
        vm.reqTktDataObj.schemeId = vm.schemeId;
        // if(vm.reqTktDataObj.useUserScheme == true || vm.reqTktDataObj.useUserScheme == "true"){
        //     vm.reqTktDataObj.schemeId = vm.schemeId;
        // }
        var latlngObj = LocationModel.getCurrentLocation();
        vm.reqTktDataObj.location=[latlngObj.lat,latlngObj.lng];
        vm.reqTktDataObj.serviceType = "SERVICE"; 
        vm.reqTktDataObj.services = [];
        angular.forEach(vm.selectedServicesArr,function(service){
            if(service.isSelect){
                vm.reqTktDataObj.services.push(service.serviceId);
            }
        });
       
        
        console.log(vm.reqTktDataObj);
        // vm.validateForm = vm.validateRequest();
         if(vm.reqTktDataObj.services.length > 0 && vm.reqTktDataObj.usrVehicle ){
                TicketService.createTicket().save(vm.reqTktDataObj,function(response){               
                console.log(response);
                vm.confirmModal.hide();
                vm.modal.hide();
                $timeout(function(){
                    $ionicLoading.hide();
                    $scope.successPop('Success', 'Ticket Created Successfully...'); 
                },500);
             
            },function(error){
                $ionicLoading.hide();
                console.log(error);
            });
        }
        else{
            $ionicLoading.hide();
            $scope.alertPop('Error', 'please choose atleast one service and vehicle'); 
        }
    };
    
    vm.closeModal = function() {
      vm.modal.hide();
    };
    vm.closeConfirmModal = function(){
        vm.confirmModal.hide();
    };
  
})