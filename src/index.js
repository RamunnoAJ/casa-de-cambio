import { getDataFromURL } from './getDataFromURL.js'

const API_URL = 'https://api.exchangerate.host/'

const $form = document.querySelector('#form')
const $selectedDate = document.querySelector('#selected-date')
const $selectedChange = document.querySelector('#selected-change')
const $selectedCurrency = document.querySelector('#selected-currency')
const $tableBody = document.querySelector('#table-body')

renderCurrencies()

function handleSubmit(e) {
  e.preventDefault()
  const quantity = $form.quantity.value
  const fromCurrency = $form['from-currency'].value
  const toCurrency = $form['to-currency'].value
  const fromDate = $form.date.value

  getConvertRate(fromCurrency, toCurrency, quantity, fromDate)
  renderTableCurrencies(fromCurrency, fromDate)
}

function getConvertRate(fromCurrency, toCurrency, quantity, fromDate) {
  getDataFromURL(
    `${API_URL}convert?from=${fromCurrency}&to=${toCurrency}&amount=${quantity}&date=${fromDate}`
  ).then(data => {
    $selectedDate.textContent = fromDate || new Date().toLocaleDateString()
    $selectedChange.textContent = `${fromCurrency} ${quantity} = ${toCurrency} ${new Intl.NumberFormat(
      'de-DE'
    ).format(data.result)}`

    $selectedCurrency.textContent = fromCurrency
  })
}

function renderCurrencies() {
  getDataFromURL('./json/currencies.json').then(data => {
    data.forEach(currency => {
      $form[
        'from-currency'
      ].innerHTML += `<option value='${currency}'>${currency}</option>`

      $form[
        'to-currency'
      ].innerHTML += `<option value='${currency}'>${currency}</option>`
    })
  })
}

function renderTableCurrencies(fromCurrency, fromDate) {
  $tableBody.innerHTML = ''

  if (fromDate) {
    getDataFromURL(`${API_URL}${fromDate}?base=${fromCurrency}`).then(data => {
      const rates = Object.entries(data.rates)
      rates.forEach(currency => {
        const currencyName = currency[0]
        const currencyExchange = currency[1]

        $tableBody.innerHTML += `<tr>
        <td>${currencyName}</td>
        <td>${new Intl.NumberFormat('de-DE').format(currencyExchange)}</td>
      </tr>`
      })
    })
  } else {
    getDataFromURL(`${API_URL}latest?base=${fromCurrency}`).then(data => {
      const rates = Object.entries(data.rates)
      rates.forEach(currency => {
        const currencyName = currency[0]
        const currencyExchange = currency[1]

        $tableBody.innerHTML += `<tr>
        <td>${currencyName}</td>
        <td>${new Intl.NumberFormat('de-DE').format(currencyExchange)}</td>
      </tr>`
      })
    })
  }
}

$form.addEventListener('submit', handleSubmit)
