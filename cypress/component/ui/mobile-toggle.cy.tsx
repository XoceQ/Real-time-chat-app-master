import {MobileToggle} from "@/components/mobile-toggle";
import {NavigationSidebar} from "@/components/navigation/navigation-sidebar";
import {ServerSidebar} from "@/components/server/server-sidebar";

describe('MobileToggle Component', () => {
    const serverId = 'test-server-id';

    beforeEach(() => {
        cy.mount(<MobileToggle serverId={serverId} />);
    });

    it('should render the toggle button', () => {
        cy.get('button.md\\:hidden').should('exist');
        cy.get('button.md\\:hidden').find('svg').should('have.class', 'lucide-menu');
    });

    it("should open the sheet when the toggle button is clicked", async () => {
        const serverId = "server123"; // Define el serverId directamente
        cy.mount(<MobileToggle serverId={serverId} />);  // Pasa el serverId directamente al componente

        cy.get('button').click();  // Haz clic en el botón directamente sin la verificación de visibilidad
        cy.get('[data-state="open"]').should('exist');  // Verifica que la hoja se haya abierto
    });

    it("should render the sidebars inside the SheetContent", async () => {
        const serverId = "server123"; // Define el serverId directamente
        cy.mount(<MobileToggle serverId={serverId} />);  // Pasa el serverId directamente al componente

        cy.viewport('iphone-6'); // Ajusta la vista para simular un dispositivo móvil

        cy.get('button').click();  // Haz clic en el botón directamente sin la verificación de visibilidad
        cy.get('[data-state="open"]').should('exist');  // Verifica que la hoja se haya abierto

        // Verifica que los sidebars estén dentro del contenido de la hoja
        cy.get('div').contains('Mocked Navigation Sidebar').should('exist');
        cy.get('div').contains('Mocked Server Sidebar').should('exist');
    });

});