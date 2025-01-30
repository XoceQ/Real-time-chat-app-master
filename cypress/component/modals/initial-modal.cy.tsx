/// <reference types="cypress" />
import React from "react";
import { mount } from "cypress/react18";
import { InitialModal } from "@/components/modals/initial-modal";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

describe("InitialModal Component", () => {
    let mockRouter: any;

    beforeEach(() => {
        cy.viewport(500, 500);
        cy.intercept("POST", "/api/servers", { statusCode: 200 }).as("postServer");

        // Definir el mock del enrutador dentro de beforeEach()
        mockRouter = {
            push: cy.stub(),
            replace: cy.stub(),
            refresh: cy.stub(),
            back: cy.stub(),
            forward: cy.stub(),
            prefetch: cy.stub(),
            pathname: "/",
            query: {},
        };
    });

    it("renders the modal correctly", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <InitialModal />
            </AppRouterContext.Provider>
        );

        cy.get("[role=dialog]").should("exist");
        cy.contains("Customize").should("be.visible");
    });

    it("validates the form and submits correctly", () => {
        // Set up intercept for the correct route
        cy.intercept('POST', '/api/servers').as('postServer');  // Intercept the correct route

        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <InitialModal />
            </AppRouterContext.Provider>
        );

        // Verifica que el input del servidor exista y escribe en él
        cy.get("input[placeholder='Enter sever name']").should("exist").type("Test Server");

        // Verifica que el botón exista y haz clic en él
        cy.get("button").contains("Create").should("exist").click();

    });

});
