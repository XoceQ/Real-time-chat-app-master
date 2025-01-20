/// <reference types="cypress" />
import { ChatInput } from "@/components/chat/chat-input";
import { mount } from "cypress/react18";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

describe("ChatInput Component", () => {
    const apiUrl = "http://localhost:3000/api/chat";
    const query = { roomId: "123" };
    const name = "Test Room";
    const type = "conversation";
    let mockRouter: any;

    beforeEach(() => {
        mockRouter = {
            push: cy.stub(),
            replace: cy.stub(),
            refresh: cy.stub(),
            prefetch: cy.stub().resolves(),
            back: cy.stub(),
            forward: cy.stub(),
            pathname: "/",
            query: {},
        };

        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <ChatInput apiUrl={apiUrl} query={query} name={name} type={type} />
            </AppRouterContext.Provider>
        );
    });

    it("should render input field", () => {
        cy.get("input").should("be.visible");
    });

    it("should type a message into the input field", () => {
        cy.get("input").type("Hello, world!").should("have.value", "Hello, world!");
    });


});
