describe('Test for Step actions from the canvas', () => {
    beforeEach(() => {
        let url = Cypress.config().baseUrl;
        cy.visit(url);

        cy.intercept('/v1/integrations/dsls').as('getDSLs');
        cy.intercept('/v1/view-definitions').as('getViewDefinitions');
        cy.intercept('/v1/integrations*').as('getIntegration');

        // Upload the initial state (KafkaSourceSink.yaml)
        cy.get('[data-testid="toolbar-show-code-btn"]').click();
        cy.get('[data-testid="sourceCode--clearButton"]').should('be.visible').click({ force: true });
        cy.get('.pf-c-code-editor__main').should('be.visible');
        cy.get('.pf-c-code-editor__main > input').attachFile('TimerLogCamelRoute.yaml');
        cy.get('[data-testid="sourceCode--applyButton"]').click();

        // wait until the API returns the updated visualization
        cy.wait('@getIntegration');
        cy.wait('@getDSLs');
        cy.wait('@getViewDefinitions');
    });

    it(' User inserts a step between two steps (+ button in between two nodes)', () => {
        // Click insert button between two steps
        cy.get('[data-testid="stepNode__insertStep-btn"]').click();
        // Open the miniCatalog
        cy.get('[data-testid="miniCatalog"]').should('be.visible');
        // search aggregate step
        cy.get('.pf-c-text-input-group__text-input').type('aggregate');
        // select aggregate step
        cy.get('[data-testid="miniCatalog__stepItem--aggregate"]').first().click();

        // CHECK that the step is added between two steps
        cy.get('[data-testid="viz-step-aggregate"]').should('be.visible');
        // CHECK that stepNodes are in the correct order
        cy.get('.stepNode').eq(0).should('have.attr', 'data-testid', 'viz-step-timer');
        cy.get('.stepNode').eq(1).should('have.attr', 'data-testid', 'viz-step-aggregate');
        cy.get('.stepNode').eq(2).should('have.attr', 'data-testid', 'viz-step-log');
        // CHECK that stepNodes contains of the three steps
        cy.get('.stepNode').should('have.length', 3);
    });

    it('In an integration with at least two steps, user deletes the first step, showing a placeholder step in its place (start-end)', () => {
        // Hover mouse over the first step
        cy.get('[data-testid="viz-step-timer"]').trigger('mouseover');
        // Click delete button of the first step
        cy.get('[data-testid="viz-step-timer"]').children('[data-testid="configurationTab__deleteBtn"]').click({ force: true });

        // CHECK that the step is deleted
        cy.get('[data-testid="viz-step-timer"]').should('not.exist');
        // CHECK that stepNodes are in the correct order
        cy.get('.stepNode').eq(0).should('have.attr', 'data-testid', 'viz-step-slot');
        cy.get('.stepNode').eq(1).should('have.attr', 'data-testid', 'viz-step-log');
        // CHECK that stepNodes contains of the two steps
        cy.get('.stepNode').should('have.length', 2);
    });

    it('In an integration with at least two steps, user deletes the first step, showing a placeholder step in its place (start-action)', () => {
        // Click insert button between two steps
        cy.get('[data-testid="stepNode__insertStep-btn"]').click();
        // Open the miniCatalog
        cy.get('[data-testid="miniCatalog"]').should('be.visible');
        // search arangodb step
        cy.get('.pf-c-text-input-group__text-input').type('arangodb');
        // select arangodb step
        cy.get('[data-testid="miniCatalog__stepItem--arangodb"]').first().click();
        // Hover mouse over the first step
        cy.get('[data-testid="viz-step-timer"]').trigger('mouseover');
        // Click delete button of the first step
        cy.get('[data-testid="viz-step-timer"]').children('[data-testid="configurationTab__deleteBtn"]').click({ force: true });

        // CHECK that the step is deleted
        cy.get('[data-testid="viz-step-timer"]').should('not.exist');
        // CHECK that stepNodes are in the correct order
        cy.get('.stepNode').eq(0).should('have.attr', 'data-testid', 'viz-step-slot');
        cy.get('.stepNode').eq(1).should('have.attr', 'data-testid', 'viz-step-arangodb');
        cy.get('.stepNode').eq(2).should('have.attr', 'data-testid', 'viz-step-log');
        // CHECK that stepNodes contains of the two steps
        cy.get('.stepNode').should('have.length', 3);
    });

    // TODO: This test is failing due to the issue https://github.com/KaotoIO/kaoto-ui/issues/1328
    it.skip('In an integration with at least two steps, user deletes the first step, showing a placeholder step in its place (start-action_EIP)', () => {
        // Click insert button between two steps
        cy.get('[data-testid="stepNode__insertStep-btn"]').click();
        // Open the miniCatalog
        cy.get('[data-testid="miniCatalog"]').should('be.visible');
        // search aggregate step
        cy.get('.pf-c-text-input-group__text-input').type('aggregate');
        // select aggregate step
        cy.get('[data-testid="miniCatalog__stepItem--aggregate"]').first().click();
        // Hover mouse over the first step
        cy.get('[data-testid="viz-step-timer"]').trigger('mouseover');
        // Click delete button of the first step
        cy.get('[data-testid="viz-step-timer"]').children('[data-testid="configurationTab__deleteBtn"]').click({ force: true });

        // CHECK that the step is deleted
        cy.get('[data-testid="viz-step-timer"]').should('not.exist');
        // CHECK that stepNodes are in the correct order
        cy.get('.stepNode').eq(0).should('have.attr', 'data-testid', 'viz-step-slot');
        cy.get('.stepNode').eq(1).should('have.attr', 'data-testid', 'viz-step-aggregate');
        cy.get('.stepNode').eq(2).should('have.attr', 'data-testid', 'viz-step-');
        // CHECK that stepNodes contains of the three steps
        cy.get('.stepNode').should('have.length', 3);
    });

    it('User appends a step(+ button to the right of the node)', () => {
        // Delete the log step
        cy.get('[data-testid="viz-step-log"]').trigger('mouseover');
        cy.get('[data-testid="viz-step-log"]').children('[data-testid="configurationTab__deleteBtn"]').click({ force: true });

        // Append second step
        // Click append button on the first step
        cy.get('[data-testid="viz-step-timer"]').children('[data-testid="stepNode__appendStep-btn"]').click();
        // Open the miniCatalog
        cy.get('[data-testid="miniCatalog"]').should('be.visible');
        // search aggregate step
        cy.get('.pf-c-text-input-group__text-input').type('aggregate');
        // select aggregate step
        cy.get('[data-testid="miniCatalog__stepItem--aggregate"]').first().click();

        // Append third step
        // Click append button on the second step
        cy.get('[data-testid="viz-step-aggregate"]').children('[data-testid="stepNode__appendStep-btn"]').click();
        // Open the miniCatalog
        cy.get('[data-testid="miniCatalog"]').should('be.visible');
        // Select End steps
        cy.get('[data-testid="miniCatalog-step-end"]').click();
        // search log step
        cy.get('.pf-c-text-input-group__text-input').type('log');
        // select log step
        cy.get('[data-testid="miniCatalog__stepItem--log"]').first().click();

        // CHECK that stepNodes are in the correct order
        cy.get('.stepNode').eq(0).should('have.attr', 'data-testid', 'viz-step-timer');
        cy.get('.stepNode').eq(1).should('have.attr', 'data-testid', 'viz-step-aggregate');
        cy.get('.stepNode').eq(2).should('have.attr', 'data-testid', 'viz-step-log');
        // CHECK that stepNodes contains of the three steps
        cy.get('.stepNode').should('have.length', 3);
    });

    // TODO: + button to the left of the node -> seems as insert button (insert =? prepend)
    it.skip('User prepends a step(+ button to the left of the node)', () => {

    });

    it('Step Detail - User configures a normal step, which updates the YAML)', () => {
        // Click on the log step
        cy.get('[data-testid="viz-step-log"]').click();
        // Click on the configuration tab
        cy.get('[data-testid="configurationTab"]').click();

        // Enable checkbox "Log mask"
        cy.get('[name="logMask"]').click();
        // CHECK that the YAML is updated logMask: 'true'
        cy.get('.code-editor').should('contain.text', 'logMask');
        cy.get('.code-editor').should('contain.text', "'true'");

        // Disable checkbox "Log mask"
        cy.get('[name="logMask"]').click();
        // CHECK that the YAML is updated - logMask: 'false'
        cy.get('.code-editor').should('contain.text', 'logMask');
        cy.get('.code-editor').should('not.contain.text', "'true'");
        cy.get('.code-editor').should('contain.text', "'false'");

        // Change the value of the "groupDelay" integer field
        cy.get('[name="groupDelay"]').clear().type('15000');
        // CHECK that the YAML is updated - groupDelay: 15000
        cy.get('.code-editor').should('contain.text', "groupDelay");
        cy.get('.code-editor').should('contain.text', "15000");
    });

});
