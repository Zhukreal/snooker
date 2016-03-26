var app = angular.module('GameCtrl', []);

app.controller('GameController', function ($scope) {

    $scope.info = "Game";

    'use strict';

    var random = require('lodash/number/random');
    var randomNegative = require('./utils/randomNegative');
    var randomHexColor = require('./utils/randomHexColor');

    var canvas = document.getElementById('mycanvas');
    var ctx = canvas.getContext('2d');

    var STAGE_WIDTH = canvas.width,
        STAGE_HEIGHT = canvas.height;

    function clear() {
        ctx.clearRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
    }

    function drawCircle(x, y, r, color) {
        if (color) {
            ctx.fillStyle = color;
        }

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();

        ctx.fill();
    }

    function Ball() {
        this.radius = random(10, 50);

        this.x = random(this.radius, STAGE_WIDTH - this.radius);
        this.y = random(this.radius, STAGE_HEIGHT - this.radius);
        this.xVel = random(1, 5) * randomNegative();
        this.yVel = random(1, 5) * randomNegative();
        this.color = randomHexColor();
    }

    Ball.prototype.update = function () {
        this.x += this.xVel;
        this.y += this.yVel;

        if (this.x + this.radius > STAGE_WIDTH) {
            this.xVel = Math.abs(this.xVel) * -1;
        }

        if (this.y + this.radius > STAGE_HEIGHT) {
            this.yVel = Math.abs(this.yVel) * -1;
        }

        if (this.x - this.radius < 0) {
            this.xVel = Math.abs(this.xVel);
        }

        if (this.y - this.radius < 0) {
            this.yVel = Math.abs(this.yVel);
        }
    };

    Ball.prototype.draw = function () {
        drawCircle(this.x, this.y, this.radius, this.color);
    };


    var actors = [];

    for (var i = 0; i < 10; i++) {
        actors.push(new Ball());
    }

    function draw() {
        clear();

        actors.forEach(function (actor) {
            actor.update();
            actor.draw();
        });

        window.requestAnimationFrame(draw);
    }


    window.requestAnimationFrame(draw);


});
