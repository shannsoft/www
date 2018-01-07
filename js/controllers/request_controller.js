app.controller("RequestController",function($ionicModal,$stateParams,$timeout,$state,$scope,$ionicLoading,TicketService){
    var vm = this;
    vm.myOrders = function(){
    TicketService.getRequestTicket().get(function(response){
        console.log(response);
        
        vm.completedOrdersArr = [];
        vm.canceledOrdersArr = [];
       // vm.newOrdersArr = [];
        vm.liveOrdersArr = [];
        vm.futureOrdersArr = [];
        angular.forEach(response.data,function(item){
            if(item.status == "COMPLETED"){
                vm.completedOrdersArr.push(item);
            }
            else if(item.status == "CANCELED"){
                vm.canceledOrdersArr.push(item);
            }else{
                if( moment(item.serviceDate) > moment() ){
                    vm.futureOrdersArr.push(item);
                }
                else {
                    vm.liveOrdersArr.push(item);
                }
            }
        });
        console.log(vm.completedOrdersArr);
        console.log(vm.canceledOrdersArr);
        console.log(vm.liveOrdersArr);
        console.log(vm.futureOrdersArr);
    },function(error){
        console.log(error);
    });
    }
     
 });