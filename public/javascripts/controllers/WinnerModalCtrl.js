/*'use strict';*/

angular.module('GameApp')
    .controller('WinnerModalCtrl', function ($scope, $modalInstance, winner) {
        $scope.winner = winner;

        $scope.cancel = function () {
            $modalInstance.dismiss('Game over');
        };
    });
