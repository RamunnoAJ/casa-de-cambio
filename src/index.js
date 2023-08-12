import * as api from './api/exchange.js'
import { Currency } from './entities/currencies.js'
import { Rate } from './entities/rates.js'

const $form = document.querySelector('#form')
const $selectedDate = document.querySelector('#selected-date')
const $selectedChange = document.querySelector('#selected-change')
const $selectedCurrency = document.querySelector('#selected-currency')
const $tableBody = document.querySelector('#table-body')
const $buttonChange = document.querySelector('#button-change')
const $changeListDate = document.querySelector('#change-list-date')

$form.addEventListener('submit', handleSubmit)
$buttonChange.addEventListener('click', handleClick)
renderCurrencies()

function handleClick() {
  const fromCurrency = $form['from-currency'].value
  const toCurrency = $form['to-currency'].value

  $form['from-currency'].value = toCurrency
  $form['to-currency'].value = fromCurrency
}

function handleSubmit(e) {
  e.preventDefault()
  const quantity = $form.quantity.value
  const fromCurrency = $form['from-currency'].value
  const toCurrency = $form['to-currency'].value
  const fromDate = $form.date.value

  if (validateQuantity(quantity) === 'error') return

  getConvertRate(fromCurrency, toCurrency, quantity, fromDate)
  renderTableCurrencies(fromCurrency, fromDate)
}

async function getConvertRate(fromCurrency, toCurrency, quantity, fromDate) {
  const data = await api.getConvertRate(
    fromCurrency,
    toCurrency,
    quantity,
    fromDate
  )
  const rate = new Rate(
    data.date,
    data.query.from,
    data.query.to,
    data.query.amount,
    data.result
  )

  console.log(rate.date)

  $selectedDate.textContent = rate.date
  $selectedChange.textContent = rate.getRate()
  $selectedCurrency.textContent = rate.from
}

async function renderCurrencies() {
  $form['from-currency'].innerHTML = ''
  $form['to-currency'].innerHTML = ''

  const symbols = await api.getSymbols()
  symbols.forEach(symbol => {
    $form[
      'from-currency'
    ].innerHTML += `<option value='${symbol}'>${symbol}</option>`
    $form[
      'to-currency'
    ].innerHTML += `<option value='${symbol}'>${symbol}</option>`
  })
}

function validateQuantity(quantity) {
  if (quantity <= 0 || '') {
    $form.quantity.classList.add('bg-danger')

    return 'error'
  }

  $form.quantity.classList.remove('bg-danger')
}

async function renderTableCurrencies(fromCurrency, fromDate) {
  const currencyRate = await api.getCurrencyRate(fromCurrency, fromDate)
  const rates = Object.entries(currencyRate.rates)

  rates.forEach(rate => {
    const currency = new Currency(rate[0], rate[1])

    $tableBody.innerHTML += `<tr>
      <td>${currency.name}</td>
      <td>${currency.getExchange()}</td>
    </tr>`
  })

  $changeListDate.textContent = `Tipo de cambio de la fecha: ${
    fromDate || new Date().toISOString().split('T')[0]
  }`
}
