class MicrosoftAuthPage {
    // Obtiene el botón de inicio de sesión con Microsoft
    get microsoftButton() {
        return cy.get('.cl-socialButtonsIconButton__microsoft');
    }

    // Obtiene el campo de entrada para el email
    get emailInput() {
        return cy.get('#identifier-field');
    }

    // Obtiene el campo de entrada para la contraseña
    get passwordInput() {
        return cy.get('#password-field');
    }

    // Obtiene el botón de continuar
    get continueButton() {
        return cy.get('.cl-formButtonPrimary');
    }

    // Obtiene el enlace de registro en el pie de página


    // Ingresa el correo electrónico en el campo de email
    enterEmail(email) {
        this.emailInput.should('be.visible').type(email, { delay: 100 }); // Añadido retraso para mayor realismo
    }

    // Ingresa la contraseña en el campo de contraseña
    enterPassword(password) {
        this.passwordInput.should('be.visible').type(password, { delay: 100 }); // Añadido retraso para mayor realismo
    }

    // Hace clic en el botón de continuar
    clickContinue() {
        this.continueButton.should('be.visible').click();
    }

    // Hace clic en el botón para iniciar sesión con Microsoft
    clickMicrosoftButton() {
        this.microsoftButton.should('be.visible').click();
    }
}

export default MicrosoftAuthPage;

