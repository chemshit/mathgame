// Prices and answers are integer Rappen, avoiding decimal currency rounding.
export class PurchaseQuiz {
  constructor(balance, price) {
    this.balance = balance;
    this.price = price;
    this.step = 0;
    this.correct = false;
  }
  get complete() { return this.step === 2; }
  check(francs, rappen) {
    if (this.complete) return false;
    const expected = this.step === 0 ? this.price : this.balance - this.price;
    this.correct = /^\d+$/.test(francs) && /^\d+$/.test(rappen) &&
      Number(francs) === Math.floor(expected / 100) && Number(rappen) === expected % 100;
    return this.correct;
  }
  advance() {
    if (!this.correct || this.complete) return false;
    this.step++;
    this.correct = false;
    return true;
  }
}
