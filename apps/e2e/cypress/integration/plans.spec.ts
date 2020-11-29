describe("Test lesson plan features", function () {
  beforeEach(function () {
    cy.clearSW()
    cy.registerVor()
    cy.createSchool()
    cy.createClass()
    cy.createStudent().then(() => {
      cy.visitVor(`/dashboard/students/plans?studentId=${this.student.id}`)
    })
  })

  it("should be able to edit, create, and delete plans.", function () {
    const firstName = "A Bold New Plan"

    const secondName = "A bolder plan"
    const secondDescription = "A description"

    cy.get('[aria-label="next-date"]').click()

    // test create
    cy.contains("Add").click()
    cy.contains("Save").should("be.disabled")
    cy.contains("Title").type(firstName)
    cy.contains("Save").click()
    cy.contains(firstName).should("be.visible")

    // Test edit
    cy.contains(firstName).click()
    cy.get('[aria-label="edit-title"]').click()
    cy.contains("label", "Title").find("input").clear().type(secondName)
    cy.contains("Save").click()
    cy.contains(secondName).should("be.visible")

    cy.get('[aria-label="edit-description"]').click()
    cy.contains("label", "Description").find("textarea").type(secondDescription)
    cy.contains("Save").click()
    cy.contains(secondDescription).should("be.visible")

    cy.get("[data-cy=back-button]").click()
    cy.contains(secondName).should("be.visible")

    // Regression test, should be able to delete class
    cy.visitVor("/dashboard/admin/class")
    cy.contains(this.class.name).click()
    cy.contains("Delete").click()
    cy.contains("Yes").click()
    cy.contains(this.class.name).should("not.exist")
  })
})
