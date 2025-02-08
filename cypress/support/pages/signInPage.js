class SignInPage {
    // Selectores para los campos del formulario
    get emailInput() {
        return cy.get('input[name="identifier"]'); // Selector del campo de correo
    }

    get submitButton() {
        return cy.get('button[data-localization-key="formButtonPrimary"]'); // Selector del botón de submit
    }

    get continueButton() {
        return cy.get('.cl-formButtonPrimary'); // Selector del botón "continuar"
    }

    get verificationCodeInput() {
        return cy.get('input[name="verification_code"]'); // Selector del campo para el código de verificación
    }

    // Métodos para interactuar con los elementos
    fillEmail(email) {
        this.emailInput.type(email);
    }

    clickContinue() {
        this.continueButton.click(); // Método para hacer clic en el botón continuar
    }

    waitForVerificationCode() {
        this.verificationCodeInput.should('be.visible'); // Esperar que el campo del código de verificación sea visible
    }
}

export default new SignInPage();
