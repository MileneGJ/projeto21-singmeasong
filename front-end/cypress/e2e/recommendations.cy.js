import invalidRecommendationFactory from "./factories/invalidRecommendationFactory"
import recommendationFactory from "./factories/recommendationFactory"

beforeEach(() => {
  cy.request('POST', 'http://localhost:5000/database-reset')
})

describe('Tests for adding a new recommendation', () => {

  it('Add recommendation successfully when inputs are valid', () => {
    const recommendation = recommendationFactory()

    cy.intercept("GET", "/recommendations").as("getRecommendation");
    cy.visit("http://localhost:3000");
    cy.wait("@getRecommendation");

    let initialLength = 0

    cy.get('input[placeholder=Name]').should('be.visible').type(recommendation.name);
    cy.get("input[placeholder='https://youtu.be/...'").should('be.visible').type(recommendation.youtubeLink);

    cy.intercept("POST", "/recommendations").as("postRecommendation");
    cy.get("button").should('be.visible').click();
    cy.wait("@postRecommendation");

    cy.contains(recommendation.name).should("be.visible");
    cy.get('article').its('length').should("be.gt", initialLength)

  })


  it('Do not add recommendation when song already exists', () => {
    const recommendation = recommendationFactory()

    cy.intercept("GET", "/recommendations").as("getRecommendation");

    cy.visit("http://localhost:3000");
    cy.request("POST", "http://localhost:5000/recommendations", recommendation)
    cy.wait("@getRecommendation");

    cy.get('article')
      .then(elements => {
        const initialLength = elements.length
        cy.get('input[placeholder=Name]').should('be.visible').type(recommendation.name);
        cy.get("input[placeholder='https://youtu.be/...'").should('be.visible').type(recommendation.youtubeLink);

        cy.intercept("POST", "/recommendations").as("postRecommendation");
        cy.get("button").should('be.visible').click();
        cy.wait("@postRecommendation");

        cy.contains(recommendation.name).its('length').should("eq", 1);
        cy.get('article').its('length').should("eq", initialLength)
      })

  })


  it('Do not add recommendation when url is not youtube link', () => {
    const recommendation = invalidRecommendationFactory()

    cy.intercept("GET", "/recommendations").as("getRecommendation");
    cy.visit("http://localhost:3000");
    cy.wait("@getRecommendation");

    cy.get('input[placeholder=Name]').should('be.visible').type(recommendation.name);
    cy.get("input[placeholder='https://youtu.be/...'").should('be.visible').type(recommendation.youtubeLink);

    cy.intercept("POST", "/recommendations").as("postRecommendation");
    cy.get("button").should('be.visible').click();
    cy.wait("@postRecommendation");

    cy.contains(recommendation.name).should('not.exist')

  })

})