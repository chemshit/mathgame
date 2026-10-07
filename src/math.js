// Prices and answers are integer Rappen, avoiding decimal currency rounding.
export class PurchaseQuiz {
  constructor(balance, price) {
    this.balance = balance;
    this.price = price;
    this.step = 0;
    this.correct = false;
  }
  get complete() { return this.step === 2; }
  check(answer) {
    if (this.complete) return false;
    this.correct = /^\d+$/.test(answer) && Number(answer) ===
      (this.step === 0 ? this.price : this.balance - this.price);
    return this.correct;
  }
  advance() {
    if (!this.correct || this.complete) return false;
    this.step++;
    this.correct = false;
    return true;
  }
}
