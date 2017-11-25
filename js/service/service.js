angular.module('serviceModule', ['ngResource'])
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