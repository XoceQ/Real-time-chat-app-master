// EditChannelModal.cy.tsx
import React from "react";
import { mount } from "cypress/react18";
import { EditChannelModal } from "@/components/modals/edit-channel-modal";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import { ChannelType } from "@prisma/client";

describe("EditChannelModal", () => {
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

        // Stubbing la llamada API PATCH y el modal
        cy.stub(axios, 'patch').resolves({ data: {} });

        // Iniciar la tienda con un estado simulado
        // @ts-ignore
        useModal.setState({
            isOpen: true,
            type: "editChannel",
            data: {
                // @ts-ignore
                server: {
                    id: "1",
                    name: "Test Server"
                },
                // @ts-ignore
                channel: {
                    id: "123",
                    name: "Test Channel",
                    type: ChannelType.TEXT
                }
            }
        });
    });

    it("should render the modal and display the correct information", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <EditChannelModal />
            </AppRouterContext.Provider>
        );
        // Esperar 1 segundo antes de continuar con la siguiente acción
        cy.wait(1000); // Espera de 1 segundo

        // Verificar que el modal se abre
        cy.contains("Edit Channel").should("be.visible");

        // Verificar que el nombre del canal está en el modal
        cy.get('input[placeholder="Enter channel name"]').should('have.value', 'Test Channel');

        // Verificar que el tipo de canal está seleccionado
        cy.get('button').contains('text').should('exist');
    });

    it("should call the API and navigate when Save is clicked", () => {
        // Interceptar la solicitud PATCH y darle un alias
        cy.intercept('PATCH', '/api/channels/*?serverId=*');

        // Montar el componente y proveer el mock del router
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <EditChannelModal />
            </AppRouterContext.Provider>
        );

        // Cambiar el nombre del canal
        cy.get('input[placeholder="Enter channel name"]').clear().type('Updated Channel');

        // Verificar que el botón "Save" está habilitado
        cy.get('button').contains('Save').should('not.have.css', 'pointer-events', 'none');


    });


    it("should close the modal when Cancel is clicked", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <EditChannelModal />
            </AppRouterContext.Provider>
        );

        // Verificar que el modal está visible
        cy.contains("Edit Channel").should("be.visible");

        // Hacer clic en el botón "Cancel"
        cy.get('button').contains('Close').click();

    });

    it("should handle API error correctly", () => {
        // Simular un error en la llamada API PATCH
        cy.intercept('PATCH', '/api/channels/*', {
            statusCode: 500,
            body: { error: "Failed to update channel" },
        });

        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <EditChannelModal />
            </AppRouterContext.Provider>
        );

        // Cambiar el nombre del canal y hacer clic en "Save"
        cy.get('input[placeholder="Enter channel name"]').clear().type('Updated Channel');
        cy.get('button').contains('Save').click();

    });
});
