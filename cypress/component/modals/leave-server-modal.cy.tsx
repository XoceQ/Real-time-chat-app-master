// LeaveServerModal.cy.tsx
import React from "react";
import { mount } from "cypress/react18";
import { LeaveServerModal } from "@/components/modals/leave-server-modal";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";

describe("LeaveServerModal", () => {
    let mockRouter: any;

    beforeEach(() => {
        // Definir el mock del router de Next.js
        mockRouter = {
            back: cy.stub(),
            forward: cy.stub(),
            refresh: cy.stub(),
            push: cy.stub(),
            replace: cy.stub(),
            prefetch: cy.stub(),
        };

        // Stubbing la llamada a la API de axios
        cy.stub(axios, 'patch').as('patchLeaveServer').resolves({ data: {} });

        // Iniciar la tienda con un estado simulado para el modal
        useModal.setState({
            isOpen: true,
            type: "leaveServer",
            data: {
                server: {
                    id: "1",
                    name: "Test Server", // Nombre del servidor
                    imageUrl: "http://example.com/image.png", // URL de la imagen (puedes usar un valor de prueba)
                    inviteCode: "test-invite-code", // Código de invitación (puedes usar un valor de prueba)
                    profileId: "profile-1", // ID del perfil (puedes usar un valor de prueba)
                    createdAt: new Date(), // Fecha de creación
                    updatedAt: new Date(), // Fecha de actualización
                }
            },
        });
    });

    it("should render the modal", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <LeaveServerModal />
            </AppRouterContext.Provider>
        );

        // Verificar que el modal se está renderizando correctamente
        cy.contains("Leave Server").should("be.visible");
    });

    it("should close the modal when Cancel is clicked", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <LeaveServerModal />
            </AppRouterContext.Provider>
        );

        // Verificar que el botón Cancel está presente y hacer clic
        cy.get('button').contains('Cancel').click();

        // Verificar que el router no se ha navegado ni se ha hecho llamada a la API
        cy.wrap(mockRouter.refresh).should("not.have.been.called");
        cy.wrap(mockRouter.push).should("not.have.been.called");
    });

    it("should handle error when API fails", () => {
        // Simular un error en la llamada API PATCH
        cy.intercept('PATCH', '/api/servers/*/leave', (req) => {
            console.log('Intercepted request:', req); // Verifica que la solicitud está siendo interceptada
            req.reply({
                statusCode: 500,
                body: { error: "Server error" },
            });
        }).as('patchLeaveServer'); // Usar el alias correcto

        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <LeaveServerModal />
            </AppRouterContext.Provider>
        );

        // Hacer clic en el botón 'Confirm' usando el texto visible en el botón
        cy.contains('button', 'Confirm').click();


    });


    it("should disable buttons when loading", () => {
        // Cambiar el estado de carga

        useModal.setState({
            isOpen: true,
            type: "leaveServer",
            data: {
                // @ts-ignore
                server: { id: "1", name: "Test Server" },
            },
        });

        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <LeaveServerModal />
            </AppRouterContext.Provider>
        );


    });
    it("should handle error when API fails", () => {
        // Simular un error en la llamada API PATCH
        cy.intercept('PATCH', '/api/servers/*/leave', {
            statusCode: 500,
            body: { error: "Server error" },
        }).as('patchLeaveServerError');

        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <LeaveServerModal />
            </AppRouterContext.Provider>
        );

        // Hacer clic en el botón 'Confirm' usando el texto visible en el botón
        cy.contains('button', 'Confirm').click();

    });

});
