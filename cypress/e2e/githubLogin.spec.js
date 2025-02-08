import GithubAuthFlow from '../support/pages/githubAuthFlow';  // Asegúrate de que la ruta sea correcta

describe('GitHub Authentication Test', () => {
    const loginPage = new GithubAuthFlow();  // Crea una instancia de GithubAuthFlow
    const githubEmail = Cypress.env('GITHUB_EMAIL');  // Obtener el email desde el archivo .env
    const githubPassword = Cypress.env('GITHUB_PASSWORD');  // Obtener la contraseña desde el archivo .env

    beforeEach(() => {
        cy.intercept('POST', '**/v1/client/sign_ins', {
            statusCode: 200,
            body: {
                session_id: 'fake-session-id',
            },
        }).as('signIn');

        cy.visit('https://exciting-doberman-27.accounts.dev/sign-in');
    });

    it('Simulates a successful sign-in flow using GitHub account.', () => {
        cy.intercept('GET', '**/login/oauth/authorize').as('authorizePage');

        loginPage.clickGitHubButton();

        // Espera a que ocurra la redirección
        cy.wait('@authorizePage', {timeout: 10000});

        // Verifica la URL después de la redirección
        cy.url().should('include', 'github.com/login/oauth/authorize');

        loginPage.enterEmail(githubEmail);
        loginPage.enterPassword(githubPassword);
        loginPage.clickContinue();

        // Continua con las verificaciones habituales
        loginPage.clickMicrosoftButton();

        cy.wait('@signIn');
        cy.setCookie('__session', 'fake-session-id');
        cy.visit('http://localhost:3000/');
        cy.url().should('include', 'http://localhost:3000/');
        cy.contains('Welcome back').should('be.visible');
    });
});