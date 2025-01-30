import React from "react";
import { mount } from "cypress/react18";
import { ServerSearch } from "@/components/server/server-search";
import { Search } from "lucide-react";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

describe("ServerSearch Component", () => {
    const mockData = [
        {
            label: "Channels",
            type: "channel" as const,
            data: [
                { id: "1", name: "General", icon: <Search /> },
                { id: "2", name: "Random", icon: <Search /> },
            ],
        },
        {
            label: "Members",
            type: "member" as const,
            data: [
                { id: "3", name: "Alice", icon: <Search /> },
                { id: "4", name: "Bob", icon: <Search /> },
            ],
        },
    ];

    let mockRouter: any;

    beforeEach(() => {
        mockRouter = {
            push: cy.spy(),
            prefetch: cy.spy(),
            replace: cy.spy(),
            refresh: cy.spy(),
            back: cy.spy(),
            forward: cy.spy(),
            pathname: "/",
            query: {},
            asPath: "/",
            isFallback: false,
        };
    });

    it("renders the search button", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <ServerSearch data={mockData} />
            </AppRouterContext.Provider>
        );
        cy.get("button").contains("Search").should("be.visible");
    });

    it("opens search dialog on button click", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <ServerSearch data={mockData} />
            </AppRouterContext.Provider>
        );
        cy.get("button").click();
        cy.get("[role=dialog]").should("exist");
    });

    it("closes search dialog when an item is clicked", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <ServerSearch data={mockData} />
            </AppRouterContext.Provider>
        );
        cy.get("button").click();
        cy.contains("General").click();
        cy.get("[role=dialog]").should("not.exist");
    });

    it("displays search results correctly", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <ServerSearch data={mockData} />
            </AppRouterContext.Provider>
        );
        cy.get("button").click();
        cy.get("[role=dialog]").contains("Channels").should("be.visible");
        cy.get("[role=dialog]").contains("General").should("be.visible");
        cy.get("[role=dialog]").contains("Members").should("be.visible");
        cy.get("[role=dialog]").contains("Alice").should("be.visible");
    });



    it("opens search dialog with Ctrl+K", () => {
        mount(
            <AppRouterContext.Provider value={mockRouter}>
                <ServerSearch data={mockData} />
            </AppRouterContext.Provider>
        );
        cy.get("body").type("{ctrl}k");
        cy.get("[role=dialog]").should("exist");
    });
});
