// GithubAuthFlow.js
class GithubAuthFlow {
    get microsoftButton() {
        return cy.get('.cl-socialButtonsIconButton__microsoft');
    }

    get githubButton() {
        return cy.get('.cl-socialButtonsIconButton__github'); // Asegúrate de que el selector sea el correcto
    }

    get emailInput() {
        return cy.get('#identifier-field');
    }

    get passwordInput() {
        return cy.get('#password-field');
    }

    get continueButton() {
        return cy.get('.cl-formButtonPrimary');
    }



    enterEmail(email) {
        this.emailInput.type(email);
    }

    enterPassword(password) {
        this.passwordInput.type(password);
    }

    clickContinue() {
        this.continueButton.click();
    }

    clickMicrosoftButton() {
        this.microsoftButton.click();
    }

    clickGitHubButton() {
        this.githubButton.click();  // Define el método para hacer clic en el botón de GitHub
    }
}

export default GithubAuthFlow;