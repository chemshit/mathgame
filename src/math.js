// All calculations stay in integer Rappen; children answer using both units.
export class MoneyQuestion {
  constructor(left, right, operation = 'subtract') {
    this.left = left; this.right = right; this.operation = operation;
  }
  get answer() { return this.operation === 'add' ? this.left + this.right : this.left - this.right; }
  check(francs, rappen) {
    return /^\d+$/.test(francs) && /^\d+$/.test(rappen) &&
      Number(francs) === Math.floor(this.answer / 100) && Number(rappen) === this.answer % 100;
  }
}
export function collectionQuestion(random = Math.random) {
  const amount = () => (1 + Math.floor(random() * 10)) * 100 + (1 + Math.floor(random() * 9)) * 10;
  return new MoneyQuestion(amount(), amount(), 'add');
}
