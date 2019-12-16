/** @jsx h */

/* eslint-disable func-names */

import { _seedValue1, _seedValue2 } from './initialValue'

context('Editor', () => {
  beforeEach(() => {
    cy.visit(
      'http://localhost:6006/iframe.html?id=services-auth--login-accounts'
    )
    cy.clearLocalStorage()
    cy.get('button').click()
    cy.wait(4000)
    cy.visit(
      'http://localhost:6006/iframe.html?id=services-atomic-blocks--edit-atomic-blocks'
    )
    cy.wait(1000)
    cy.get('button').then(buttonList => {
      buttonList[0].click()
      cy.wait(2000)
      cy.reload()
      cy.wait(2000)
      cy.get('button').then(buttonList => {
        buttonList[1].click()
        cy.wait(2000)
        cy.get('[contenteditable="true"]').as('editor')
        cy.get('#slateDocument').as('slateDocument')
      })
    })
  })

  //   it('renders the contenteditable container', () => {
  //     cy.get('@editor').should('have.attr', 'role')
  //   })

  it('Edits atomic sources', () => {
    cy.get('@editor')
      .get('[data-test-atomic-edit="open"]')
      .click()
      .wait(2000)
    cy.get('#citation')
      .focus()
      .type('full length citation')
    cy.get('#firstName')
      .focus()
      .type('first name')
    cy.get('#lastName')
      .focus()
      .type('last name')

    cy.get('button').then(buttonList => {
      buttonList[4].click()
    })

    cy.get('@editor')
      .focus()
      .endOfDoc()
      .newLine()
      .type('@new source')
      .newLine()
      .get('[data-test-atomic-edit="open"]')
      .then(buttonList => {
        buttonList[1].click()
        cy.wait(2000)
          .get('#name')
          .focus()
          .type('{rightarrow}')
          .type('{rightarrow}')
          .type('{rightarrow}')
          .type('{rightarrow}')
          .type('{backspace}')
          .type('{backspace}')
          .type('{backspace}')
          .type('updated')
        cy.get('#citation')
          .focus()
          .type('second citation')
        cy.get('button').then(buttonList => {
          buttonList[4].click()
        })
      })
  })
})

// cy.get('#firstName')
// .invoke('val') // for input or textarea, .invoke('val')
// .then(str => console.log(str))
