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
      .then(() => {
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


describe('Tests for upvoting or downvoting recommendation', () => {

  it('Increases score in one point when upvoting recommendation', () => {
    const recommendation = recommendationFactory()

    cy.intercept("GET", "/recommendations").as("getRecommendation");
    cy.visit("http://localhost:3000");
    cy.request("POST", "http://localhost:5000/recommendations", recommendation)
      .then(() => {
        cy.wait("@getRecommendation");

        cy.contains(recommendation.name).parent().children('div').last().should(div => expect(div).to.contain('0'))

        cy.intercept("POST", "/recommendations/1/upvote").as("upvoteRecommendation");
        cy.contains(recommendation.name).parent().children('div').last().children('svg').first().should('be.visible').click();

        cy.wait("@upvoteRecommendation");
        cy.wait("@getRecommendation");

        cy.contains(recommendation.name).parent().children('div').last().should(div => expect(div).to.contain('1'))
      })
  })


  it('Decreases score in one point when downvoting recommendation', () => {
    const recommendation = recommendationFactory()

    cy.intercept("GET", "/recommendations").as("getRecommendation");
    cy.visit("http://localhost:3000");
    cy.request("POST", "http://localhost:5000/recommendations", recommendation)
      .then(() => {
        cy.wait("@getRecommendation");

        cy.contains(recommendation.name).parent().children('div').last().should(div => expect(div).to.contain('0'))

        cy.intercept("POST", "/recommendations/1/downvote").as("downvoteRecommendation");
        cy.contains(recommendation.name).parent().children('div').last().children('svg').last().should('be.visible').click();

        cy.wait("@downvoteRecommendation");
        cy.wait("@getRecommendation");

        cy.contains(recommendation.name).parent().children('div').last().should(div => expect(div).to.contain('-1'))
      })
  })

  it('Deletes recommendation when downvoting it to less than -5', () => {
    const recommendation = recommendationFactory()

    cy.request("POST", "http://localhost:5000/recommendations", recommendation)
      .then(() => {
        cy.request("POST", "http://localhost:5000/recommendations/1/downvote")
          .then(() => {
            cy.request("POST", "http://localhost:5000/recommendations/1/downvote")
              .then(() => {
                cy.request("POST", "http://localhost:5000/recommendations/1/downvote")
                  .then(() => {
                    cy.request("POST", "http://localhost:5000/recommendations/1/downvote")
                      .then(() => {
                        cy.request("POST", "http://localhost:5000/recommendations/1/downvote")
                          .then(() => {
                            cy.intercept("GET", "/recommendations").as("getRecommendation");
                            cy.visit("http://localhost:3000");
                            cy.wait("@getRecommendation");

                            cy.contains(recommendation.name).parent().children('div').last().should(div => expect(div).to.contain('-5'))

                            cy.intercept("POST", "/recommendations/1/downvote").as("downvoteRecommendation");
                            cy.contains(recommendation.name).parent().children('div').last().children('svg').last().should('be.visible').click();

                            cy.wait("@downvoteRecommendation");
                            cy.wait("@getRecommendation");

                            cy.contains(recommendation.name).should('not.exist')
                          })
                      })
                  })
              })
          })
      })
  })


})