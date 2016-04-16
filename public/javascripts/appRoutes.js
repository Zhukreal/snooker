var app = angular.module('appRoutes', ['ui.router'])
    .config(['$stateProvider', function ($stateProvider) {//, $locationProvider
        $stateProvider
            .state('menu',{
                url:'',
                template: '<h2>Menu</h2>'
            });

        //$locationProvider.html5Mode({
        //    enabled: true,
        //    requireBase: false
        //});
    }]);
