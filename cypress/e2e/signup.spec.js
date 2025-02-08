import RegistrationForm from '../support/pages/registrationForm';

describe('Navigate to Sign-Up', () => {
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

    it('should navigate to the sign-up page when clicking the Sign-Up link', () => {
        // Haz clic en el enlace para ir a la página de registro
        cy.get('#__next > div > div.componentContainer > div > div > div.cl-footer.🔒️.cl-internal-18aek0g > div.cl-footerAction.cl-footerAction__signIn.🔒️.cl-internal-n0ak4e > a')
            .click();

        // Verifica que se haya redirigido a la página de registro
        cy.url().should('include', '/sign-up'); // Ajusta según sea necesario

        const validEmail = 'testuser@example.com';
        const validPassword = 'Password123!';

        // Ingresa el correo electrónico
        cy.get('#emailAddress-field').type(validEmail);

        // Ingresa la contraseña
        cy.get('#password-field').type(validPassword);

        // Haz clic en el botón "Continue"
        cy.get('#__next > div > div.componentContainer > div > div > div.cl-main.🔒️.cl-internal-xk295g > form > div.cl-internal-zux7mx > button')
            .click();

        // Verifica que la URL haya cambiado a la página de bienvenida o la página esperada
        cy.url().should('include', '/welcome'); // Ajusta según la URL real de éxito en tu aplicación

        // Verifica que el mensaje de bienvenida esté visible (ajusta según lo que aparezca en tu aplicación)

        cy.contains('Welcome').should('be.visible');
    });


});
