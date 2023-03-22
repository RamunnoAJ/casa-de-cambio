const URL = 'http://127.0.0.1:8080'
const API_URL = 'https://api.exchangerate.host/'
const VALID_DATE = '2014-08-15'
const BASE = 'ARS'
const CONVERT_TO = 'USD'
const TODAYS_YEAR = 2023

context('Exchange rate app', () => {
  before(() => {
    cy.visit(URL)
  })

  describe('Test the application', () => {
    it('should show the error when quantity is not specified', () => {
      cy.get('#from-currency').select(BASE)
      cy.get('#to-currency').select(CONVERT_TO)
      cy.get('#date').type(VALID_DATE)

      cy.get('#submit-form').click()
      cy.get('#quantity').should('have.class', 'bg-danger')
    })

    it('should swap currencies when clicking the swap button', () => {
      cy.get('#from-currency').select(BASE)
      cy.get('#to-currency').select(CONVERT_TO)

      cy.get('#button-change').click()
      cy.get('#from-currency').should('have.value', CONVERT_TO)
      cy.get('#to-currency').should('have.value', BASE)
    })

    it('should get the correct data with a valid date and valid quantity', () => {
      cy.get('#quantity').type('1')
      cy.get('#from-currency').select(BASE)
      cy.get('#to-currency').select(CONVERT_TO)
      cy.get('#date').type(VALID_DATE)

      cy.get('#submit-form').click()

      cy.intercept(`${API_URL}${VALID_DATE}?base=${BASE}`).as('response')
      cy.wait('@response')
        .its('response.statusCode')
        .should('eq', 200)
        .then(interception => {
          cy.get('#selected-date').should('have.text', VALID_DATE)
          cy.get('#selected-change').should(
            'include.text',
            `${BASE} 1 = ${CONVERT_TO} 0,121`
          )
          cy.get('#change-list-date').should('include.text', VALID_DATE)
          cy.get('#selected-currency').should('have.text', BASE)
        })
    })

    it('should render the correct table data after calling the API with a provided date', () => {
      cy.get('tbody tr').should('have.length.of.at.least', 5)
      cy.get('tbody > *:first-child > *:first-child').should('have.text', 'USD')
      cy.get('tbody > *:first-child > *:last-child').should(
        'have.text',
        '0,121'
      )
    })

    it('should get the latest data when date is not provided', () => {
      cy.visit(URL)
      cy.get('#quantity').type('1')
      cy.get('#from-currency').select(BASE)
      cy.get('#to-currency').select(CONVERT_TO)

      cy.intercept(`${API_URL}latest?base=${BASE}`).as('latest')
      cy.intercept(
        `${API_URL}convert?from=${BASE}&to=${CONVERT_TO}&amount=1`
      ).as('convert')
      cy.get('#submit-form').click()

      cy.wait(['@latest', '@convert']).then(interception => {
        cy.get('#change-list-date').should('include.text', TODAYS_YEAR)
        cy.get('#selected-currency').should('have.text', BASE)
        cy.get('#selected-change').should(
          'include.text',
          `${BASE} 1 = ${CONVERT_TO} 0,005`
        )
      })
    })

    it('should render the correct table data after calling the API no provided date', () => {
      cy.get('tbody tr').should('have.length.of.at.least', 5)
      cy.get('tbody > *:first-child > *:first-child').should('have.text', 'AED')
      cy.get('tbody > *:first-child > *:last-child').should(
        'have.text',
        '0,018'
      )
    })
  })
})
