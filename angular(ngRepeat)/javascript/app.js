var tablesApp = angular.module('tablesApp', ['ngRoute', 'ngResource']);

tablesApp.config(function ($routeProvider) {
    $routeProvider
    .when('/tables', {
      templateUrl: 'template/tables.html',
      controller: 'tablesCtrl'
    })
    .when('/table_1', {
      templateUrl: 'template/2.html',
      controller: 'first'
    })
    .when('/table_2', {
      templateUrl: 'template/3.html',
      controller: 'second'
    })
    // .when('/tables/:tableid', {
    //   templateUrl: 'template/tablenumber.html',
    //   controller: 'tablesRand'
    // })
    .otherwise({
      redirectTo: '/'
    });
});

tablesApp.controller('tablesCtrl', function($scope, $http){
  $http.get('json/tables.json').success(function(data){
    $scope.tables = data;
  });

  $scope.setImage = function(imageUrl){
    $scope.mainImageUrl = imageUrl;
  }

});

// tablesApp.controller('tablesRand', ['$scope', '$http', '$location', '$routeParams',  function($scope, $http, $location, $routeParams){
//     $scope.tableid = $routeParams.tableid;
// }]);
//
tablesApp.controller('first', ['$scope', '$http', '$location',  function($scope, $http, $location){

}]);

tablesApp.controller('second', ['$scope', '$http', '$location',  function($scope, $http, $location){

}]);
