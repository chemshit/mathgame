export const DENOMINATIONS = [5, 10, 20, 50, 100, 200, 500];
export function formatMoney(rappen, lang = 'tr') {
  const francs = Math.floor(rappen / 100), remainder = rappen % 100;
  const unit = lang === 'de' ? 'Franken' : lang === 'en' ? (francs === 1 ? 'franc' : 'francs') : 'Frank';
  if (!francs) return `${remainder} Rappen`;
  return `${francs} ${unit}${remainder ? ` ${remainder} Rappen` : ''}`;
}
export class Economy {
  constructor(random = Math.random) {
    const price = (min, steps) => min + Math.floor(random() * steps) * 10;
    this.prices = { bubble: price(30, 6), dryer: price(50, 5), bow: price(110, 15), glasses: price(160, 18), hat: price(240, 20), clothes: price(260, 24) };
    this.balance = 0;
    this.spent = 0;
    this.collected = new Set();
    this.dryerPaid = false;
  }
  collect(id, value) {
    if (this.collected.has(id) || !DENOMINATIONS.includes(value)) return false;
    this.collected.add(id); this.balance += value; return true;
  }
  canPay(item) { return Number.isInteger(this.prices[item]) && this.balance >= this.prices[item]; }
  canPayAmount(amount) { return Number.isInteger(amount) && amount > 0 && this.balance >= amount; }
  payAmount(amount) {
    if (!this.canPayAmount(amount)) return false;
    this.balance -= amount; this.spent += amount; return true;
  }
  pay(item) { return this.payAmount(this.prices[item]); }
  unlockDryer() {
    if (this.dryerPaid) return true;
    if (!this.pay('dryer')) return false;
    this.dryerPaid = true; return true;
  }
}
