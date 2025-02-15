export class Ship{
    constructor(length){
        this.length = length;
        this.hitCounts = 0;
    }
    recordHit(){
        this.hitCounts++;
    }
    isSunk(){
        return this.hitCounts >= this.length;
    }
}