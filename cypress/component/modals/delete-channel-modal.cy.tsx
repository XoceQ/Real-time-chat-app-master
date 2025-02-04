// DeleteChannelModal.cy.tsx
import React from "react";
import { mount } from "cypress/react18";
import { DeleteChannelModal } from "@/components/modals/delete-channel-modal";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";

describe("DeleteChannelModal", () => {
    let mockRouter: any;

    beforeEach(() => {
        // Mock del router de Next.js
        mockRouter = {
            back: cy.stub(),
            forward: cy.stub(),
            refresh: cy.stub(),
            push: cy.stub(),
            replace: cy.stub(),
            prefetch: cy.stub(),
        };

        // Stubbing el llamada API y el modal
        cy.stub(axios, 'delete').resolves({ data: {} });

        // Iniciar la tienda con un estado simulado
        // @ts-ignore
        useModal.setState({
            isOpen: true,
            type: "deleteChannel",
            data: {
                // @ts-ignore

                server: {
                    id: "1",
                    name: "Test Server"
                },
                // @ts-ignore

                channel: {
                    id: "123",
                    name: "Test Channel"
                }
            }
        });
    });

    it("should render the modal and display the correct information", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <DeleteChannelModal />
            </AppRouterContext.Provider>
        );
        // Esperar 1 segundo antes de continuar con la siguiente acción
        cy.wait(1000); // Espera de 1 segundo


        // Verificar que el modal se abre
        cy.contains("Delete Channel").should("be.visible");

        // Esperar 1 segundo antes de continuar con la siguiente acción
        cy.wait(1000); // Espera de 1 segundo

        // Verificar que el nombre del canal está en el modal
        cy.contains("#Test Channel").should("be.visible");
    });

    it("should call the API and navigate when Confirm is clicked", () => {
        // Interceptar la solicitud DELETE y darle un alias
        cy.intercept('DELETE', '/api/channels/*').as('deleteChannel');

        // Montar el componente y proveer el mock del router
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <DeleteChannelModal />
            </AppRouterContext.Provider>
        );

        // Verificar que el botón "Confirm" está visible y hacer clic
        cy.get('button').contains('Confirm').click();


        // Verificar que el router redirige después de la eliminación
        cy.wrap(mockRouter.push).should('have.been.calledWith', '/servers/1');
    });


    it("should close the modal when Cancel is clicked", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <DeleteChannelModal />
            </AppRouterContext.Provider>
        );

        // Verificar que el modal está visible
        cy.contains("Delete Channel").should("be.visible");

        // Hacer clic en el botón "Cancel"
        cy.get('button').contains('Cancel').click();

        // Verificar que el modal se cierra
        cy.contains("Delete Channel").should("not.exist");
    });

    it("should handle API error correctly", () => {
        // Simular un error en la llamada API DELETE
        cy.intercept('DELETE', '/api/channels/*', {
            statusCode: 500,
            body: { error: "Failed to delete channel" },
        }).as('deleteChannelError');

        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <DeleteChannelModal />
            </AppRouterContext.Provider>
        );

        // Hacer clic en el botón "Confirm"
        cy.get('button').contains('Confirm').click();


    });
});
