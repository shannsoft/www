app.controller('ServiceController',function($scope,$state,$http,$stateParams,$ionicModal,ionicDatePicker,PaymentService,ServicesService,$localStorage,TicketService,$ionicLoading,$timeout,LocationModel){
    var vm = this;
    vm.reqTktDataObj = {};
    var ipObj1 = {
        callback: function (val) {  //Mandatory
            vm.reqTktDataObj.serviceDate = moment(val).format('YYYY-MM-DD');
        },
        from: new Date(), //Optional 
        to: new Date(2025,1,1), //Optional 
        inputDate: new Date(),      //Optional 
        mondayFirst: true,          //Optional 
        closeOnSelect: false,       //Optional 
        templateType: 'popup'       //Optional 
    };
   vm.setServiceDate = function(){
    ionicDatePicker.openDatePicker(ipObj1);
   }
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
    };
    vm.getVehicleList = function(){
        vm.vehicleList = $localStorage.loggedin_user.userVehicles;
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
           vm.myDesiredService(vm.serviceType);    
          $timeout(function(){           
            $ionicLoading.hide();
          },500)
      });
    };
    vm.myDesiredService = function(serviceType){
        ServicesService.getAllServices().get(function(response){
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
        vm.serviceType = serviceType;  
        vm.myDesiredService(vm.serviceType);
        $timeout(function(){                   
            $ionicLoading.hide();
          },700)
        
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
                vm.reqTktDataObj.services.push(service);
            }
        });
        // console.log(vm.reqTktDataObj);
         if(vm.reqTktDataObj.services.length > 0 && vm.reqTktDataObj.usrVehicle ){
                TicketService.createTicket().save(vm.reqTktDataObj,function(response){               
                vm.confirmModal.hide();
                vm.modal.hide();
                $ionicLoading.hide();
                $scope.openCheckOutModal(response.data);
                // $timeout(function(){
                //     $ionicLoading.hide();
                //     $scope.successPop('Success', 'Request generated Successfully...'); 
                // },500);
             
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
    // vm.openCheckOutModal = function(datas){
    //     $ionicLoading.show({
    //         template : 'Loading...'
    //     })       
    //   $ionicModal.fromTemplateUrl('templates/modal/check_out_modal.html',{
    //     scope : $scope,
    //     animation : 'slide-in-up',
    //     controller : 'ServiceController',
    //     controllerAs : 'srvcCtrl'
    //   }).then(function(checkoutModal){        
    //     vm.checkoutModal = checkoutModal;
    //     vm.checkoutModal.show();
    //     vm.paymentDatas = datas;
    //     console.log(vm.paymentDatas);
    //     $timeout(function(){
    //         $ionicLoading.hide();

    //       },500)
        
    //   });
    // };
    // vm.closeChekoutModal = function(){
    //     vm.checkoutModal.hide();
    // }
    vm.closeModal = function() {
      vm.modal.hide();
    };
    vm.closeConfirmModal = function(){
        vm.confirmModal.hide();
    };
    // $scope.getPaymentOptions = ["COD","INTERNET"];
    // vm.payments = {};
    // vm.paymentNow = function(){
    //     vm.paymentDatas.tranMode = vm.paymentType;
    //     if(vm.paymentType == "COD"){
    //         $ionicLoading.show({
    //             template : 'Please wait...'
    //         });
    //         PaymentService.codPayment().save(vm.paymentDatas,function(response){
    //             console.log(response);
    //             vm.checkoutModal.hide();
    //             $timeout(function(){
    //                 $ionicLoading.hide();
    //                 $scope.successPop('Success', response.data,'app.mapView'); 
    //             },400);

    //         },function(error){
    //             $ionicLoading.hide();
    //         });
    //     }
    //     if(vm.paymentType == "INTERNET"){
    //         // $scope.alertPop('Error',"Please choose other option .We are currently working on it");
    //         // $ionicLoading.show({
    //         //     template : 'Please wait and donot refresh or press back'
    //         // });
    //         // PaymentService.paymentGatewayPayment().get(vm.paymentDatas,function(response){
    //         //     $ionicLoading.hide();
    //         //     console.log(response);
    //         //     // vm.checkoutModal.hide();
    //         //     // $timeout(function(){
    //         //     //     $ionicLoading.hide();
    //         //     //     $scope.successPop('Success', response.data,'app.mapView'); 
    //         //     // },400);


    //         // },function(error){
    //         //     $ionicLoading.hide();
    //         //     console.log(error);
    //         // });
    //         var req = {
    //             method: 'GET',
    //             url: vm.paymentDatas.pgUrl,
    //         }
    //         $http(req).then(function(response){
    //             console.log(response);
    //         },function(error){
    //             console.log(error);
    //         });
    //     }
    // };
  
})