import React from "react";
import { mount } from "cypress/react18";
import { DeleteMessageModal } from "@/components/modals/delete-message-modal";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";

describe("DeleteMessageModal", () => {
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

        // Mock de la API DELETE
        cy.stub(axios, "delete").resolves({ data: {} });

        // Simular el estado del modal
        // @ts-ignore
        useModal.setState({
            isOpen: true,
            type: "deleteMessage",
            data: {
                apiUrl: "https://api.example.com/messages/1",
                query: {},
            },
            onClose: cy.spy().as("onCloseStub"),
        });
    });

    it("should render the modal correctly", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <DeleteMessageModal />
            </AppRouterContext.Provider>
        );

        cy.contains("Delete Message").should("be.visible");
        cy.contains("Are you sure you want to do this?").should("be.visible");
    });

    it("should call onClose when Cancel is clicked", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <DeleteMessageModal />
            </AppRouterContext.Provider>
        );

        cy.contains("Cancel").click();
        cy.get("@onCloseStub").should("have.been.called");
    });

    it("should make a DELETE request when Confirm is clicked", () => {
        cy.intercept("DELETE", "https://api.example.com/messages/1", {
            statusCode: 200,
            body: {},
        });

        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <DeleteMessageModal />
            </AppRouterContext.Provider>
        );

        cy.contains("Confirm").click();
    });

    it("should handle API error correctly", () => {
        cy.intercept("DELETE", "https://api.example.com/messages/1", {
            statusCode: 500,
            body: { error: "Failed to delete message" },
        });

        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <DeleteMessageModal />
            </AppRouterContext.Provider>
        );

        cy.contains("Confirm").click();
    });
});
