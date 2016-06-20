angular.module('messenger.services', [])

.factory('AlertPopup', function($ionicPopup){
  return function(title, template){
    var popup = $ionicPopup.alert({
      title: title || 'Uh oh!',
      template: template || 'Something went wrong!'
    });
    return popup;
  };
});