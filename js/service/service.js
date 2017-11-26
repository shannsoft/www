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
.factory('loginService', function ($resource,CONFIG) {
    return{
        signin: function () {
            return $resource( CONFIG.HTTP_HOST +'login',{
              save:{method:'POST'}
            })
        },
        delete: function () {
            return $resource( CONFIG.HTTP_HOST_APP +'employee/delete/11',{
              get:{method:'GET'}
            })
        },
    }
});