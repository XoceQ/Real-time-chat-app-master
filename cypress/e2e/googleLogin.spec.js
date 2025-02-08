import GoogleAuthPage from '../support/pages/googleAuthFlow';

describe('Google Authentication Test', () => {
    const googleAuthPage = new GoogleAuthPage();
    const googleEmail = Cypress.env('GOOGLE_EMAIL'); // Obtiene el correo electrónico desde el archivo .env
    const googlePassword = Cypress.env('GOOGLE_PASSWORD'); // Obtiene la contraseña desde el archivo .env

    beforeEach(() => {
        // Intercepta la solicitud POST al endpoint de inicio de sesión
        cy.intercept('POST', '**/v1/client/sign_ins', {
            statusCode: 200,
            body: {
                session_id: 'fake-session-id', // ID de sesión simulado
            },
        }).as('signIn');

        // Visita la página de inicio de sesión
        cy.visit('https://exciting-doberman-27.accounts.dev/sign-in');
    });

    it('Simula un flujo exitoso de inicio de sesión con una cuenta válida de Google', () => {
        // Hace clic en el botón para iniciar sesión con Google
        googleAuthPage.clickGoogleButton();

        // Verifica que la URL se redirija a Google para la autenticación
        cy.url({ timeout: 10000 }).should('include', 'https://accounts.google.com/o/oauth2/auth/oauthchooseaccount');
        // Nota: Asegúrate de que la URL completa sea la que esperas, incluyendo los parámetros de consulta.

        // Selecciona la cuenta de Google
        googleAuthPage.selectAccount();

        // Simula el ingreso de correo electrónico y clic en continuar
        googleAuthPage.enterEmail(googleEmail);
        cy.wait(2000); // Espera 2 segundos para simular un tiempo de carga
        googleAuthPage.clickContinue();

        // Simula el ingreso de contraseña y clic en continuar
        googleAuthPage.passwordInput.should('be.visible'); // Verifica que el campo de contraseña sea visible
        googleAuthPage.enterPassword(googlePassword);
        cy.wait(2000); // Espera 2 segundos antes de continuar
        googleAuthPage.clickContinue();

        // Espera la respuesta de la solicitud interceptada
        cy.wait('@signIn');

        // Configura la cookie de sesión para simular un inicio de sesión exitoso
        cy.setCookie('__session', 'fake-session-id');

        // Verifica que el usuario sea redirigido a la página esperada
        cy.visit('http://localhost:3000/');
        cy.url().should('include', 'http://localhost:3000/'); // Verifica que la URL sea la correcta
        cy.contains('Welcome back').should('be.visible'); // Verifica que el mensaje de bienvenida sea visible
    });
});