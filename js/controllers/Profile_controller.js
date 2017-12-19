app.controller("ProfileController",function($scope,$state,$ionicModal,$cordovaCamera,$localStorage,$ionicActionSheet,$cordovaImagePicker){
    var vm = this;
    vm.profile_image = ($localStorage.profile) ? $localStorage.profile : "img/placeholder.jpg"
    vm.user = {
      'fname':"amar",
      'mobile':"7540951096",
      'maritalStatus':"1"
    };
    vm.changePass = {
        'newPassword':"",
        'rePassword':"",
    }
    vm.changePassword = function(){
        $ionicModal.fromTemplateUrl('templates/modal/change_password_modal.html',{
            scope : $scope,
            animation:'slide-in-right'
        }).then(function(modal){
            vm.modal = modal;
            modal.show();
        });
    }
    vm.closeModal = function() {
        vm.modal.hide();
    }
    vm.changePwd = function(){
        console.log(vm.changePass );
    }
    vm.checkPassword = function(before,after){
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>" + before,after);
        vm.showPasswordMisMatch = false;
        if(before !== after){
        vm.showPasswordMisMatch = true;
        }
        return vm.showPasswordMisMatch;
    }
    /*******************************************************************************/
  /************************get image from camera**********************************/
  /*******************************************************************************/
  vm.showOptions = function(){
    var optionSheet = $ionicActionSheet.show({
        buttons:[
            {text:'<b>Camera</b'},
            {text:'<b>Gallery</b>'}
        ],
        titleText:'Select a way to upload',
        cancelText:'cancel',
        cancel: function(){
            console.log("cancelled");
        },
        buttonClicked: function(index){
            if(index == 0){
                console.log("camera is choosen");
                vm.openCamera();
            }
            if(index == 1){
                console.log("gallery is choosen");
                vm.openGallery();
            }
            return true;
        }

    })

  }
  vm.openCamera = function(){
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };
    $cordovaCamera.getPicture(options).then(function(imageData) {
        vm.profile_image = "data:image/png;base64," + imageData;
        delete $localStorage.profile;
        $localStorage.profile = vm.profile_image;
    }, function(err) {});
  };
  /*******************************************************************************/
  /************************get image from gallery**********************************/
  /*******************************************************************************/
  vm.openGallery = function() {
    var option = {
      maximumImagesCount: 1,
      width: 800,
      height: 800,
      quality: 80
    };
    $cordovaImagePicker.getPictures(option).then(function(results) {
        for (var i = 0; i < results.length; i++) {
          var img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = function() {
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var dataURL;
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            vm.profile_image = canvas.toDataURL('image/png');
            $localStorage.profile = vm.profile_image;
          }
          img.src = results[i];
        }
      }, function(error) {
        $ionicLoading.hide();
      });
  };
});