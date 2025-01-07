import React from 'react';
import { mount } from 'cypress/react18';
import { CreateChannelModal } from '@/components/modals/create-channel-modal';
import { useModal } from '@/hooks/use-modal-store';
import { ChannelType } from '@prisma/client';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context';


// Mock the useModal hook
const mockUseModal = () => ({
    isOpen: true,
    onOpen: cy.stub(),
    onClose: cy.stub(),
    type: 'createChannel',
    data: {
        channelType: ChannelType.TEXT,
    },
});

const MockAppRouterContext = ({ children }: { children: React.ReactNode }) => {
    const mockRouter = {
        push: cy.stub().as('routerPush'),
        replace: cy.stub().as('routerReplace'),
        back: cy.stub().as('routerBack'),
        forward: cy.stub().as('routerForward'),
        refresh: cy.stub().as('routerRefresh'),
        prefetch: cy.stub().as('routerPrefetch'),
    };

    return (
        <AppRouterContext.Provider value={mockRouter as any}>
            {children}
        </AppRouterContext.Provider>
    );
};

describe('CreateChannelModal', () => {
    beforeEach(() => {
        cy.stub(require('@/hooks/use-modal-store'), 'useModal').as('useModalStub').callsFake(mockUseModal);

        mount(
            <MockAppRouterContext>
                <CreateChannelModal/>
            </MockAppRouterContext>
        );
    });

    it('should render the modal with correct title and fields', () => {
        cy.get('[data-cy="dialog-title"]').should('contain.text', 'Create Channel');
        cy.get('input[placeholder="Enter channel name"]').should('be.visible');
        cy.get('button[role="combobox"]').should('contain.text', 'Select a channel type');
        cy.get('button[type="submit"]').should('be.visible').and('contain.text', 'Create');
    });


    it('should close the modal when the close button is clicked', () => {
        cy.get('button[aria-label="Close"]').click();
        cy.get('@useModalStub').its('onClose').should('be.called');
    });
    it('should display an error message when the channel name is empty', () => {
        cy.get('button[type="submit"]').should('be.disabled');
        cy.get('input[placeholder="Enter channel name"]').focus().blur();
        cy.get('div[role="alert"]').should('contain.text', 'Channel name is required');
    });
    it('should display an error message when the channel name is "general"', () => {
        cy.get('input[placeholder="Enter channel name"]').type('general');
        cy.get('button[type="submit"]').should('be.disabled');
        cy.get('div[role="alert"]').should('contain.text', "Channel name cannot be 'general'");

    });
    it('should enable the submit button when the form is valid', () => {
        cy.get('input[placeholder="Enter channel name"]').type('test-channel');
        cy.get('button[type="submit"]').should('not.be.disabled');
    });

    it('should select channel type TEXT', () => {
        cy.get('button[role="combobox"]').click();
        cy.get('div[role="listbox"]').contains('TEXT').click();
        cy.get('button[role="combobox"]').should('contain.text', 'TEXT');
    })

    it('should submit the form with correct data and close the modal on success', () => {
        cy.intercept('POST', '/api/channels*', { statusCode: 200 }).as('createChannel');
        cy.get('input[placeholder="Enter channel name"]').type('test-channel');

        cy.get('button[type="submit"]').click();
        cy.wait('@createChannel').then((interception) => {
            expect(interception.request.body).to.deep.equal({
                name: 'test-channel',
                type: ChannelType.TEXT
            });
        });
        cy.get('@useModalStub').its('onClose').should('be.called');
        cy.get('@routerRefresh').should('be.called')
    });

    it('should disable the form during submission', () => {
        cy.intercept('POST', '/api/channels*', { delay: 1000, statusCode: 200 }).as('createChannel');
        cy.get('input[placeholder="Enter channel name"]').type('test-channel');
        cy.get('button[type="submit"]').click();
        cy.get('input[placeholder="Enter channel name"]').should('be.disabled');
        cy.get('button[type="submit"]').should('be.disabled');
        cy.wait('@createChannel');
    });

    it('should not close the modal if submit fails', () => {
        cy.intercept('POST', '/api/channels*', { statusCode: 500 }).as('createChannel');
        cy.get('input[placeholder="Enter channel name"]').type('test-channel');
        cy.get('button[type="submit"]').click();
        cy.wait('@createChannel');
        cy.get('@useModalStub').its('onClose').should('not.be.called');
    });

});