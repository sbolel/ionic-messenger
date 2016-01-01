angular.module('messenger.controllers', [])

.controller('LoginController', function ($scope, $state, $ionicPopup, AUTHSTATE) {
  var AlertPopup = function(){
    var popup = $ionicPopup.alert({
      title: 'Uh oh!',
      template: 'Something went wrong!'
    });
    return popup;
  };
  $scope.login = function() {
  };
})

.controller('SettingsController', function($scope, $state, $ionicActionSheet){
  $scope.show = function(callback) {
   var hideSheet = $ionicActionSheet.show({
      destructiveText: 'Log out',
      titleText: 'Are you sure?',
      cancelText: 'Cancel',
      cancel: function() {
         },
      destructiveButtonClicked: function() {
        return callback();
      }
    });
  };
 
  $scope.logout = function(){
    $scope.show();
  };
});