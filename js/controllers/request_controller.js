app.controller("RequestController",function($ionicModal,$stateParams,$timeout,$state,$scope,$ionicLoading,TicketService){
    var vm = this;
    vm.myOrders = function(){
    TicketService.getRequestTicket().get(function(response){
        
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
                    // vm.liveOrdersArr.push(item);
                }
            }
        });
    },function(error){
        console.log(error);
    });
};

    vm.myCartOrders = function(){
        vm.cartOrders = {};
        TicketService.getCardOrders().get(function(response){
            console.log(response);
            vm.cartOrders = response.data;
            vm.totalPrice = 0;
            angular.forEach(vm.cartOrders, function(item){
               vm.totalPrice = vm.totalPrice + item.amount;                
               
            });
        },function(error){

        });
    };
    vm.getTotalPrice = function(selection){
        console.log(selection);
        TicketService.getCardOrders().get(function(response){
            vm.totalPrice = 0;
            angular.forEach(response.data, function(item){
                if(selection){
                    vm.totalPrice = selection.amount;
                }
                else {
                    vm.totalPrice = vm.totalPrice + item.amount;
                }               
            });
        },function(error){

        }); 
    }
    vm.buyFromCart = function(){
        console.log(vm.cartSelection);
    };
    vm.removeFromCart = function(cartId){
        $ionicLoading.show({
            template : 'Removing...'
        });
        console.log(cartId);
        TicketService.removeFromCart(cartId).delete(function(response){
            console.log(response);
            vm.cartOrders = response.data;
            $timeout(function(){
                $ionicLoading.hide();
                $scope.successPop('Success', 'Removed from cart...','app.cart'); 
            },500);
        },function(error){
            $ionicLoading.hide();
            console.log(error);
        });
    }
 });