function Player() {}

function Player_ctor(player, name, cue) {
  player.name = name;
  player.ball_color = false;
  player.cue_color = cue;
}

Player.prototype.join_game = function(game, table) {
  this.game = game;
  this.table = table;
}

Player.prototype.mouse_down = function(vec) {}
Player.prototype.mouse_up = function(vec) {}
Player.prototype.mouse_move = function(vec) {}

Player.prototype.begin_shot = function() {
  this.table.begin_shot();
}


function HumanPlayer(name, cue) {
  Player_ctor(this, name, cue);
}

HumanPlayer.prototype = new Player();

HumanPlayer.prototype.mouse_down = function(vec) {
  var table = this.table;
  if (!table.is_stable()) return;
  if (!table.shot) {
    this.begin_shot();
  }
  if (!table.ball_in_hand) {
    var cue_ball = table.cue_ball;
    if (vec.distance_from(cue_ball.position) < cue_ball.radius) {
      table.shot.set_cueball_strikepoint(cue_ball, vec);
    }
  }
}

HumanPlayer.prototype.mouse_up = function(vec) {
  var table = this.table;
  if (table.ball_in_hand) {
    var cue_ball = table.cue_ball;
    cue_ball.position = vec;
    if ( cue_ball.is_legal_ball_in_hand_position(table) ) {
      table.ball_in_hand = 0;
    }
  }
  else if (table.shot) {
    table.shot.adjust( vec );
    table.commit_shot();
  }
}

HumanPlayer.prototype.mouse_move = function(vec) {
  var table = this.table;
  if (table.ball_in_hand) {
    table.cue_ball.position = vec;
  }
  else if (table.shot && table.shot.start) {
    table.shot.adjust( vec );
  }
}


