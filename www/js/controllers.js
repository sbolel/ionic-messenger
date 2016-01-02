angular.module('messenger.controllers', [])

.controller('LoginController', function ($scope, $state, $ionicPopup) {
  var AlertPopup = function(title, template){
    var popup = $ionicPopup.alert({
      title: title || 'Uh oh!',
      template: template || 'Something went wrong!'
    });
    return popup;
  };
  $scope.login = function() {
    var alert = new AlertPopup('Thanks for trying!', 'We\'re working on authentication :)');
    alert.then(function(){
      $state.go('app.tabs.recent');
    })
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