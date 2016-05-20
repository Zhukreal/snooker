var app = angular.module('AboutCtrl',[]);

app.controller('AboutController', function($scope){
    $scope.hello = "hello,creator!";
    $scope.someAboutInfo = "i\'ma about page";

    var socket = io.connect("localhost:8080/about");

    socket
        .on('firstEvent', function(data){
            console.log(data);
        })

});
