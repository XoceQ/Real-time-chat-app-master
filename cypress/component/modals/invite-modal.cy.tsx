// InviteModal.cy.tsx
import React from "react";
import { mount } from "cypress/react18";
import { InviteModal } from "@/components/modals/invite-modal";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";

describe("InviteModal", () => {
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

        // Stubbing el clipboard y la llamada a la API
        cy.stub(window.navigator.clipboard, 'writeText').as('writeText');
        cy.stub(axios, 'patch').resolves({ data: { inviteCode: "new-invite-code" } });

        // Iniciar la tienda con un estado simulado
        useModal.setState({
            isOpen: true,
            type: "invite",
            data: {
                server: {
                    id: "1",
                    name: "Test Server", // Agregar nombre
                    imageUrl: "http://example.com/image.png", // Agregar URL de imagen
                    inviteCode: "test-invite-code",
                    profileId: "profile-1", // Agregar ID de perfil
                    createdAt: new Date(), // Agregar fecha de creación
                    updatedAt: new Date(), // Agregar fecha de actualización
                }
            },
        });
    });

    it("should render the modal", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <InviteModal />
            </AppRouterContext.Provider>
        );


    });
    it("should render the modal and display the invite link", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <InviteModal />
            </AppRouterContext.Provider>
        );

        // Verificar que el modal aparece
        cy.contains("Invite Friends").should("be.visible");

        // Verificar que el valor del input es el esperado (ajustado a localhost:8080)
        cy.get('input').should("have.value", "http://localhost:8080/invite/test-invite-code");
    });

    it("should copy the invite link to clipboard", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <InviteModal />
            </AppRouterContext.Provider>
        );

        // Verificar que el ícono SVG está visible y hacer clic en él
        cy.get('svg.lucide-copy').should("be.visible").click();

    });

    it("should generate a new invite link", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <InviteModal />
            </AppRouterContext.Provider>
        );

        // Verificar que el modal aparece
        cy.contains("Invite Friends").should("be.visible");

        // Verificar que el valor del input es el inicial
        cy.get('input').should("have.value", "http://localhost:8080/invite/test-invite-code");

        // Simular clic en el botón para generar un nuevo enlace
        cy.get('button').contains("Generate a new link").click();

        // Verificar que el nuevo enlace se genera y se muestra en el input
        cy.get('input').should("have.value", "http://localhost:8080/invite/new-invite-code"); // Ajusta esto según el nuevo enlace esperado
    });
});