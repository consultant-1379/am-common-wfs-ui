/*
 * COPYRIGHT Ericsson 2024
 *
 *
 *
 * The copyright to the computer program(s) herein is the property of
 *
 * Ericsson Inc. The programs may be used and/or copied only with written
 *
 * permission from Ericsson Inc. or in accordance with the terms and
 *
 * conditions stipulated in the agreement/contract under which the
 *
 * program(s) have been supplied.
 */
const externals = {
  apps: [
    { path: "resources", entry: "Resources" },
    { path: "packages", entry: "Packages" },
    { path: "operations", entry: "Operations" },
    { path: "package-details", entry: "PackageDetails" },
    { path: "resource-details", entry: "ResourceDetails" },
    { path: "instantiate-wizard", entry: "InstantiateWizard" },
    { path: "upgrade-wizard", entry: "UpgradeWizard" },
    { path: "resource-add-node", entry: "ResourceAddNode" },
    { path: "resource-scale", entry: "ResourceScale" },
    { path: "documentation", entry: "Documentation" },
    { path: "user-administration", entry: "UserAdministration" },
    { path: "resource-heal", entry: "ResourceHeal" },
    { path: "clusters", entry: "Clusters" },
    { path: "resource-rollback", entry: "ResourceRollback" }
  ],
  components: {
    default: [
      { path: "generic-table", entry: "GenericTable" },
      { path: "custom-cell", entry: "CustomCell" },
      { path: "details-side-panel", entry: "DetailsSidePanel" },
      { path: "context-menu", entry: "ContextMenu" },
      { path: "generic-checkbox", entry: "GenericCheckBox" },
      { path: "generic-datepicker", entry: "GenericDatepicker" },
      { path: "generic-dropdown", entry: "GenericDropdown" },
      { path: "generic-text-field", entry: "GenericTextField" },
      { path: "generic-text-area", entry: "GenericTextArea" },
      { path: "generic-multi-panel", entry: "GenericMultiPanel" },
      { path: "resource-details-panel", entry: "ResourceDetailsPanel" },
      { path: "custom-cell-state", entry: "CustomCellState" },
      { path: "additional-attributes-tab", entry: "AdditionalAttributesTab" },
      { path: "wizard-step-package-selection", entry: "WizardStepPackageSelection" },
      { path: "wizard-step-infrastructure", entry: "WizardStepInfrastructure" },
      { path: "wizard-step-general-attributes", entry: "WizardStepGeneralAttributes" },
      { path: "wizard-step-additional-attributes", entry: "WizardStepAdditionalAttributes" },
      { path: "wizard-step-summary", entry: "WizardStepSummary" },
      { path: "instantiate-wizard-component", entry: "InstantiateWizardComponent" },
      { path: "generic-key-value-list", entry: "GenericKeyValueList" },
      { path: "generic-combo-box", entry: "GenericComboBox" },
      { path: "documentation-system-bar-menu", entry: "Main" },
      { path: "file-upload-dialog", entry: "FileUploadDialog" },
      { path: "rollback-dialog", entry: "RollbackDialog" },
      { path: "register-cluster-dialog", entry: "RegisterClusterDialog" },
      { path: "unavailable-page-component", entry: "UnavailablePageComponent" },
      { path: "banner-component", entry: "BannerComponent" },
      { path: "version-system-bar-menu", entry: "Main" }
    ],
    shareable: [
      { path: "base-filter-panel", entry: "BaseFilterPanel" },
      { path: "resource-filter-panel", entry: "ResourceFilterPanel" },
      { path: "packages-filter-panel", entry: "PackagesFilterPanel" },
      { path: "operations-filter-panel", entry: "OperationsFilterPanel" },
      { path: "generic-dialog", entry: "GenericDialog" },
      { path: "operations-history-list", entry: "OperationsHistoryList" },
      { path: "upgrade-wizard-component", entry: "UpgradeWizardComponent" },
      { path: "operations-details-panel", entry: "OperationsDetailsPanel" },
      { path: "resource-operations-details", entry: "ResourceOperationsDetails" },
      { path: "generic-inline-description", entry: "GenericInlineDescription" },
      { path: "resource-add-node-panel", entry: "ResourceAddNodePanel" },
      { path: "scale-resource-panel", entry: "ScaleResourcePanel" },
      { path: "generic-accordion", entry: "GenericAccordion" },
      { path: "file-content-dialog", entry: "FileContentDialog" },
      { path: "heal-resource-panel", entry: "HealResourcePanel" },
      { path: "resource-backups-details", entry: "ResourceBackupsDetails" },
      { path: "resource-backups-list", entry: "ResourceBackupsList" },
      { path: "backup-local-dialog", entry: "BackupLocalDialog" },
      { path: "export-backup-dialog", entry: "ExportBackupDialog" },
      { path: "clusters-details-panel", entry: "ClustersDetailsPanel" },
      { path: "clusters-filter-panel", entry: "ClustersFilterPanel" },
      { path: "force-fail-dialog", entry: "ForceFailDialog" },
      { path: "generic-key-value-file-text-input", entry: "GenericKeyValueFileTextInput" },
      { path: "generic-file-input", entry: "GenericFileInput" },
      { path: "generic-key-map-card", entry: "GenericKeyMapCard" },
      { path: "generic-key-map-card-group", entry: "GenericKeyMapCardGroup" },
      { path: "generic-key-value-file-text-input", entry: "GenericKeyValueFileTextInput" },
      { path: "generic-file-input", entry: "GenericFileInput" },
      { path: "generic-key-value-pair-input", entry: "GenericKeyValuePairInput" },
      { path: "generic-key-value-pair-input-group", entry: "GenericKeyValuePairInputGroup" },
      { path: 'modify-vnf-info-dialog', entry: 'ModifyVnfInfoDialog' },
      { path: "resource-rollback-panel", entry: "ResourceRollbackPanel" }
    ]
  },
  panels: [{ path: "user-logout-panel", entry: "UserLogoutPanel" }],
  plugins: [{ path: "app-configuration", entry: "index" }, { path: "user-credentials", entry: "index" }]
};

module.exports = externals;
