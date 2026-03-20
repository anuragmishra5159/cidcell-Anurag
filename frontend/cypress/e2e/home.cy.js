describe('CID-Cell Application Landing Page', () => {
  it('should successfully load the home page', () => {
    cy.visit('/');
    
    // Check if Navbar exists
    cy.get('nav').should('exist');
    
    // Check if the hero section text exists ("Bridging ACADEMICS WITH INDUSTRY")
    cy.contains('ACADEMICS').should('be.visible');
    cy.contains('WITH INDUSTRY').should('be.visible');
    
    // Check the Explore Projects CTA
    cy.contains('JOIN CID NOW').should('be.visible');
  });

  it('should navigate to the Projects page when clicking Explore Projects', () => {
    cy.visit('/');
    cy.contains('EXPLORE PROJECTS').click();
    cy.url().should('include', '/projects');
    cy.contains('Projects', { matchCase: false }).should('be.visible');
  });
});