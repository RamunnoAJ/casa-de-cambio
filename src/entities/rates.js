export class Rate {
  constructor(date, from, to, quantity, result) {
    this.date = date
    this.from = from
    this.to = to
    this.quantity = quantity
    this.result = result
  }

  getRate() {
    return `${this.from} ${this.quantity} = ${this.to} ${new Intl.NumberFormat(
      'de-DE'
    ).format(this.result)}`
  }
}
