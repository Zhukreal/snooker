class Queue{

	constructor(){
		this.queue = [];
		this.offset = 0;
	}

 	getArray(){
 		return this.queue;
 	}

 	getLength(){
 		return (this.queue.length - this.offset);
 	}

 	isEmpty(){
 		return (this.queue.length == 0);
 	}

 	enqueue(item){
 		 this.queue.push(item);
 	}

 	dequeue(){

    if (this.queue.length == 0) return undefined;
    	var item = this.queue[this.offset];
    if (++ this.offset * 2 >= this.queue.length){
       this.queue  = this.queue.slice(this.offset);
       this.offset = 0;
    }
	    return item;
 	}

 	peek(){
 		return (this.queue.length > 0 ? this.queue[this.offset] : undefined);
 	}


}