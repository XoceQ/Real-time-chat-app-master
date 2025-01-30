/// <reference types="cypress" />
import { mount } from "cypress/react18";
import { ServerMember } from "@/components/server/server-member";
import { MemberRole, Member, Profile, Server } from "@prisma/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Mock data for the tests
const mockMember: Member & { profile: Profile } = {
    id: "123",
    profileId: "profile-123", // Added the profileId property
    profile: {
        id: "profile-123",
        userId: "user-123",
        name: "John Doe",
        email: "john.doe@example.com",
        imageUrl: "https://via.placeholder.com/150",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    role: MemberRole.ADMIN,
    serverId: "server-1",
    createdAt: new Date(),
    updatedAt: new Date(),
};


const mockServer: Server = {
    id: "server-1",
    name: "Test Server",
    imageUrl: "https://via.placeholder.com/150",
    inviteCode: "INVITE123",
    profileId: "profile-1",
    createdAt: new Date(),
    updatedAt: new Date(),
};

describe("ServerMember Component", () => {
    let mockRouter: any;
    const queryClient = new QueryClient();


    beforeEach(() => {
        // Mock the router context
        mockRouter = {
            push: cy.stub(),
            replace: cy.stub(),
            refresh: cy.stub(),
            prefetch: cy.stub().resolves(),
            back: cy.stub(),
            forward: cy.stub(),
            pathname: "/servers/server-1/channels/123", // Correctly setting the serverId in pathname
            query: { serverId: "server-1" },
            params: { serverId: "server-1" }, // Mock serverId in params

        };

        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <QueryClientProvider client={queryClient}>
                    <ServerMember member={mockMember} server={mockServer} />
                </QueryClientProvider>
            </AppRouterContext.Provider>
        );
    });

    it("should render the member's name and avatar", () => {
        cy.get("p").contains("John Doe").should("be.visible");
    });

    it("should show the correct role icon for ADMIN", () => {
        cy.get("button")
            .should("contain", "John Doe") // Ensure the name is visible
            .find("svg.lucide-shield-alert") // Find the SVG icon by its class
            .should("have.attr", "stroke", "currentColor") // Check for the correct stroke color
            .should("have.attr", "class", "lucide lucide-shield-alert h-4 w-4 ml-2 text-rose-500"); // Check the exact class
    });



});
