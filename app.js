var app = angular.module('crapperNews', []);

app.controller('MainCtrl', [
  '$scope',
  function($scope) {
    $scope.test = 'Hello World!';
  }
]);
