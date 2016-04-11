var app = angular.module('MainCtrl',['ngCookies']);

app.controller('MainController', function($scope){
    $scope.hello = "hello,creator!";
    console.log($cookies.getAll());
});
