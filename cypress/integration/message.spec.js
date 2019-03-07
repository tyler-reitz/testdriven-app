const randomstring = require('randomstring')

const username = randomstring.generate()
const email = `${username}@test.com`
const password = 'greaterthanten'


describe('Message', () => {
  it('should display flash messages correctly', () => {
    cy.server()
    cy.route('POST', 'auth/login').as('loginUser')

    cy
      .visit('/register')
      .get('input[name="username"]').type(username)
      .get('input[name="email"]').type(email)
      .get('input[name="password"]').type(password)
      .get('input[type="submit"]').click()

    cy
      .get('.notification.is-success').contains('Welcome!')
      .get('.delete').click()
      .get('.notification.is-success').should('not.be.visible')

    cy.get('.navbar-burger').click()
    cy.contains('Log Out').click()

    cy
      .visit('/login')
      .get('input[name="email"]').type('incorrect@email.com')
      .get('input[name="password"]').type(password)
      .get('input[type="submit"]').click()

    cy
      .get('.notification.is-success').should('not.be.visible')
      .get('.notification.is-danger').contains('User does not exist.')

    cy
      .get('input[name="email"]').clear().type(email)
      .get('input[name="password"]').clear().type(password)
      .get('input[type="submit"]').click()
      .wait('@loginUser')

    cy
      .get('.notification.is-success').contains('Welcome!')
      .get('.notification.is-danger').should('not.be.visible')

    cy.get('.navbar-burger').click()
    cy.contains('Log Out').click()

    cy
      .contains('Log In').click()
      .get('input[name="email"]').type(email)
      .get('input[name="password"]').type(password)
      .get('input[type="submit"]').click()
      .wait('@loginUser')

    cy
      .get('.notification.is-success').contains('Welcome!')
      .wait(4000)
      .get('.notification.is-success').should('not.be.visible')

  })
})
