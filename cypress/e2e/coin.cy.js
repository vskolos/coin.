/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('Coin App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
    cy.get('.login-form').within(() => {
      cy.get('input[name=login]').type('developer')
      cy.get('input[name=password]').type('skillbox')
      cy.root().submit()
    })
  })

  it('Возможность авторизоваться', () => {
    cy.url().should('eq', 'http://localhost:8080/accounts')
  })

  it('Возможность посмотреть список счетов', () => {
    cy.get('.accounts-list').should('not.be.empty')
    cy.get('.account-card__id').should('not.be.empty')
  })

  it('Возможность перевести сумму со счёта на счёт', () => {
    cy.get('.account-card').within(() => {
      cy.contains('Открыть').click()
      cy.url().should('match', /^http:\/\/localhost:8080\/accounts\//)
    })

    cy.get('.money-transfer-form').within(() => {
      cy.get('input[name=account]').type('56650711433834874763773104')
      cy.get('input[name=amount]').type('100')
      cy.root().submit()
    })

    cy.contains('Перевод завершён').should('exist')
  })

  it('Возможность создать новый счёт', () => {
    let length
    cy.get('.accounts-list')
      .children()
      .its('length')
      .then((len) => {
        length = len
      })
      .then(() => {
        cy.contains('Создать новый счёт').click()
        cy.contains('Счёт создан').should('exist')
        cy.contains('Закрыть').click()
        cy.get('.accounts-list')
          .children()
          .its('length')
          .should('eq', length + 1)
      })
  })
})
