var white = "#ffffff";
var red = "#ff0000";
var yellow = "#ffff00";
var green = "#00ff00";
var black = "#000000";
var gray = "#808080";
var orange = "#EEAC41";
var blue = "#0000ff";
var cyan = "#00ffff";
var _green = "#106E19";

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

function Table () {
    this.update_id = null;
    this.shot = null;
};


Table.prototype.initialize = function ( game ) {
  this.balls = new Array();
  this.pockets = new Array();
  this.cushions = new Array();

  this.pockets.push(new Pocket(this, -1, -.5, ball_scale, pocket_scale));
  this.pockets.push(new Pocket(this, -1,  .5, ball_scale, pocket_scale));
  this.pockets.push(new Pocket(this,  0, -.5, ball_scale, pocket_scale));
  this.pockets.push(new Pocket(this,  0,  .5, ball_scale, pocket_scale));
  this.pockets.push(new Pocket(this,  1, -.5, ball_scale, pocket_scale));
  this.pockets.push(new Pocket(this,  1,  .5, ball_scale, pocket_scale));

  this.cushions.push( new Cushion( -1, 0.5, 1, Math.PI/2, ball_scale*pocket_scale ) );
  this.cushions.push( new Cushion( 0, 0.5, 1, Math.PI/2, ball_scale*pocket_scale ) );
  this.cushions.push( new Cushion( 0, -0.5, 1, -Math.PI/2, ball_scale*pocket_scale ) );
  this.cushions.push( new Cushion( 1, -0.5, 1, -Math.PI/2, ball_scale*pocket_scale ) );
  this.cushions.push( new Cushion( 1, 0.5, 1, Math.PI, ball_scale*pocket_scale ) );
  this.cushions.push( new Cushion( -1, -0.5, 1, 0, ball_scale*pocket_scale ) );


  this.cue_ball = new Ball( .5, -3, ball_scale, white, "cue" );
  this.balls.push( this.cue_ball );
  this.ball_in_hand = 1;
  this.is_break_shot = false;

  status_message( "game", game );


    this.game = new Game_8ball( this );
    this.is_break_shot = true;


  this.game.create_balls( ball_scale );
  this.game.force_position_for_testing();
}

Table.prototype.legal_ball_in_hand_bounding_box = function() {
  if (this.is_break_shot) {
    return { 'left': 0.5 - this.cue_ball.radius, 'right': +1, 'top': -.5, 'bottom' : +.5 };
  } else {
    return { 'left': -1, 'right': +1, 'top': -.5, 'bottom' : +.5 };
  }
}

Table.prototype.player = function() {
  return this.game.player();
}



Table.prototype.replace_ball = function ( ball ) {

    ball.stop();
    var x = -0.5;
    var direction = -1;
    var done = 0;
    count = 50;

    while (!done) {
        if (--count == 0) done = 1;
        if (direction == -1 && x < -1+ball.radius) {
            x = -0.5;
            direction = 1;
        }
        else if (direction == 1 && x > 1-ball.radius) {
            x = -0.5;

            done = 1;
        }
        else {
            ball.position = new Vector( x, 0 );
            var other = ball.find_overlapping_ball( this.balls );
            if (other != null) {
                var Dy = other.position.y;
                var h = ball.radius + other.radius;
                var Dx = Math.sqrt( h*h - Dy*Dy ) + rack_ball_spacing;
                x = other.position.x + Dx * direction;
            }
            else {
                done = 1;
            }
        }
    }

    ball.position = new Vector( x, 0 );
    this.balls.push(ball);
}

Table.prototype.begin_shot = function () {
  this.game.force_position_for_testing();
  this.shot = new Shot(this);
  this.game.begin_shot(this.shot);
  return this.shot;
}

Table.prototype.commit_shot = function () {
  if (!this.shot) return;
  this.shot.commit();
  this.game.ball_struck();
  this.shot = null;
  this.is_break_shot = false;
  this.do_action();
}

Table.prototype.draw = function () {
    var ctx = this.ctx;

    ctx.fillStyle = white;
    ctx.beginPath();
    ctx.rect( -1.5, -1, 3, 2 );
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = white;
    ctx.beginPath();
    ctx.rect( -1.2, -0.7, 2.4, 1.4 );
    ctx.closePath();
    ctx.fill();

    var outer = ball_scale * pocket_scale * Math.SQRT2;
    ctx.fillStyle = green;
    ctx.beginPath();
    ctx.rect( -1-outer, -0.5-outer, 2+2*outer, 1+2*outer );
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = black;
    ctx.lineWidth = 0.005;
    ctx.beginPath();
    ctx.moveTo( 0.5, 0.5 );
    ctx.lineTo( 0.5, -0.5 );
    ctx.moveTo( 0.5, 0.25 );
    ctx.arc( 0.5, 0, 0.25, Math.PI*0.5, Math.PI*-0.5, true );
    ctx.closePath();
    ctx.stroke();

    for (pocket in this.pockets) {
        this.pockets[pocket].draw( ctx );
    }

    for (cushion in this.cushions) {
        this.cushions[cushion].draw( ctx );
    }

    var inner = outer / 2;
    ctx.fillStyle = brown;
    ctx.beginPath();
    ctx.moveTo( -1-inner, -0.5-inner );
    ctx.lineTo( -1-inner, +0.5+inner );
    ctx.lineTo( +1+inner, +0.5+inner );
    ctx.lineTo( +1+inner, -0.5-inner );
    ctx.moveTo( +1+outer, -0.5-outer );
    ctx.lineTo( +1+outer, +0.5+outer );
    ctx.lineTo( -1-outer, +0.5+outer );
    ctx.lineTo( -1-outer, -0.5-outer );
    ctx.lineTo( +1+outer, -0.5-outer );
    ctx.moveTo( +1+inner, -0.5-inner );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();


    for (ball in this.balls) {
        this.balls[ball].draw( ctx );
    }

    if (this.shot) {
        this.shot.draw( ctx );
    }
}

Table.prototype.update = function () {
    for (i in this.balls) {
        this.balls[i].begin_update();
    }

    for (i in this.balls) {
        var ball_i = this.balls[i];
        for (j in this.balls) {
            if (i != j) {
                var ball_j = this.balls[j];
                if (ball_i.do_collision( ball_j )) {
                    this.game.collision( ball_i, ball_j );
                }
            }
        }
    }

    for (var i = 0; i < this.balls.length; i++) {
        var ball = this.balls[i];
        var cushion = ball.do_cushion( this );
        if (cushion) {
            this.game.cushion( ball, cushion  );
        }
    }

    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].do_friction();
    }

    var potted = new Array();
    for (var i = 0; i < this.balls.length; i++) {
        if (this.balls[i].is_potted( this.pockets )) {
            this.balls[i].stop();
            potted.push(i);
        }
    }
    while (potted.length) {
        var i = potted.shift();
        this.game.potted(this.balls[i]);
        this.balls[i] = this.balls[0];
        this.balls.shift();
    }

    var off_table = new Array();
    for (var i = 0; i < this.balls.length; i++) {
      if (!this.balls[i].end_update(this)) {
        this.balls[i].stop();
        off_table.push(i);
      }
    }
    while (off_table.length) {
      var i = off_table.shift();
      this.game.off_table_balls.push(this.balls[i]);
      this.balls[i] = this.balls[0];
      this.balls.shift();
    }
}

Table.prototype.is_stable = function () {
  for (i in this.balls) {
    if (!this.balls[i].is_stable()) return false;
  }
  return true;
}

Table.prototype.do_action = function () {

    var table = this;

    function update_fn() {
        table.update();
    }

    if (table.update_id == null) {
        table.update_id = setInterval( update_fn, 10 );
    }

}

Table.prototype.path_blocked = function(ball_at_start, start_position, target, ball_at_target) {
  var balls = this.balls;
  var path = new Line(start_position, target);
  for (var i = 0; i < balls.length; i++) {
    var ball = balls[i];
    if (ball != ball_at_start && ball != ball_at_target &&
        ball.blocks_path(path)) {
      return true;
    }
  }
  var cushions = this.cushions;
  for (var i = 0; i < cushions.length; i++) {
    if (cushions[i].blocks_path(path, ball_at_start)) {
      return true;
    }
  }

  return false;
}



