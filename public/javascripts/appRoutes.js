angular.module('appRoutes',[])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
        $routeProvider
            .when('/',{
                templateURL: 'views/index.ejs',
                controller: 'MainController'
            });

        $locationProvider.html5Mode(true);
    }]);
