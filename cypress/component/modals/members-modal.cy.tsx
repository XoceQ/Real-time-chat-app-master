import React from "react";
import { mount } from "cypress/react18";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { MembersModal } from "@/components/modals/members-modal";
import { useModal } from "@/hooks/use-modal-store";

describe("MembersModal", () => {
    let mockRouter: any;

    beforeEach(() => {
        // Simulación del router de Next.js
        mockRouter = {
            refresh: cy.stub().as("refresh"),
            push: cy.stub(),
            replace: cy.stub(),
        };

        // Estado simulado del modal CON todas las propiedades requeridas

        useModal.setState({
            isOpen: true,
            type: "members",
            data: {
                server: {
                    id: "server-id",
                    name: "Test Server",
                    imageUrl: "https://example.com/image.png",
                    inviteCode: "ABC123",
                    profileId: "profile-id",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    // @ts-ignore
                    members: [
                        {
                            id: "member-1",
                            profile: {
                                name: "John Doe",
                                email: "john@example.com",
                                imageUrl: "https://example.com/john.png"
                            },
                            role: "GUEST",
                            profileId: "profile-1",
                        },
                        {
                            id: "member-2",
                            profile: {
                                name: "Jane Smith",
                                email: "jane@example.com",
                                imageUrl: "https://example.com/jane.png"
                            },
                            role: "MODERATOR",
                            profileId: "profile-2",
                        },
                        {
                            id: "member-3",
                            profile: {
                                name: "Alice Johnson",
                                email: "alice@example.com",
                                imageUrl: "https://example.com/alice.png"
                            },
                            role: "ADMIN",
                            profileId: "profile-3",
                        }
                    ],
                },
            },
        });
    });

    it("debería renderizar el modal correctamente", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <MembersModal />
            </AppRouterContext.Provider>
        );

        // Verificar que el modal aparece
        cy.contains("Manage Members").should("be.visible");

    });

    it("debería hacer clic en el botón ", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <MembersModal />
            </AppRouterContext.Provider>
        );

        // Esperar a que el botón sea visible y hacer clic en él
        cy.get('button[type="button"]').should('be.visible');

    });


    it("debería mostrar las opciones del menú correctamente", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <MembersModal />
            </AppRouterContext.Provider>
        );

        // Hacer clic en el primer SVG de 'MoreVertical' para abrir el menú
        cy.get('svg.lucide-more-vertical').first().should('be.visible').click();

        // Hacer clic en el SVG con las clases específicas dentro de #radix-:rs:
        cy.get('#radix-\\:rs\\: > svg.lucide.lucide-chevron-right.ml-auto.h-4.w-4')
            .should('be.visible')
            .click();

    });
});
