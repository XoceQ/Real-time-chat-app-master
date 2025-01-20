/// <reference types="cypress" />
import { mount } from "cypress/react18";
import { ServerChannel } from "@/components/server/server-channel";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ChannelType, MemberRole } from "@prisma/client";

describe("ServerChannel Component", () => {
    const mockRouter = {
        push: cy.stub(),
        replace: cy.stub(),
        refresh: cy.stub(),
        prefetch: cy.stub().resolves(),
        back: cy.stub(),
        forward: cy.stub(),
        pathname: "/",
        query: {},
    };


    const queryClient = new QueryClient();

    const mockChannel = {
        id: "123",
        name: "Test Channel",
        type: "TEXT" as const, // Asegurar el tipo correcto
        profileId: "profile-1", // Se agrega la propiedad faltante
        serverId: "server-1",
        createdAt: new Date(), // Se agrega la propiedad faltante
        updatedAt: new Date(), // Se agrega la propiedad faltante
    };

    const mockServer = {
        id: "server-1",
        name: "Test Server",
        imageUrl: "https://via.placeholder.com/150", // URL ficticia
        inviteCode: "INVITE123", // Código de invitación ficticio
        profileId: "profile-1", // ID de perfil ficticio
        createdAt: new Date(), // Fecha de creación ficticia
        updatedAt: new Date(), // Fecha de actualización ficticia
    };


    beforeEach(() => {
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

    it("should navigate to the correct URL when clicked", () => {
        cy.get("button").click();
        cy.wrap(mockRouter.push).should("have.been.calledWith", "/servers/server-1/channels/123");
    });
});
