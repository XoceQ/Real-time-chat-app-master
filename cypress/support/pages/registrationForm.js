class RegistrationForm {
    get emailInput() {
        return cy.get('input[name="emailAddress"]');
    }

    get passwordInput() {
        return cy.get('input[name="password"]');
    }

    get continueButton() {
        return cy.get('button[data-localization-key="formButtonPrimary"]');
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
}

export default RegistrationForm;
