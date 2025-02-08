class GoogleAuthPage {
    get googleButton() {
        return cy.get('button.cl-socialButtonsIconButton__google');
    }

    get emailInput() {
        return cy.get('input[type="email"]');
    }

    get passwordInput() {
        return cy.get('input[type="password"]');
    }

    get continueButton() {
        return cy.get('#identifierNext');  // Ajusta según el selector real
    }

    get accountSelector() {
        // Selector para el primer item de la lista de cuentas
        return cy.get('ul > li:nth-child(1) > div');
    }



    clickGoogleButton() {
        this.googleButton.click();
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

    selectAccount() {
        this.accountSelector.click(); // Hace clic en la primera cuenta disponible
    }

    // Paso que lleva a la URL de autenticación OAuth de Google
    navigateToGoogleOAuth() {
        // Aquí asumo que la URL de autenticación OAuth es una URL de redirección que puedes verificar
        cy.url().should('include', 'accounts.google.com/o/oauth2/auth/oauthchooseaccount');
    }
}

export default GoogleAuthPage;
