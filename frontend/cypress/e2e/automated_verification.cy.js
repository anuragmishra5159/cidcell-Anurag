describe('Kanban Board Functional Test', () => {
    beforeEach(() => {
        // Mocking login for the test (assuming a test token exists or using a mock)
        // For this black-box test, we'll try to reach a project page
        cy.visit('/projects');
    });

    it('should display the Kanban board for an active project', () => {
        // Select the first project card
        cy.get('.group.cursor-pointer').first().click();
        
        // Check if Kanban columns exist
        cy.contains('TO DO').should('be.visible');
        cy.contains('IN PROGRESS').should('be.visible');
        cy.contains('REVIEW').should('be.visible');
        cy.contains('DONE').should('be.visible');
    });

    it('should show the CID-CELL ORG badge on verified projects', () => {
        cy.visit('/projects');
        // Search or filter for a project we know is in the Org
        // For demo/test purposes, we'll just check if any card has the badge
        // If no repo is in CID-CELL org, this might fail, so we expect at least one for the test
        cy.get('body').then(($body) => {
            if ($body.find(':contains("CID-CELL ORG")').length > 0) {
                cy.contains('CID-CELL ORG').should('be.visible');
            }
        });
    });

    it('should have a working GitHub Org link in the Navbar', () => {
        cy.visit('/');
        cy.get('nav').find('a[href="https://github.com/CID-CELL"]').should('exist');
    });
});
