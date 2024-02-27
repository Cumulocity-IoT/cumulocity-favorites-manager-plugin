import { IUser } from '@c8y/client';

describe('Favorites Manager', () => {
  // define a user, which should be used for the test instead
  // of technical users, which are only used for the test setup
  const testUser = {
    userName: 'testuser',
    password: 'ZVfJbDXuN!3t',
    displayName: 'Test User',
    email: 'test.user@softwareag.com',
  } as IUser;

  const assetId = '{assetId}';

  // create a new user before the test suite runs, who has the necessary roles
  // and permissions to access the Cockpit application extended with the Favorites Manager module
  before(() => {
    Cypress.session.clearAllSavedSessions();

    cy.getAuth().login();
    cy.createUser(testUser, ['business'], ['cockpit']);
  });

  // login with the new user before each test
  beforeEach(() => {
    cy.getAuth(testUser.userName, testUser.password).login();

    cy.hideCookieBanner();
  });

  // delete the user after the test suite runs
  after(() => {
    cy.getAuth().login().deleteUser(testUser);
  });

  it('should load favorites list when clicking on favorites menu item', () => {
    // open the Cockpit application extended with the Favorites Manager module locally
    // and wait for the navigator menu to be visible
    cy.visitAndWaitForSelector(
      '/apps/cockpit/index.html?remotes=%7B"sag-ps-iot-pkg-favorites-manager-plugin"%3A%5B"FavoritesManagerModule"%5D%7D#',
      'en',
      '#navigator'
    );

    // check for the favorites menu item and click on it
    cy.get('#navigator [data-cy="Favorites"]')
      .should('exist')
      .should('be.visible')
      .contains('Favorites')
      .click();

    // expect the favorites list component to be visible
    cy.get('c8y-favorites-manager').should('exist').should('be.visible');
  });

  it('should add a new favorite to the list and remove it again', () => {
    // open the Cockpit application extended with the Favorites Manager module and wait for the navigator menu to be visible
    cy.visit(`/apps/cockpit/index.html#`, {
      qs: { remotes: '{"sag-ps-iot-pkg-favorites-manager-plugin":["FavoritesManagerModule"]}' },
    });

    // check for the favorites menu item and click on it to navigate to the favorites list
    cy.get('#navigator [data-cy="Favorites"]', { timeout: 60000 })
      .should('exist')
      .should('be.visible')
      .contains('Favorites')
      .click();

    cy.get('c8y-favorites-manager').should('exist').should('be.visible');

    // expect the favorites list to be empty for the newly created user
    cy.get('c8y-favorites-manager [data-cy="favorites-empty-state"]')
      .should('exist')
      .should('be.visible');

    cy.visit(`/apps/cockpit/index.html#/group/${assetId}`, {
      qs: { remotes: '{"sag-ps-iot-pkg-favorites-manager-plugin":["FavoritesManagerModule"]}' },
    });

    // listen for the request to update the favorite list in the user object
    cy.intercept('PUT', '/user/currentUser').as('addFavoriteForUser');

    // check for the favorites action button its state and click on it
    // asset isn't a favorite yet and the button should contain the text "Add to favorites"
    cy.get('[data-cy="favorites-action-button"]', { timeout: 60000 })
      .should('exist')
      .should('be.visible')
      .contains('Add to favorites')
      .click();

    // wait for the update on the user object
    cy.wait('@addFavoriteForUser').its('response.statusCode').should('eq', 200);

    // expect the button to change its state to "Remove from favorites"
    cy.get('[data-cy="favorites-action-button"]')
      .should('exist')
      .should('be.visible')
      .contains('Remove from favorites');

    // navigate back to the favorites list and expect the list to contain the favorite
    cy.get('#navigator [data-cy="Favorites"]')
      .should('exist')
      .should('be.visible')
      .contains('Favorites')
      .click();

    cy.get('c8y-favorites-manager').should('exist').should('be.visible');

    // expect the favorites list not to be empty for the newly created user
    cy.get('c8y-favorites-manager [data-cy="favorites-empty-state"]').should('not.exist');

    // expect the favorites list to contain the favorite
    cy.get(
      'c8y-favorites-manager [data-cy="favorites-list"] [data-cy="c8y-data-grid--row-in-data-grid"]'
    )
      .should('have.length', 1)
      .within((favoriteRow) => {
        cy.wrap(favoriteRow).get('[data-cy="data-grid--System ID"]').contains(assetId);

        // navigate to the device detail page by clicking on the favorite
        cy.wrap(favoriteRow).get('[data-cy="data-grid--Name"] a').should('exist').click();
      });

    // check for the favorites action button its state and click on it
    // asset is a favorite and the button should contain the text "Remove from favorites"
    cy.get('[data-cy="favorites-action-button"]')
      .should('exist')
      .should('be.visible')
      .contains('Remove from favorites')
      .click();

    // wait for update on user object
    cy.wait('@addFavoriteForUser').its('response.statusCode').should('eq', 200);

    // expect the button to change its state to "Add to favorites"
    cy.get('[data-cy="favorites-action-button"]')
      .should('exist')
      .should('be.visible')
      .contains('Add to favorites');

    // navigate back to the favorites list and expect the list to be empty
    cy.get('#navigator [data-cy="Favorites"]')
      .should('exist')
      .should('be.visible')
      .contains('Favorites')
      .click();

    cy.get('c8y-favorites-manager').should('exist').should('be.visible');

    // expect the favorites list to be empty again for the newly created user
    cy.get('c8y-favorites-manager [data-cy="favorites-empty-state"]')
      .should('exist')
      .should('be.visible');
  });
});
