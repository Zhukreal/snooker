var canvas = document.createElement('canvas');

document.body.appendChild(canvas);

var ctx = canvas.getContext('2d');
canvas.style.width = "820px";
canvas.style.height = "420px";
canvas.style.top = "200px";

ctx.fillStyle = 'green';
ctx.fillRect(10, 10, 320, 480);
var img = document.createElement('img');
img.setAttribute('src', '/images/_ball.png');
img.style.width = "20px";
img.style.height = "20px";
img.style.position = "absolute";
img.style.left = "620px";
img.style.top = "210px";
img.setAttribute('id', "ball");
document.body.appendChild(img);


var ball = document.getElementById("ball");


ball.onmousedown = function (e) { // 1. отследить нажатие

    // подготовить к перемещению
    // 2. разместить на том же месте, но в абсолютных координатах
    ball.style.position = 'absolute';
    moveAt(e);
    // переместим в body, чтобы мяч был точно не внутри position:relative
    document.body.appendChild(ball);

    ball.style.zIndex = 1000; // показывать мяч над другими элементами

    // передвинуть мяч под координаты курсора
    // и сдвинуть на половину ширины/высоты для центрирования
    function moveAt(e) {
        ball.style.left = e.pageX - ball.offsetWidth / 2 + 'px';
        ball.style.top = e.pageY - ball.offsetHeight / 2 + 'px';
    }

    // 3, перемещать по экрану
    document.onmousemove = function (e) {
        moveAt(e);
    }

    // 4. отследить окончание переноса
    ball.onmouseup = function () {
        document.onmousemove = null;
        ball.onmouseup = null;
    }
}
ball.ondragstart = function () {
    return false;
};