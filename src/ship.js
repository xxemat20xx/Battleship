class Ship{
    constructor(length){
        this.length = length;
        this.hits = 0;
    }
    hit(){
        this.hits++;

    }
    isSunk(){
        return this.hits >= this.length;
       
    }
}
export default Ship;