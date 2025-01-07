import signInPage from '../support/pages/signInPage'; // Importamos la instancia

describe('Email Authentication with Verification Code Request', () => {
    const email = Cypress.env('EMAIL');  // Obtener el email desde el archivo .env

    beforeEach(() => {
        cy.intercept('POST', '**/v1/client/sign_ins', {
            statusCode: 200,
            body: {
                session_id: 'fake-session-id', // ID de sesión simulado
            },
        }).as('signIn');

        cy.visit('https://exciting-doberman-27.accounts.dev/sign-in');
    });

    it('Verify that the user is prompted for a verification code', () => {
        // Llenamos el formulario con un correo válido
        signInPage.fillEmail(email); // Usa el email desde Cypress.env()

        // Hacemos clic en el botón "continuar"
        signInPage.clickContinue(); // Haz clic en el botón continuar

        // Esperamos un tiempo adecuado (ej. 10 segundos) para simular la espera del código
        cy.wait(10000); // Esperamos 10 segundos

        // Esperamos a que el campo de código de verificación esté visible
        signInPage.waitForVerificationCode();

        // Al terminar el tiempo, podemos finalizar el test sin más acciones
        // Verificamos que el código de verificación haya sido solicitado correctamente
        cy.get('input[name="verification_code"]').should('be.visible'); // Verifica que el campo de código esté visible

        // Test finalizado
        cy.log('Test finalizado. El código de verificación ha sido solicitado.');
    });
});
