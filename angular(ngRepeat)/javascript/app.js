var tablesApp = angular.module('tablesApp', ['ngRoute', 'ngResource']);

tablesApp.config(function ($routeProvider) {

   $routeProvider
    .when('/table_'+'{{count}}', {
      templateUrl: 'template/'+'{{count}}'+'.html',
      controller: 'tablesCtrl'
    })
  
   /* 
    .when('/table_1', {
      templateUrl: 'template/2.html',
      controller: 'first'
    })
    .when('/table_2', {
      templateUrl: 'template/3.html',
      controller: 'second'
    })
    // .when('/tables/table_2', {
    //   templateUrl: 'template/3.html',
    //   controller: 'second'
    // })
    .when('/tables/:tableid', {
      templateUrl: 'template/tablenumber.html',
      controller: 'tablesRand'
    })*/
  /*  .otherwise({
      template: '<h1>404 no such page</h1>'
     
    });*/
});

tablesApp.controller('tablesCtrl', function($scope, $http){
 /* $http.get('json/tables.json').success(function(data){
    $scope.tables = data;
  });

  $scope.setImage = function(imageUrl){
    $scope.mainImageUrl = imageUrl;
  }*/

  $scope.maxIndex = 7;
    $scope.count=1;

    $scope.pagenext = function()
    { 
      if($scope.count<$scope.maxIndex)
      $scope.count+=1;

    }
    $scope.pageprev = function()
    {if($scope.count>1)
      $scope.count-=1;
    }
});

tablesApp.controller('tablesRand', ['$scope', '$http', '$location', '$routeParams',  function($scope, $http, $location, $routeParams){
    $scope.tableid = $routeParams.tableid;
}]);

tablesApp.controller('first', ['$scope', '$http', '$location',  function($scope, $http, $location){

}]);

tablesApp.controller('second', ['$scope', '$http', '$location',  function($scope, $http, $location){

}]);
