import React from "react";
import { mount } from "cypress/react18";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import { ChannelType } from "@prisma/client";

describe("CreateChannelModal Component", () => {
    let mockRouter: any; // Permite flexibilidad en el tipado

    beforeEach(() => {
        mockRouter = {
            push: cy.stub(),
            refresh: cy.stub(),
            back: cy.stub(),
            forward: cy.stub(),
            replace: cy.stub(),
            prefetch: cy.stub(),
        };

        cy.stub(axios, "post").resolves({ data: {} });

        useModal.setState({
            isOpen: true,
            onClose: cy.stub(),
            type: "createChannel",
            data: { channelType: ChannelType.TEXT },
        });
    });



    it("should render modal correctly", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <CreateChannelModal />
            </AppRouterContext.Provider>
        );

        cy.contains("Create Channel").should("be.visible");
    });

    it("should allow user to enter a channel name", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <CreateChannelModal />
            </AppRouterContext.Provider>
        );

        cy.get("input[placeholder='Enter channel name']")
            .type("My Channel")
            .should("have.value", "My Channel");
    });

    it("should call API and close modal on submit", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <CreateChannelModal />
            </AppRouterContext.Provider>
        );

        cy.get("input[placeholder='Enter channel name']").type("New Channel");
        cy.get("button").contains("Create").click();

        cy.wrap(axios.post).should("have.been.called");
        cy.wrap(useModal.getState().onClose).should("have.been.called");
    });

    it("should close the modal when the close button is clicked", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <CreateChannelModal />
            </AppRouterContext.Provider>
        );

        cy.get("button.absolute.right-4.top-4.rounded-sm").click();    });
});
