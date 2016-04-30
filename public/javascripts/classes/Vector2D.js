class Vector2D{ 
    // toString(){ 
    // } 
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
        length(){ 
            return Math.sqrt(this.x * this.x + this.y * this.y); 
        } 

        dot(that){
            return this.x*that.x + this.y*that.y;
        }

        cross(that) {
            return this.x*that.y - this.y*that.x;
        }

        unit() {
            return this.divide( this.length() );
        }

        unitEquals() {
             this.divideEquals( this.length() );
             return this;
        }

        add(that) {
            return new Vector2D(this.x + that.x, this.y + that.y);
        }

        addEquals(that) {
            this.x += that.x;
            this.y += that.y;

            return this;
        }
        
        subtract(that){
            return new Vector2D(this.x - that.x, this.y - that.y);
        }

        subtractEquals(that){
            this.x -= that.x;
            this.y -= that.y;

            return this;
        }

        multiply(scalar){
            return new Vector2D(this.x * scalar, this.y * scalar);
        }

        multiplyEquals(scalar){
            this.x *= scalar;
            this.y *= scalar;

            return this;
        }

        divide(scalar){
            return new Vector2D(this.x / scalar, this.y / scalar);
        }

        divideEquals(scalar){
            this.x /= scalar;
            this.y /= scalar;

            return this;
        }

        perp(){
            return new Vector2D(-this.y, this.x);
        }

        perpendicular(that){
            return this.subtract(this.project(that));
        }

        project(that){
            var percent = this.dot(that) / that.dot(that);

             return that.multiply(percent);
        }

        toString(){
            return this.x + "," + this.y;
        }

        normalize(){
            var l = this.length();
            var result = new Vector2D(this.x / l, this.y / l);

             if (result.x == null || result.y == null)
                l = l;
                 return result;
        }

}

Vector2D.fromPoints = function(p1, p2) {
    return new Vector2D(
        p2.x - p1.x,
        p2.y - p1.y
    );
}






