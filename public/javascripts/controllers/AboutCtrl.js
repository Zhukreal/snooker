var app = angular.module('AboutCtrl',[]);

app.controller('AboutController', function($scope){
    $scope.hello = "hello,creator!";
    $scope.someAboutInfo = "i\'ma about page";
});
