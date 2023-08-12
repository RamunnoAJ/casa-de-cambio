const BASE_URL = 'https://api.exchangerate.host'

export async function getSymbols() {
  const response = await fetch(`${BASE_URL}/symbols`)
  const data = await response.json()
  const symbols = Object.keys(data.symbols)

  return symbols
}

export async function getConvertRate(
  fromCurrency,
  toCurrency,
  quantity,
  date = ''
) {
  if (date !== '') date = `&date=${date}`
  const response = await fetch(
    `${BASE_URL}/convert?from=${fromCurrency}&to=${toCurrency}&amount=${quantity}${date}`
  )
  const data = await response.json()

  return data
}

export async function getCurrencyRate(currency, date) {
  if (!date) date = new Date().toISOString().split('T')[0]
  const response = await fetch(`${BASE_URL}/${date}?base=${currency}`)
  const data = await response.json()

  return data
}
