describe("test authentication", () => {
  const faker = require("faker")

  beforeEach(() => {
    window?.navigator?.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister()
        })
      })
  })

  it("should be able to login and register", () => {
    // define new user dynamically
    const name = faker.name.firstName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    const schoolName = faker.company.companyName()

    cy.visit("/")
    // cy.waitForRouteChange()

    // Try logging in and fail
    cy.contains("Email").type(email)
    cy.contains("Password").type(password)
    cy.contains("button", "Login").click()
    cy.contains("Wrong").should("be.visible")

    // Register account
    cy.contains("Sign Up")
      .click()
      // cy.waitForRouteChange()
      .url()
      .should("contains", "register")
    cy.get("[data-cy=register-email]").type(email)
    cy.contains("Password").type(password)
    cy.contains("Name").type(name)
    cy.get("[data-cy=register-button]").click()

    // Create School
    // cy.waitForRouteChange()
    cy.contains("New").click()
    cy.contains("Name").type(schoolName)
    cy.contains("Save").click()
    cy.contains(schoolName).click()

    // Logout
    cy.url().should("contains", "dashboard")
    cy.contains("Admin").click()
    cy.contains("Log Out").click()

    // Login
    cy.url().should("contains", "login")
    cy.contains("Email").type(email)
    cy.contains("Password").type(password)
    cy.contains("button", "Login").click()

    // Choose school
    cy.url().should("contains", "school")
    cy.contains(schoolName).click()

    // Change theme
    cy.contains("Admin").click()
    cy.get("[data-cy=dark-switch]").click()
    cy.get("[data-cy=light-switch]").click()

    // Check sidebar links
    cy.url().should("contains", "admin")
    cy.contains("Students").click()
    // .waitForRouteChange()
    cy.url().should("contains", "students")
  })
})
