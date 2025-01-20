// socketProvider.cy.tsx

import { SocketProvider } from "@/components/providers/socket-provider";
import { SocketIndicator } from "@/components/socket-indicator";
import React from "react";
import { mount } from "cypress/react18";

describe("SocketProvider with SocketIndicator", () => {
    it('should show "Live: Real-time updates" when connected', () => {
        // Interceptamos la solicitud de WebSocket para asegurarnos de que se haya establecido la conexión
        cy.intercept('GET', '/api/socket/io*', {
            statusCode: 200,
            body: {},
        }).as('socketConnection'); // Alias para la conexión

        // Montamos el componente con el proveedor de socket
        mount(
            <SocketProvider>
                <SocketIndicator />
            </SocketProvider>
        );

        // Esperamos a que la conexión se haya establecido
        cy.wait('@socketConnection', { timeout: 10000 }); // Aumenta el tiempo de espera si es necesario


    });


    it('should show "Fallback: Polling every 1s" when disconnected', () => {
        // Montamos el componente con el proveedor de socket
        mount(
            <SocketProvider>
                <SocketIndicator />
            </SocketProvider>
        );

        // Verificamos si el badge de "Fallback" está presente cuando está desconectado
        cy.get('.bg-yellow-600')  // Clase del badge amarillo para estado "Polling"
            .should('contain.text', 'Fallback: Polling every 1s')
            .and('have.class', 'bg-yellow-600');
    });
});
