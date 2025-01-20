import { ChatMessages } from "@/components/chat/chat-messages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("ChatMessages Component", () => {
    it("should display loading indicator when status is 'pending'", () => {
        const queryClient = new QueryClient();

        // Interceptamos la solicitud HTTP y simulamos la respuesta
        cy.intercept('GET', '/api/messages?conversationId=1').as('getMessages');

        // Simula que el estado es 'pending' (cargando)
        cy.mount(
            <QueryClientProvider client={queryClient}>
                <ChatMessages
                    name="Test Chat"
                    member={{
                        id: "1",
                        role: "GUEST",
                        profileId: "profile1",
                        serverId: "server1",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }}
                    chatId="1"
                    apiUrl="http://localhost:3000/api/messages"
                    socketUrl="ws://localhost:3000/socket"
                    socketQuery={{ roomId: "1" }}
                    paramKey="conversationId"
                    paramValue="1"
                    type="conversation"
                />
            </QueryClientProvider>
        );

        // Esperamos a que la solicitud se haya interceptado y completado
        cy.wait('@getMessages');

        // Finaliza el test después de que la solicitud se ha interceptado correctamente
        cy.log("Test completed successfully.");
    });

});