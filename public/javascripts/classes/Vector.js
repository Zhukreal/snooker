class Vector{ 
    
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
   
    toString(){
        return "[" + this.x + ", " + this.y + " : " + this.magnitude() + " | " + this.angle() + "]";
    }

    clone(){
        return new Vector( this.x, this.y );   
    }

    equals(other, epsilon){
         if (epsilon) {
            return this.distance_from(other) < epsilon;
          }
          return this.x == other.x && this.y == other.y;
    }

    dot_product(other){
        return this.x*other.x + this.y*other.y;
    }    

    squared(){
        return this.dot_product(this); 
    }

    magnitude(){
        return Math.sqrt( this.squared() );
    }    

    angle(){
        return Math.atan2(this.x, this.y);  
    }

    is_null(){
        return this.x == 0 && this.y == 0;   
    }

    zero(){
        this.x = 0;
        this.y = 0;
        return this; 
    }   

    add(other){
        this.x += other.x;
        this.y += other.y;
        return this;  
    }     

    add_scaled(other, scale){
       this.x += other.x * scale;
       this.y += other.y * scale;
       return this; 
    }

    subtract(other){
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    scale(scale){
        this.x *= scale;
        this.y *= scale;
        return this;  
    }    

    scale_down(scale){
       this.x /= scale;
       this.y /= scale;
       return this; 
    }

    unit(){
       var magnitude = this.magnitude();
          if (magnitude != 0) {
            return this.clone().scale_down(magnitude);
          } else {
            return new Vector(0, 0);
          } 
    }

    normal(){
        return new Vector( -this.y, this.x );  
    }

    difference(other){
        return this.clone().subtract( other );
    }    

    distance_from(other){
        return this.difference(other).magnitude();  
    }

    reflect_off(other){
        return other.clone()
    .scale(2 * this.dot_product(other) / other.squared())
    .subtract(this);
    }   

    distance_from_line(line){
          var from_start = this.difference(line.start);
          var from_end = this.difference(line.end);
          var start_to_end = line.end.difference(line.start);

          var distance_start_to_end = start_to_end.magnitude();
          var distance_from_start = from_start.magnitude();
          var distance_from_end = from_end.magnitude();

          if (distance_from_start > distance_start_to_end ||
              distance_from_end > distance_start_to_end) {
            return null;
          }

          var angle_from_this = from_start.angle();
          var angle_to_end = start_to_end.angle();
          var angle_from_start = angle_from_this - angle_to_end;
          return Math.abs(distance_from_start * Math.sin(angle_from_start));

    }

}

function polar_vector( mag, angle ) {
    return new Vector( mag * Math.sin(angle), mag * Math.cos(angle));
}




