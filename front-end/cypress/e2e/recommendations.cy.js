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
    cy.request("POST", "http://localhost:5000/database-seed/low-score-case")
      .then(() => {
        cy.intercept("GET", "/recommendations").as("getRecommendation");
        cy.visit("http://localhost:3000");
        cy.wait("@getRecommendation");

        cy.get('article').children('div').last().should(div => expect(div).to.contain('-5'))

        cy.intercept("POST", "/recommendations/1/downvote").as("downvoteRecommendation");
        cy.get('article').children('div').last().children('svg').last().should('be.visible').click();

        cy.wait("@downvoteRecommendation");
        cy.wait("@getRecommendation");

        cy.get('article').should('not.exist')
      })
  })

})


describe('Testing interaction with recommendations list', () => {

  it('Returns a maximum of 10 recommendations in home page', () => {
    cy.request("POST", "http://localhost:5000/database-seed/11-cases")
      .then(() => {
        cy.intercept("GET", "/recommendations").as("getRecommendation");
        cy.visit("http://localhost:3000");
        cy.wait("@getRecommendation");

        cy.get('article')
          .then(elements => {
            expect(elements.length).equal(10)
          })
      })
  })

  it('Clicking on youtube play button will reproduce it inside the page', () => {
    const recommendation = recommendationFactory()

    cy.intercept("GET", "/recommendations").as("getRecommendation");
    cy.visit("http://localhost:3000");
    cy.request("POST", "http://localhost:5000/recommendations", recommendation)
      .then(() => {
        cy.wait("@getRecommendation");
        cy.wait(2000);
        cy.get('iframe').should('be.visible').click()
        cy.url().should("equal", "http://localhost:3000/");
      })
  })

  // it('Clicking on song title will open link directly on youtube', () => {
  //   const recommendation = recommendationFactory()

  //   cy.intercept("GET", "/recommendations").as("getRecommendation");
  //   cy.visit("http://localhost:3000");
  //   cy.request("POST", "http://localhost:5000/recommendations", recommendation)
  //     .then(() => {
  //       cy.wait("@getRecommendation");
  //       cy.wait(5000);

  //       cy.get('iframe .ytp-title-text').should('be.visible').click()
  //       cy.url().should("equal", recommendation.youtubeLink);
  //     })
  // })

  // it('Clicking on youtube logo will open link directly on youtube', () => {
  //   const recommendation = recommendationFactory()

  //   cy.intercept("GET", "/recommendations").as("getRecommendation");
  //   cy.visit("http://localhost:3000");
  //   cy.request("POST", "http://localhost:5000/recommendations", recommendation)
  //     .then(() => {
  //       cy.wait("@getRecommendation");
  //       cy.wait(5000);

  //       cy.get('iframe .ytp-watermark').should('be.visible').click()
  //       cy.url().should("equal", recommendation.youtubeLink);
  //     })
  // })

  // it('Clicking on video menu button will show further options', () => {
  //   const recommendation = recommendationFactory()

  //   cy.intercept("GET", "/recommendations").as("getRecommendation");
  //   cy.visit("http://localhost:3000");
  //   cy.request("POST", "http://localhost:5000/recommendations", recommendation)
  //     .then(() => {
  //       cy.wait("@getRecommendation");
  //       cy.wait(5000);

  //       cy.get('iframe .ytp-cued-thumbnail-overlay').should('not.be.visible')
  //       cy.get('iframe .ytp-chrome-top-buttons').should('be.visible').click()
  //       cy.get('iframe .ytp-cued-thumbnail-overlay').should('be.visible')
  //     })
  // })

})


describe('Testing menu options',()=>{

  it('Returns a maximum of 10 recommendations ordered by score when clicking on top', () => {
    cy.request("POST", "http://localhost:5000/database-seed/11-cases")
      .then(() => {
        cy.intercept("GET", "/recommendations").as("getRecommendation");
        cy.visit("http://localhost:3000");
        cy.wait("@getRecommendation");

        cy.get('header').parent().children('div').first().children('div').eq(1).should('be.visible').click()
        cy.url().should("equal", 'http://localhost:3000/top');
        cy.get('article')
          .then(elements => {
            expect(elements.length).equal(10)
          })
        cy.get('article').first().children('div').last().should(div => expect(div).to.contain('10'))
      })
  })

  it('Returns one random recommendation when clicking on random', () => {
    cy.request("POST", "http://localhost:5000/database-seed/11-cases")
      .then(() => {
        cy.intercept("GET", "/recommendations").as("getRecommendation");
        cy.visit("http://localhost:3000");
        cy.wait("@getRecommendation");

        cy.get('header').parent().children('div').first().children('div').eq(2).should('be.visible').click()
        cy.url().should("equal", 'http://localhost:3000/random');
        cy.get('article')
          .then(elements => {
            expect(elements.length).equal(1)
          })
      })
  })

  it('Go back to home page when being on top page and clicking on home', () => {
    cy.request("POST", "http://localhost:5000/database-seed/11-cases")
      .then(() => {
        cy.intercept("GET", "/recommendations").as("getRecommendation");
        cy.visit("http://localhost:3000");
        cy.wait("@getRecommendation");

        cy.get('header').parent().children('div').first().children('div').eq(1).should('be.visible').click()
        cy.url().should("equal", 'http://localhost:3000/top');
        cy.get('header').parent().children('div').first().children('div').eq(0).should('be.visible').click()
        cy.url().should("equal", 'http://localhost:3000/');
      })
  })

  it('Go back to home page when being on random page and clicking on home', () => {
    cy.request("POST", "http://localhost:5000/database-seed/11-cases")
      .then(() => {
        cy.intercept("GET", "/recommendations").as("getRecommendation");
        cy.visit("http://localhost:3000");
        cy.wait("@getRecommendation");

        cy.get('header').parent().children('div').first().children('div').eq(2).should('be.visible').click()
        cy.url().should("equal", 'http://localhost:3000/random');
        cy.get('header').parent().children('div').first().children('div').eq(0).should('be.visible').click()
        cy.url().should("equal", 'http://localhost:3000/');
      })
  })

})