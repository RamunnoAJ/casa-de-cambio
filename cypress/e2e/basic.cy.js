const URL = 'http://127.0.0.1:8080'

before(() => {
  cy.visit(URL)
})

describe('exchange', () => {
  it('should render the page', () => {
    cy.get('.navbar')
    cy.get('#form')
    cy.get('section.container-xxl')
  })
})
