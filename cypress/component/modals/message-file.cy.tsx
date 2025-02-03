import { mount } from "cypress/react18";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { MessageFileModal } from "@/components/modals/message-file-modal";
import { useModal } from "@/hooks/use-modal-store";
import "cypress-file-upload";

describe("MessageFileModal", () => {
    let mockRouter: any;

    beforeEach(() => {
        // Mock del router
        mockRouter = {
            push: cy.stub(),
            back: cy.stub(),
            forward: cy.stub(),
            refresh: cy.stub(),
            replace: cy.stub(),
            prefetch: cy.stub(),
        };



        // Iniciar la tienda con un estado simulado
        useModal.setState({
            isOpen: true,
            type: "messageFile",
            data: { apiUrl: "https://example.com/api", query: {} },
        });
    });

    it("renders the modal with correct title", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <MessageFileModal />
            </AppRouterContext.Provider>
        );

    });

    it("renders the modal correctly", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <MessageFileModal />
            </AppRouterContext.Provider>
        );

        // Verificar que el modal aparece
        cy.contains("Add an attachment").should("be.visible");
        cy.contains("Send a file as a message").should("be.visible");


    });

    it("allows file upload and enables the send button", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <MessageFileModal />
            </AppRouterContext.Provider>
        );

        // Base64 encoded PNG file
        const base64File = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgAB/0b8+E8AAAAASUVORK5CYII=";

        // Convert base64 to a Blob
        const byteCharacters = atob(base64File); // Decode base64
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });

        // Attach the Blob as a file
        cy.get("input[type='file']").attachFile({
            fileContent: blob, // Use the Blob here
            fileName: 'test-file.png',
            mimeType: 'image/png'
        });

        // Verify that the button is now enabled
        cy.get("button").contains("Send").should("not.be.disabled");
    });


    it("submits the form correctly", () => {
        // Intercept the correct API endpoint used by the application
        cy.intercept("POST", "/api/uploadthing", {
            statusCode: 200,
            body: { success: true }
        }).as("postMessage");

        // If there's a GET request required by the component, intercept it too
        cy.intercept("GET", "/api/uploadthing", {
            statusCode: 200,
            body: {}
        });


    });
});
