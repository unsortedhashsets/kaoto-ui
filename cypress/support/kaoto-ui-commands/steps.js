import 'cypress-file-upload';

Cypress.Commands.add('dragAndDropFromCatalog', (source, target, catalog, targetIndex) => {
    targetIndex = targetIndex ?? 0;
    catalog = catalog ?? 'actions';
    const dataTransfer = new DataTransfer();
    cy.get('[data-testid="toolbar-step-catalog-btn"]').click();
    cy.get(`[data-testid="catalog-step-${catalog}"]`).click();
    cy.get('#stepSearch').type(`${source}`);
    cy.get(`[data-testid="catalog-step-${source}"]`).trigger('dragstart', {
        dataTransfer,
    });
    cy.get(`[data-testid="viz-step-${target}"]`).eq(targetIndex).trigger('drop', {
        dataTransfer,
    });
});

Cypress.Commands.add('replaceEmptyStepMiniCatalog', (step, stepIndex) => {
    stepIndex = stepIndex ?? 0;
    cy.get('[data-testid="viz-step-slot"]').eq(stepIndex).click();
    cy.selectStepMiniCatalog(step);
});

Cypress.Commands.add('appendStepMiniCatalog', (step, appendedStep, stage, stepIndex) => {
    stepIndex = stepIndex ?? 0;
    cy.get(`[data-testid="viz-step-${step}"]`).eq(stepIndex).children('[data-testid="stepNode__appendStep-btn"]').click();
    cy.selectStepMiniCatalog(appendedStep, stage);
});

Cypress.Commands.add('prependStepMiniCatalog', (step, prependedStep, stage, stepIndex) => {
    stepIndex = stepIndex ?? 0;
    cy.get(`[data-testid="viz-step-${step}"]`).eq(stepIndex).children('[data-testid="stepNode__prependStep-btn"]').click();
    cy.selectStepMiniCatalog(prependedStep, stage);
});

Cypress.Commands.add('insertStepMiniCatalog', (step, insertIndex) => {
    insertIndex = insertIndex ?? 0;
    cy.get('[data-testid="stepNode__insertStep-btn"]').eq(insertIndex).click();
    cy.selectStepMiniCatalog(step);
});

Cypress.Commands.add('selectStepMiniCatalog', (step, stage) => {
    if (stage != null) { cy.get(`[data-testid="miniCatalog__step-${stage}"]`).click(); }
    cy.get('[data-testid="miniCatalog"]').should('be.visible');
    cy.get('.pf-c-text-input-group__text-input').type(step);
    cy.get(`[data-testid="miniCatalog__stepItem--${step}"]`).first().click();
    cy.waitVisualizationUpdate();
});

Cypress.Commands.add('deleteStep', (step, stepIndex) => {
    stepIndex = stepIndex ?? 0;
    cy.get(`[data-testid="viz-step-${step}"]`).eq(stepIndex).trigger('mouseover').children('[data-testid="configurationTab__deleteBtn"]').click({ force: true });
    cy.waitVisualizationUpdate();
});

Cypress.Commands.add('openStepConfigurationTab', (step, stepIndex) => {
    stepIndex = stepIndex ?? 0;
    cy.get(`[data-testid="viz-step-${step}"]`).eq(stepIndex).click();
    cy.get('[data-testid="configurationTab"]').click();
});

Cypress.Commands.add('closeStepConfigurationTab', () => {
    cy.get('.pf-c-button.pf-m-plain').eq(0).click();
});

Cypress.Commands.add('interactWithConfigInputObject', (inputName, value) => {
    if (value != null) {
        cy.get(`input[name="${inputName}"]`).clear().type(value);
    } else {
        cy.get(`input[name="${inputName}"]`).click();
    }
});
