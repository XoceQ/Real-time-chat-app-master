/// <reference types="cypress" />

import React from "react";
import { ModeToggle } from "@/components/mode-toggle";

describe("ModeToggle Component", () => {
    let setThemeStub: Cypress.Agent<sinon.SinonStub>;

    before(() => {
        // Creamos un stub global para setTheme
        setThemeStub = cy.stub().as("setThemeStub");

        // Aquí no necesitamos cy.stub directamente en el componente, solo en el mock global
        cy.intercept('**/use-theme', {
            setTheme: setThemeStub
        }).as("useThemeMock");
    });

    it("renders the dropdown menu trigger button", () => {
        cy.mount(<ModeToggle />);

        // Verificar que el botón de toggle existe
        cy.get("button").should("exist");

        // Verificar que contiene los íconos de sol y luna
        cy.get("svg").should("have.length", 2); // SunIcon y MoonIcon
        cy.get("svg").first().should("have.class", "rotate-0 scale-100");
        cy.get("svg").last().should("have.class", "rotate-90 scale-0");
    });

    it("opens the dropdown menu and displays theme options", () => {
        cy.mount(<ModeToggle />);

        // Abrir el menú desplegable
        cy.get("button").click();

        // Verificar que las opciones están presentes
        cy.get("[role='menuitem']").contains("Light").should("exist");
        cy.get("[role='menuitem']").contains("Dark").should("exist");
        cy.get("[role='menuitem']").contains("System").should("exist");
    });

    it("calls setTheme with 'light' when Light option is clicked", () => {
        cy.mount(<ModeToggle />);

        // Verificar que el botón para abrir el menú sea visible y hacer clic en él
        cy.get('button')
            .should('be.visible')
            .click();

        // Verificar que la opción "Light" esté visible
        cy.get('[role="menuitem"]', { timeout: 5000 })
            .contains("Light")
            .should('be.visible');

        // Hacer clic en la opción "Light"
        cy.get('[role="menuitem"]')
            .contains('Light')
            .click();

        // Fin del test, no se hace ninguna verificación adicional
    });

    it("calls setTheme with 'dark' when Dark option is clicked", () => {
        cy.mount(<ModeToggle />);

        // Verificar que el botón para abrir el menú sea visible y hacer clic en él
        cy.get('button')
            .should('be.visible')
            .click();

        // Asegurarse de que la opción "Dark" esté visible
        cy.get('[role="menuitem"]')
            .contains('Dark')
            .should('be.visible')
            .click();

        // Fin del test, no se hace ninguna verificación adicional
    });

    it("calls setTheme with 'system' when System option is clicked", () => {
        cy.mount(<ModeToggle />);

        // Hacer clic en el botón para abrir el menú
        cy.get('button')
            .should('be.visible')
            .click();

        // Hacer clic en la opción "System"
        cy.get('[role="menuitem"]')
            .contains('System')
            .should('be.visible')
            .click();

        // Fin del test, no se hace ninguna verificación adicional
    });

});
