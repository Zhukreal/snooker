var lol = 'lol';

/*
var white = "#ffffff";
var red = "#ff0000";
var yellow = "#ffff00";
var green = "#00ff00";
var black = "#000000";
var gray = "#808080";

var blue = "#0000ff";
var cyan = "#00ffff";

var purple = "#ff00ff";
var gold = "#ffff80";
var orange = "#ffa000";
var darkgreen = "#008000";
var brown = "#808040";

var show_targetting_line = 1;
var game = "8 Ball";

var table_scale = 0.7;
var ball_scale = table_scale / 20;
var pocket_scale = 1.5;
var rack_ball_spacing = 0.01;

var skimming_friction = 1 / 400;
var rolling_threshold = skimming_friction * 30;
var rolling_friction = skimming_friction / 20;
var static_threshold = rolling_friction * 10;

var strength_scaling = 2.5;
var masse_scaling = 1;

function status_message(prefix, msg) {
    var elem = document.getElementById("msg");
    var txt = prefix;
    if (msg != null) {
        txt += ": " + msg;
    }
    elem.innerHTML = txt;
}

function append_status_message(prefix, msg) {
    var elem = document.getElementById("msg");
    elem.innerHTML += "<br>" + prefix + ": " + msg;
}


var draw_id = null;


var current_game;
function set_player_type(form, index) {
    if (!current_game) return;
    var type_rb = document.getElementsByName(form);
    for (var i = 0; i < type_rb.length; ++i) {
        if (type_rb[i].checked) {
            current_game.set_player_type(type_rb[i].value, index);
        }
    }
}


function init_pool_table(name) {

    var div = document.getElementById(name);


    var table;
    var canvas_name = name + "_canvas";

    function set_drawing_context() {
        var width = window.innerWidth - 16;
        if (width < 300) width = 300;
        var height = width / 2;

        var canvas_html = "<canvas";
        canvas_html += " id=" + canvas_name;
        canvas_html += " width=" + width;
        canvas_html += " height=" + height;
        canvas_html += ">Sorry, your browser doesn't appear to support the HTML-5 Canvas</canvas>";
        div.innerHTML = canvas_html;

        var canvas = document.getElementById(canvas_name);
        if (!canvas) return;
        var ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (!table) {
            table = new Table();
            table.initialize(game);
        }


        ctx.translate(width / 2, height / 2);
        ctx.scale(height * table_scale, height * table_scale);

        table.ctx = ctx;

        var canvas_offset = new Vector(
            canvas.offsetLeft + width / 2,
            canvas.offsetTop + height / 2
        );

        function mouse_vec(evt) {
            var vec = new Vector(evt.clientX + window.scrollX, evt.clientY + window.scrollY);
            vec.subtract(canvas_offset);
            vec.scale_down(height * table_scale);
            return vec;
        }

        function mouse_down(evt) {
            evt.preventDefault();
            table.player().mouse_down(mouse_vec(evt));
        }

        function mouse_up(evt) {
            evt.preventDefault();
            table.player().mouse_up(mouse_vec(evt));
        }

        function mouse_move(evt) {
            evt.preventDefault();
            table.player().mouse_move(mouse_vec(evt));
        }

        canvas.addEventListener('touchstart', mouse_down, false);
        canvas.addEventListener('touchend', mouse_up, false);
        canvas.addEventListener('touchmove', mouse_move, false);
        canvas.addEventListener('mousedown', mouse_down, false);
        canvas.addEventListener('mouseup', mouse_up, false);
        canvas.addEventListener('mousemove', mouse_move, false);
    }

    set_drawing_context();

    if (table) {
        window.onresize = set_drawing_context;


    }


    function draw_fn() {
        table.draw();
        if (current_game != table.game) {
            current_game = table.game;
            set_player_type("player1_type", 0);
            set_player_type("player2_type", 1);
        }
        if (table.is_stable() && table.update_id != null) {
            clearInterval(table.update_id);
            table.update_id = null;
            table.game.shot_complete();
            table.player().begin_shot();
        }
    }

    if (draw_id == null) {
        draw_id = setInterval(draw_fn, 50);
    }

}
*/
