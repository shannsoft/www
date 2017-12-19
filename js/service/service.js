angular.module('serviceModule', ['ngResource'])
.factory('config',function($http){
    var gApi = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
    var gApiKey = "AIzaSyBKH-ESKu39LGz3Q9Uc4GIZTUdhAlhl0gE";
    return{
        getLocationName : function(param){
            var url = gApi+param+"&key="+gApiKey;
            var response = $http.get(url);
            return response;
        }
    }
})
.factory('loginService', function ($resource,CONFIG,$http) {
    return{

        loginOAuth: function (contactNbr,password) {
            return $resource( CONFIG.HTTP_HOST_APP_OAUTH +'/gsg/oauth/token?grant_type=password&username=' + contactNbr + '&password=' + password,{
              save:{method:'POST'}
            })
        },
        saveEmployee: function () {
            return $resource( CONFIG.HTTP_HOST_APP +'/employee/addEmp',{
              save:{method:'POST'}
            })
        },
    }
})
.factory('registrationService', function ($resource,CONFIG) {
    return{
        getOtp: function (contact_no) {
            return $resource( CONFIG.HTTP_HOST_APP +'/user/sendOtp/' + contact_no,{
              save:{method:'POST'}
            })
        },
        verifyOtp:function(contact_no,otp){
            return $resource(CONFIG.HTTP_HOST_APP +'/user/verifyOtp/' + contact_no + '/' + otp,{
                save:{method:'POST'}
            })
        },
        register: function(){
            return $resource(CONFIG.HTTP_HOST_APP + '/gsg/register',{
                save:{method:'POST'}
            })
        },
        addUserDetails: function(){
            return $resource(CONFIG.HTTP_HOST_APP + '/user/addUserDetail',{
                save:{method:'POST'}
            })
        },
        addVehicle: function(){
            return $resource(CONFIG.HTTP_HOST_APP + '/user/addVehicle',{
                save:{method:'POST'}
            })
        },
        addInsuranceDetail:function(){
            return $resource(CONFIG.HTTP_HOST_APP + '/user/addInsurance',{
                save:{method:'POST'}
            })
        }
       
    }
});
