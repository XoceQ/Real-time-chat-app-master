/// <reference types="cypress" />
import React from "react";
import { EmojiPicker } from "@/components/emoji-picker";
import { mount } from "cypress/react18";
import {ThemeProvider} from "@/components/providers/theme-provider";

describe("EmojiPicker Component ", () => {
    it("should render the emoji selector", () => {
        // Montar el componente
        mount(<EmojiPicker onChange={() => {}} />);

        // Verificar que el botón de emoji (Smile) es visible y hacer clic en él para abrir el selector
        cy.get("svg")
            .should("be.visible")
            .click(); // Abrir el selector de emojis

        // Asegurarse de que el popover esté visible
        cy.get("[role='dialog']")
            .should("be.visible"); // Verificar que el selector de emojis se haya renderizado
    });

    it("should be adapted to the current theme", () => {
        // Forzar el tema a 'dark' mediante el ThemeProvider
        const mockTheme = "dark";

        // Montar el componente con ThemeProvider
        mount(
            <ThemeProvider attribute="class" defaultTheme={mockTheme}>
                <EmojiPicker onChange={cy.spy().as("onChangeSpy")} />
            </ThemeProvider>
        );

        // Abrir el selector de emojis
        cy.get("svg")
            .should("be.visible")
            .click();

        // Verificar que el popover se muestra
        cy.get("[role='dialog']").should("exist");

        // Verificar que el tema dark está presente en la clase del dialog
        // En caso de que el tema esté aplicado a un nivel superior, revisa el DOM para ver dónde se encuentra la clase 'dark'.
        cy.get("html").should("have.class", "dark"); // Verifica en el nivel raíz
    });
});
