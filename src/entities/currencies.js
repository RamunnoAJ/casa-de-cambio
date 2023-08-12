export class Currency {
  constructor(name, exchange) {
    this.name = name
    this.exchange = exchange
  }

  getExchange() {
    return new Intl.NumberFormat('de-DE').format(this.exchange)
  }
}
