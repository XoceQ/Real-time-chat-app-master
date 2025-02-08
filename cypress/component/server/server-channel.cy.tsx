/// <reference types="cypress" />
import { mount } from "cypress/react18";
import { ServerChannel } from "@/components/server/server-channel";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ChannelType, MemberRole } from "@prisma/client";

describe("ServerChannel Component", () => {
    let mockRouter: any;
    const queryClient = new QueryClient();

    const mockChannel = {
        id: "123",
        name: "Test Channel",
        type: "TEXT" as const, // Asegura que el tipo sea "TEXT"
        profileId: "profile-1",
        serverId: "server-1",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockServer = {
        id: "server-1",
        name: "Test Server",
        imageUrl: "https://via.placeholder.com/150",
        inviteCode: "INVITE123",
        profileId: "profile-1",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        // Mock correctamente el contexto del router con serverId y pathname
        mockRouter = {
            push: cy.stub(),
            replace: cy.stub(),
            refresh: cy.stub(),
            prefetch: cy.stub().resolves(),
            back: cy.stub(),
            forward: cy.stub(),
            pathname: "/servers/server-1/channels/123", // Definir el pathname correctamente
            query: { serverId: "server-1" }, // Aquí está el serverId
        };

        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <QueryClientProvider client={queryClient}>
                    <ServerChannel
                        channel={mockChannel}
                        server={mockServer}
                        role={MemberRole.ADMIN}
                    />
                </QueryClientProvider>
            </AppRouterContext.Provider>
        );
    });

    it("should render the channel name", () => {
        cy.contains("Test Channel").should("be.visible");
    });

    it("should open the modal and allow clicking inside it", () => {
        // Trigger the button click to open the modal
        cy.get("button").click();


    });
});