// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
const faker = require("faker")

Cypress.Commands.add("clearSW", () => {
  if (typeof window !== "undefined" && window.navigator.serviceWorker) {
    window.navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister()
      })
    })
  }
})

Cypress.Commands.add("visitVor", (path) => {
  cy.visit(Cypress.env("VOR_HOST") + path)
})

Cypress.Commands.add("visitGaia", (path) => {
  cy.visit(Cypress.env("GAIA_HOST") + path)
})

Cypress.Commands.add("fixedClearCookies", () => {
  // workaround for cypress #781
  // @ts-ignore
  cy.clearCookies({ domain: null })
})

Cypress.Commands.add("registerVor", () => {
  const name = faker.name.firstName()
  const email = faker.internet.email()
  const password = faker.internet.password()
  const schoolName = faker.company.companyName()

  cy.wrap({name, email, password, schoolName}).as("vorUser")

  cy.request({
    method: "POST",
    url: "/auth/register",
    body: { email, password, name },
    form: true,
  })

  cy.request("POST", "/api/v1/schools", { name: schoolName }).then(
    (result) => {
      window.localStorage.setItem("SCHOOL_ID", result.body.id)
    }
  )
})