angular.module('messenger.controllers', [])

.controller('LoginController', function ($scope, $state, AlertPopup) {
  $scope.login = function() {
    var alert = new AlertPopup('Thanks for trying!', 'We\'re working on authentication :)');
    alert.then(function(){
      $state.go('app.tabs.recent');
    })
  };
})

.controller('SettingsController', function($scope, $state, $ionicActionSheet, AlertPopup){
  $scope.logout = function() {
   var hideSheet = $ionicActionSheet.show({
      titleText: 'Are you sure?',
      destructiveText: 'Log out',
      cancelText: 'Cancel',
      cancel: function() {
         },
      destructiveButtonClicked: function() {
        hideSheet();
        return alertCallback();
      }
    });
  };
  function alertCallback(){
    var alert = new AlertPopup('Thanks for trying!', 'We\'re working on authentication :)');
    return alert.then(function(){
      $state.go('app.login');
    });
  }
});