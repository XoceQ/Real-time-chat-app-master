/// <reference types="cypress" />

import React from 'react';
import { UserAvatar } from "@/components/user-avatar";

describe('UserAvatar Component', () => {
    it('renders with default styles when no className is provided', () => {
        // URL de la imagen externa
        const imageUrl = "https://c7.alamy.com/comp/2FYNAG0/airplane-fly-icon-plane-flying-with-line-travel-transportation-concept-2FYNAG0.jpg";

        // Montar el componente con la imagen
        cy.mount(<UserAvatar src={imageUrl} />);

        // Verificar que el elemento img tiene el atributo src correcto
        cy.get('img').should('have.attr', 'src', imageUrl);

        // Validar que las clases predeterminadas estén presentes
        cy.get('.h-7.w-7').should('exist');
    });

    it('applies additional class names passed via props', () => {
        const customClass = 'rounded-full border';
        cy.mount(<UserAvatar src="https://example.com/avatar.png" className={customClass} />);
        cy.get('.rounded-full.border').should('exist');
    });

    it('renders with a placeholder when no src is provided', () => {
        // Montar el componente sin pasar el src
        cy.mount(<UserAvatar />);

        // Verificar que no hay imágenes presentes
        cy.get('img').should('not.exist');

        // Verificar que las clases predeterminadas están presentes
        cy.get('.h-7.w-7').should('exist');
    });

    it('renders with responsive sizes based on default classNames', () => {
        cy.mount(<UserAvatar />);
        cy.get('.h-7.w-7.md\\:h-10.md\\:w-10').should('exist');
    });
});
