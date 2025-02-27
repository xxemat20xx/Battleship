export class Ship {
  constructor(length, id) {
    this.length = length;
    this.id = id;
    this.hitCounts = 0;
  }

  recordHit() {
    this.hitCounts++;
    return this.hitCounts;
  }

  isSunk() {
    return this.hitCounts >= this.length;
  }
}
