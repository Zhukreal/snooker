class Pocket {

    constructor(table, x, y, ball_scale, pocket_scale) {
        this.table = table;
        this.position = new Vector(x, y);
        this.radius = ball_scale * pocket_scale;
        var aimpoint_vector = new Vector(0, 0);
        if (x > 0) {
            aimpoint_vector.x = -1;
        } else if (x < 0) {
            aimpoint_vector.x = 1;
        }

        if (y > 0) {
            aimpoint_vector.y = -1;
        } else if (y < 0) {
            aimpoint_vector.y = 1;
        }

        this.aimpoint_vector = aimpoint_vector.unit();
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = black;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    shot_would_pot_cueball(shot_candidate) {
        var cueball = shot_candidate.cueball;
        var aimpoint = shot_candidate.aimpoint;
        var object_ball = shot_candidate.object_ball;
        var cueball_destination = shot_candidate.cueball_destination;
        var pocket_aimpoint = this.get_aimpoint(object_ball);

        if (pocket_aimpoint.distance_from(object_ball.position) < object_ball.radius ||
            this.position.distance_from(object_ball.position) < object_ball.radius) {
            return false;
        }

        var path = new Line(aimpoint, cueball_destination);

        var distance_from_pocket = this.position.distance_from_line(path);
        if (distance_from_pocket != null &&
            distance_from_pocket < this.radius + cueball.radius) {
            return true;
        }

        var distance_from_pocket_aimpoint = pocket_aimpoint.distance_from_line(path);
        if (distance_from_pocket_aimpoint != null &&
            distance_from_pocket_aimpoint < this.radius) {
            return true;
        }

        return false;
    }


    get_aimpoint(ball) {
        var table = this.table;
        var aimpoint = this.position.clone();
        var delta = this.aimpoint_vector;
        var radius = this.radius + ball.radius * 2;
        var scale = radius / 20;

        for (var i = 0; i < 20; i++) {
            if (!table.path_blocked(ball, ball.position, aimpoint, null)) {
                return aimpoint;
            }

            aimpoint.add_scaled(delta, scale);
        }
        return aimpoint;
    }

}

//export {Pocket}