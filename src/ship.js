export class Ship{
    constructor(length, id){
        this.length = length;
        this.hitCounts = 0;
        this.id = id;
    }
    recordHit(){
        this.hitCounts++;
        return this.hitCounts;
    }
    isSunk(){
        return this.hitCounts >= this.length;
    }
}