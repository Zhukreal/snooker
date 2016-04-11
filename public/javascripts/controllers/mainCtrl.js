var app = angular.module('MainCtrl',['ngCookies']);

app.controller('MainController', function($scope, $cookies){
    $scope.hello = "hello,creator!";
    $cookies.put("name","e20r432");
    console.log($cookies.getAll());
    console.log($cookies.get("connect.sid"));
});
