var app = angular.module('appRoutes', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {//, $locationProvider
        $routeProvider
            .when('/', {
                templateURL: 'views/index.ejs',
                controller: 'MainController'
            })
            .when('/about', {
                templateURL: 'views/about.ejs',
                controller: 'AboutController'
            })
            .when('/game', {
                templateUR: 'views/game.ejs',
                controller: 'GameController'
            })
            .otherwise({
                redirectTo: '/'
            });

        //$locationProvider.html5Mode({
        //    enabled: true,
        //    requireBase: false
        //});
    }]);
