import { fetchURL } from './fetchURL.js'

const API_URL = 'https://api.exchangerate.host/'

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

function getConvertRate(fromCurrency, toCurrency, quantity, fromDate) {
  let isDateProvided = ''

  if (fromDate) {
    isDateProvided = `&date=${fromDate}`
  }

  fetchURL(
    `${API_URL}convert?from=${fromCurrency}&to=${toCurrency}&amount=${quantity}${isDateProvided}`
  ).then(response => {
    $selectedDate.textContent = fromDate || getCurrentDate()
    $selectedChange.textContent = `${fromCurrency} ${quantity} = ${toCurrency} ${new Intl.NumberFormat(
      'de-DE'
    ).format(response.result)}`

    $selectedCurrency.textContent = fromCurrency
  })
}

function renderCurrencies() {
  $form['from-currency'].innerHTML = ''
  $form['to-currency'].innerHTML = ''

  fetchURL('./json/currencies.json').then(response => {
    response.forEach(currency => {
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
    renderTableCurrenciesWithDate(fromCurrency, fromDate)
    $changeListDate.textContent = `Tipo de cambio de la fecha: ${fromDate}`
  } else {
    renderTableCurrenciesWithoutDate(fromCurrency)
    $changeListDate.textContent = `Tipo de cambio de la fecha: ${getCurrentDate()}`
  }
}

function getCurrentDate() {
  const MONTH_DIGIT = 10
  const date = new Date()

  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  let currentDate

  if (month < MONTH_DIGIT) {
    currentDate = `${year}-0${month}-${day}`
  } else {
    currentDate = `${year}-${month}-${day}`
  }

  return currentDate
}

function validateQuantity(quantity) {
  if (quantity <= 0 || '') {
    $form.quantity.classList.add('bg-danger')

    return 'error'
  }

  $form.quantity.classList.remove('bg-danger')
}

function renderTableCurrenciesWithDate(fromCurrency, fromDate) {
  fetchURL(`${API_URL}${fromDate}?base=${fromCurrency}`).then(response => {
    const rates = Object.entries(response.rates)
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

function renderTableCurrenciesWithoutDate(fromCurrency) {
  fetchURL(`${API_URL}latest?base=${fromCurrency}`).then(response => {
    const rates = Object.entries(response.rates)
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
