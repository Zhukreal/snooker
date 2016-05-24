function Game() {
}

function Game_ctor(game, name, table) {
    game.name = name;
    game.table = table;
    game.players = new Array();
    game.players.push(new HumanPlayer("Player 1", gold));
    game.players.push(new HumanPlayer("Player 2", purple));
    game.players[0].join_game(game, table);
    game.players[1].join_game(game, table);
    game.current_player = 0;
}

Game.prototype.set_player_type = function (type, index) {
    var prev = this.players[index];
    var new_player;
    if (type == 'Human') {
        new_player = new HumanPlayer(prev.name, prev.cue_color);
    } else {
        new_player = new ComputerPlayer(prev.name, prev.cue_color);
    }
    this.players[index] = new_player;
    new_player.join_game(this, this.table);
    if (index == this.current_player && type != 'Human') {
        if (this.table.is_stable()) {
            new_player.begin_shot();
        }
    }
}

Game.prototype.player = function () {
    return this.players[this.current_player];
}

Game.prototype.create_ball = function (x, y, color, name) {
    var radius = ball_scale;
    var ysep = (1 + rack_ball_spacing) * radius;
    var xsep = (1 + rack_ball_spacing) * radius * Math.sqrt(3);
    var table = this.table;

    var Dx = x * xsep + radius * rack_ball_spacing * (Math.random() - 0.5);
    var Dy = y * ysep + radius * rack_ball_spacing * (Math.random() - 0.5);

    var ball = new Ball(-.5 - Dx, Dy, radius, color, name);
    table.balls.push(ball);
    return ball;
}


Game.prototype.begin_shot = function (shot) {
    var player = this.players[this.current_player];
    if (this.table.is_stable()) {
        shot.cue_color = player.cue_color;
    } else {
        shot.cue_color = gray;
    }
    //this.current_shot = shot;
}

Game.prototype.ball_struck = function () {
    this.first_collision = null;
    this.cushion_since_first_collision = false;
    this.potted_balls = new Array();
    this.off_table_balls = new Array();
    this.potted_cue_ball = false;
    this.required_first_contact = false;
}

Game.prototype.collision = function (ball1, ball2) {
    if (!this.first_collision) {
        var cue_ball = this.table.cue_ball;
        if (ball1 == cue_ball) {
            this.first_collision = ball2;
        } else if (ball2 == cue_ball) {
            this.first_collision = ball1;
        }
    }
}

Game.prototype.cushion = function (ball, cushion) {
    if (this.first_collision) {
        this.cushion_since_first_collision = true;
    }
}

Game.prototype.potted = function (ball) {
    var cue_ball = this.table.cue_ball;
    if (ball == cue_ball) {
        this.potted_cue_ball = true;
    } else {
        this.potted_balls.push(ball);
        this.cushion_since_first_collision = true;
    }
}

Game.prototype.replace_balls = function (balls) {
    for (i in balls) {
        this.table.replace_ball(balls[i]);
    }
}

Game.prototype.replace_off_table_balls = function () {
    this.replace_balls(this.off_table_balls);
}

Game.prototype.replace_potted_balls = function () {
    this.replace_balls(this.potted_balls);
}

Game.prototype.first_contact_ok = function (ball) {
    var req = this.required_first_contact;
    return !req || req == ball.name;
}

Game.prototype.get_shot_error = function () {

    var table = this.table;
    var error = "";

    var player_name = this.player().name;

    if (this.potted_cue_ball) {
        error = player_name + " potted the cue ball";
        var cue_ball = table.cue_ball;
        table.balls.push(cue_ball);
    } else if (!this.first_collision) {
        error = player_name + " didn't hit any balls";
    } else if (!this.first_contact_ok(this.first_collision)) {
        error = "The first ball " + player_name + " made contact with was a " + this.first_collision.name + " ball, it should have been " + this.required_first_contact;
    } else if (!this.cushion_since_first_collision) {
        error = player_name + " didn't hit a cushion after hitting the object ball";
    }

    return error;
}

Game.prototype.shot_complete = function () {

    var error = this.get_shot_error();
    var table = this.table;

    if (error) {
        this.replace_potted_balls();
        table.ball_in_hand = 1;
        //alert(error + ": your opponent has ball in hand");
    }

    this.replace_off_table_balls();

}


function Game_8ball(table) {
    Game_ctor(this, "8 Ball", table);
}

Game_8ball.prototype = new Game();

Game_8ball.prototype.create_balls = function (radius) {
    this.create_ball(-3, 0, red, "red");
    this.create_ball.style="white";

    this.create_ball(-2, 1, red, "red");
    this.create_ball(-2, -1, red, "red");

    this.create_ball(-1, 2, red, "red");
    this.create_ball(-1, 0, red, "red");
    this.create_ball(-1, -2, red, "red");

    this.create_ball(0, 3, red, "red");
    this.create_ball(0, 1, red, "red");
    this.create_ball(0, -1, red, "red");
    this.create_ball(0, -3, red, "red");

    this.create_ball(1, 4, red, "red");
    this.create_ball(1, 2, red, "red");
    this.create_ball(1, 0, red, "red");
    this.create_ball(1, -2, red, "red");
    this.create_ball(1, -4, red, "red");

    this.create_ball(4, 0, black, "brown")

    this.create_ball(-5, 0, purple, "purple");

    this.create_ball(-16.4, -7, yellow, "yellow");
    this.create_ball(-16.4, 0, orange, "orange");
    this.create_ball(-16.4, 7, _green, "_green");
}


Game_8ball.prototype.super_ball_struck = Game.prototype.ball_struck;
Game_8ball.prototype.ball_struck = function () {
    this.super_ball_struck();
    var player = this.players[this.current_player];

    if (player.ball_color) {
        var table = this.table;
        for (i in table.balls) {
            var ball = table.balls[i];
            if (ball.name == player.ball_color) {
                this.required_first_contact = player.ball_color;
                status_message("Ball Struck", player.name + " (" + player.ball_color + ")");
                return;
            }
        }
        status_message(player.name, "For Victory");
        this.required_first_contact = "eight";
    } else {
        status_message(player.name, " hoping to choose ball color");
    }
}


Game_8ball.prototype.shot_complete = function () {
    var error = this.get_shot_error();
    var table = this.table;
    var potted_8ball = false;
    var red_count = 0;
    var yellow_count = 0;

    var players = this.players;
    var current_player = players[this.current_player];
    var other_player = players[1 - this.current_player];

    for (var i in this.potted_balls) {
        var ball = this.potted_balls[i];
        if (ball.name == "eight") potted_8ball = ball;
        else if (ball.name == "red") red_count++;
        else if (ball.name == "yellow") yellow_count++;
    }

    this.replace_off_table_balls();

    if (error) {
        if (potted_8ball) {
            //alert("YOU LOSE: " + error + ", and you potted the eight ball");
            players = null;
            table.initialize("8 Ball");
        } else {
            //this.replace_potted_balls();
            table.ball_in_hand = 1;
            //alert(error + ": " + other_player.name + " has ball in hand");
            this.current_player = 1 - this.current_player;
        }
    } else if (potted_8ball) {
        if (!this.required_first_contact || this.required_first_contact == "eight") {
            //alert("CONGRATULATIONS, you win: you potted the eight-ball");
        } else {
            //alert("YOU LOSE: you potted the eight ball when required to pot " + this.required_first_contact);
        }
        players = null;
        table.initialize("8 Ball");
    } else if (red_count && !yellow_count) {
        current_player.ball_color = "red";
        other_player.ball_color = "yellow";
    } else if (yellow_count && !red_count) {
        current_player.ball_color = "yellow";
        other_player.ball_color = "red";
    } else if (!current_player.ball_color || (current_player.ball_color == "red" && !red_count) || (current_player.ball_color == "yellow" && !yellow_count)) {
        this.current_player = 1 - this.current_player;
    }

    if (players) {
        var player = players[this.current_player];
        var message = player.name + " ";
        if (player.ball_color) {
            message += "(" + player.ball_color + ")";
        } else {
            message += "(open table)";
        }
        if (table.shot) {
            table.shot.cue_color = player.cue_color;
        }

        status_message("To Shoot", message);
    }

}
Game.prototype.force_position_for_testing = function () {
}


