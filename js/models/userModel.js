app.factory("UserModel",function() {
  var userModel = {};
  var registerData = {};
  return {
    setRegisterData : function(userData){
      registerData = userData;
    },
    getRegisterData : function(userata){
      return registerData;
    }
  }
})
