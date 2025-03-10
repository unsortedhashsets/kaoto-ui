describe('User completes normal actions on steps in a branch', () => {
    beforeEach(() => {
        cy.intercept('/v1/integrations/dsls').as('getDSLs');
        cy.intercept('/v1/view-definitions').as('getViewDefinitions');
        cy.intercept('/v1/integrations*').as('getIntegration');

        cy.openHomePage();
        cy.uploadFixture('EipAction.yaml');

        cy.zoomOutXTimes(3)
        // Blocked due to: https://github.com/KaotoIO/kaoto-ui/issues/1381
        // cy.insertBranch(3);
        // cy.replaceEmptyStepMiniCatalog('activemq');
        // cy.appendBranch(1);
        // cy.replaceEmptyStepMiniCatalog('amqp');

        // Workaround for: https://github.com/KaotoIO/kaoto-ui/issues/1381
        cy.openStepConfigurationTab('choice', 1);
        cy.addBranchChoiceExtension();
        cy.addBranchChoiceExtension('other');
        cy.closeStepConfigurationTab();
        cy.replaceEmptyStepMiniCatalog('amqp', 0);
    });

    it('User configures a step in a branch', () => {
        cy.openStepConfigurationTab('amqp');

        cy.interactWithConfigInputObject('includeSentJMSMessageID');
        cy.interactWithConfigInputObject('password', 'qwerty');

        // CHECK that the step yaml is updated
        cy.checkCodeSpanLine('includeSentJMSMessageID', 'true');
        cy.checkCodeSpanLine('password', 'qwerty');
    });

    it(' User deletes a step in a branch', () => {
        cy.deleteStep('amqp');
        // Blocked due to: https://github.com/KaotoIO/kaoto-ui/issues/1381
        // cy.syncUpCodeChanges();

        // CHECK that amqp step is deleted and empty step is added
        cy.get('[data-testid="viz-step-amqp"]').should('not.exist');
        cy.get('[data-testid="viz-step-slot"]').should('have.length', 2).and('be.visible');
    });

    it('User replaces a step in a branch', () => {
        cy.dragAndDropFromCatalog('arangodb', 'amqp');

        // CHECK digitalocean step was replaced with amqp
        cy.get('[data-testid="viz-step-activemq"]').should('not.exist');
        cy.get('[data-testid="viz-step-arangodb"]').should('have.length', 1).and('be.visible');
    });
});
