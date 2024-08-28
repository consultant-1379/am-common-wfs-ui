<style>
img + em {
  display: block;
  text-align: left;
}
</style>

# E-VNFM UI User Guide

- [Introduction](introduction)
- [Overview](overview)
- [Version](version)
- [Navigation](navigation)
- [Packages](packages)
- [Resources](resources)
- [Operations](operations)
- [CISM Clusters](cismclusters)
- [Instantiate](instantiate)
- [Add node to ENM](addnodetoenm)
- [Delete Node from ENM](deletenodefromenm)
- [Upgrade](upgrade)
- [Rollback Resource](rollbackresource)
- [Rollback Operation](rollbackoperation)
- [Scale](scale)
- [Heal](heal)
- [Sync](sync)
- [Modify VNF Information](modifyvnfinformation)
- [Terminate](terminate)
- [Clean Up](cleanup)
- [Force Fail](forcefail)
- [Backup](backup)
- [Reference List](referencelist)

&nbsp;
___
## Introduction

The Evolved Virtual Network Function Manager (E-VNFM) user interface displays available software packages and allows you to perform Life Cycle Management operations.

**Purpose**

How to use the E-VNFM user interface.

**Target Groups**

The intended target groups for this document are:

- Network Engineer

- System Administrator

- Installation Engineer

**Prerequisites**

The following prerequisites are required:

- Appropriate ID, account, and permissions to access E-VNFM.

- Access to the login details predefined by the administrator who deployed E-VNFM.

- **E-VNFM UI User Role** needs to be assigned to the user before using EVNFM UI. Roles can be assigned by editing user in the User Management page.

- Use supported browser. For list of supported browsers please see the release note.

&nbsp;
___
## Overview

E-VNFM user interface provides the following functions:

- View all onboarded packages

- Instantiate a VNF

- Upgrade a VNF

- Rollback a VNF

- Scale a VNF

- Heal a VNF

- Sync a VNF

- Terminate a VNF

- View the operational state of the VNF

- View the history of operations performed on the VNF

The E-VNFM user interface has four sections:

- Resources

- Packages

- Operations

- CISM Clusters

**Resources** shows all active resources on the system. It provides functions to instantiate, upgrade and terminate resources.

**Packages** shows all onboarded CSAR packages. It provides functions to instantiate a package.

**Operations** shows all operations that have been performed on packages and resources.

**CISM Cluster** shows all registered CISM Clusters and provides functions to register and deregister a cluster.

&nbsp;
___
## Version
The user can find the EVNFM version on the top right of the UI system bar. e.g. v2.19.0-43. In the user profile side panel
which can be used to log users out. 
A new section called system information will list the services that are packaged with the EVNFM version

> Note: This does not represent the services actually running as in certain configurations they may not be deployed.


&nbsp;
___
## Navigation

User can navigate to multiple pages and panels using the available options provided.

**Resources**, **Packages**, **Operations**, **CISM Clusters** and **User Administration** are accessible from the navigation panel. Click the double line icon in the
top
left corner of the
screen to display the navigation
panel.

![](./documentation/images/navigation_icon.png =70%x*)
_Figure Navigation Icon_

&nbsp;

![](./documentation/images/navigation_panel.png =70%x*)
_Figure Navigation Panel_

&nbsp;
___
## Packages

The **Packages** table shows the details of the onboarded CSAR packages available on the system.

Packages can be used to instantiate new resources. The list of packages does not auto-update without a manual refresh of the web page.

Packages can be sorted in ascending or descending order. Click the **Package name** in the table to view the package details.

To onboard a package refer to Onboard CSAR Packages to the Cluster in the EVNFM User Guide in the external CPI documentation.

![](./documentation/images/packages.png =70%x*)
_Figure Packages_

&nbsp;

To access the options for a package click on the triple dot icon located between the package name and type. This menu contains two options:

1.  **Instantiate**: Start the process of instantiating the selected package.

2.  **Go to details page**: View the full details page of the selected package.

![](./documentation/images/packages_tripe_dot_menu.png =70%x*)
_Figure Packages > Triple Dot Menu_

&nbsp;

In case if the Onboarding service is not deployed or the NFVO is enabled, you won't be able to see the list of packages and **Onboard package** option.

![](./documentation/images/packages_disabled.png =70%x*)
_Figure Packages(Onboarding service is unavailable or NFVO is enabled)_

&nbsp;

In case if uploaded CNF package has at least one incorrectly defined LCM operation warning icon with tooltip will appear

![](./documentation/images/packages_warning_operation_error.png =70%x*)
_Figure Packages(Uploaded CNF package has at least one incorrectly defined LCM operation)_

&nbsp;

###Onboarding a package

To onboard a package simply click on the onboarding button on the top right of the packages page to open the onboarding dialog.

Select the file you want to onboard. Once the file has been selected the onboarding button will be enabled.

Click the button to start the onboarding of the package.

While a package is onboarding if the cancel button is clicked in the onboarding dialog the upload will be cancelled and the package identifier will be deleted.
If the package onboarding fails for any reason the package identifier will contain an error message and can be deleted manually.

Onboarding currently supports two optional parameters:
  - **onboarding.timeout**: Maximum time in minutes given to the onboarding process of a CSAR package. The default value is 120 minutes.
  - **Skip Image Upload**: Allow onboarding process to skip uploading image to container registry. This option needs to be checked if EVNFM is installed using "Option 2", which means that the user should already have images on an external registry to be able to perform LCM Operations (See _EO Cloud Native Installation Instructions_: EVNFM-Specific Pre-Deployment and _EO Cloud Native Upgrade Instructions_: Container VNFM Pre-Deployment for details of deploying EVNFM with internal and external container registries).


![](./documentation/images/packages_onboarding_package.png =40%x*)
_Figure Packages > Onboard a package_

&nbsp;

In case if an error occurs during onboarding a notification will be displayed to the user stating why the error occurred.
> Note: The notification won't close automatically. To close the notification click on the close icon in the top right corner of the notification.

![](./documentation/images/packages_onboarding_package_error.png =70%x*)
_Figure Packages > Error message_

**Important!** If there is no valid EVNFM license present in NeLS, the 'Onboard package' button will be enabled but the request will be rejected with corresponding error message. For more information about the licensing feature refer to the EO Cloud Native System Administration guide.

&nbsp;

###Delete a package

To delete a package if the user has the correct permissions and the package is not in use then they can select the delete option in the package triple dot menu.

![](./documentation/images/delete_package_menu.png =50%x*)
_Delete Package > Delete Option_

&nbsp;

The user will be presented with a dialog to confirm the deletion. Once the delete package button is selected then it will be deleted.

![](./documentation/images/delete_package_dialog.png =70%x*)
_Delete Package > Delete Package Dialog_

**Important!** If there is no valid EVNFM license present in NeLS, the delete option will be enabled but the request will be rejected with corresponding error message. For more information about the licensing feature refer to the EO Cloud Native System Administration guide.

&nbsp;

###Filtering

To filter the packages table, open the filters panel by clicking on the funnel icon in the top left of the screen. The textual filters are case-sensitive and will match to any part of the text. If multiple filters are specified a resource will have to match on all of them to be shown. 

Click **Reset** button at the bottom of the filters panel to clear all of the filter fields. Click **Apply** at the bottom of the filters panel to get a view of packages consistent with the current state of the filter fields. To get an unfiltered view of packages, first click **Reset** to clear all filter fields followed by **Apply**.

![](./documentation/images/packages_filter_funnel_icon.png)
_Figure Packages > Filter Funnel Icon_

&nbsp;

![](./documentation/images/packages_filter_panel.png =25%x*)
_Figure Packages > Filter Panel_

&nbsp;

###Details Panel

To view more information about a package select the package row and click the info icon in the top right corner of the screen. This opens a details panel where additional information about the package can be viewed under two tabs:

- **General information**

- **Additional attributes**

![](./documentation/images/packages_details_panel.png =70%x*)
_Figure Packages > Details Panel_

&nbsp;

####General Information Tab

Displays general information about the package.

![](./documentation/images/packages_details_panel_general_information_tab.png =70%x*)
_Figure Packages > Details Panel > General information Tab_

&nbsp;

####Additional Attributes Tab

Displays the additional attributes found in the VNF descriptor of the package. Additional attributes without default values are shown as parameters with empty value fields. The attributes can be sorted in either ascending or descending order. Additional attributes can be searched by parameter name or value using the search bar.

![](./documentation/images/packages_details_panel_additional_attributes_tab.png =70%x*)
_Figure Packages > Details Panel > Additional Attributes Tab_

&nbsp;

Attribute value that is truncated can be viewed in a larger viewing area by clicking the value in the table.

![](./documentation/images/packages_details_panel_additional_attributes_tab_truncated.png =70%x*)
_Figure Packages > Details Panel > Additional Attributes Tab > Additional Attributes Table(with truncated attribute value)_

&nbsp;

![](./documentation/images/packages_details_panel_additional_attributes_value_fullscreen.png =70%x*)
_Figure Packages > Details Panel > Additional Attributes Tab > Attribute Value Dialog_

&nbsp;

####Supported operations Tab

Display supported LCM operations.

![](./documentation/images/packages_details_panel_supported_operations_tab.png =70%x*)
_Figure Packages > Details Panel > Supported Operations Attributes Tab_

&nbsp;

Reason why the operation is not supported can be seen by clicking on this operation
![](./documentation/images/packages_details_panel_upsupported_operation_dialog.png =70%x*)
_Figure Packages > Details Panel > Supported Operations Attributes Tab > Unsupported operation Dialog_

&nbsp;

###Triple Dot Menu

The triple dot menu in the top right corner of the Details panel shows options for the selected package:

1.  **Instantiate**: Start the process of instantiating the selected package.

2.  **Go to details page**: View the full details page of the selected package.

![](./documentation/images/packages_details_panel_triple_dot_menu.png =70%x*)
_Figure Packages > Details Panel > Triple Dot Menu_

&nbsp;

###Full Details Page

Package details can be viewed in full screen by clicking on the package name in the packages table or by using the triple dot menu. Breadcrumb navigation can be used to navigate back to Packages.

####General Information Tab

![](./documentation/images/package_details_general_information_tab.png =70%x*)
_Figure Package Details > General Information Tab_

&nbsp;

####Additional Attributes Tab

![](./documentation/images/package_details_additional_attributes_tab.png =70%x*)
_Figure Package Details > Additional Attributes Tab_

&nbsp;

Attribute value that is truncated can be viewed in a larger viewing area by clicking the value in the table.

![](./documentation/images/package_details_additional_attributes_tab_truncated.png =70%x*)
_Figure Package Details > Additional Attributes Tab > Additional Attributes Table(with truncated attribute value)_

&nbsp;

![](./documentation/images/package_details_additional_attributes_value_fullscreen.png =70%x*)
_Figure Package Details > Additional Attributes Tab > Attribute Value Dialog_

&nbsp;

####Supported operations Tab

![](./documentation/images/packages_details_panel_supported_operations_tab_truncated.png =70%x*)
_Figure Packages > Details Panel > Supported Operations Attributes Tab_

&nbsp;

Reason why the operation is not supported can be seen by clicking on this operation
![](./documentation/images/packages_details_panel_upsupported_operation_dialog_truncated.png =70%x*)
_Figure Packages > Details Panel > Supported Operations Attributes Tab > Unsupported operation Dialog_

&nbsp;
___
## Resources

**Resources** shows all active VNF instances on the system. The list of resources auto-updates to provide a live view. Resources can be sorted in ascending or descending order. The page contains partial data filtered by page. (15 resources on the page by default). General information about the entries on the page is presented in the subtitle. Click the **Resource instance name** in the table, to view the full details page for that resource.

> Note: The operation state for the resources is not guaranteed to be correct, if its components are not annotated with the required label. This label must be set to the release name as specified in the Helm Chart Requirements section of E-VFNM User Guide in the external CPI documentation.

The operation state maps to the LcmOperationStateType as defined by ETSI. Refer to Enumeration: LcmOperationStateType in the ETSI Specification document for more information on the different operation types.

![](./documentation/images/resources.png =70%x*)
_Figure Resources_

&nbsp;

To access the options for a resource click on the triple dot icon located between the resource instance name and type. This menu contains the following options:

1.  **Upgrade**: Start the process of upgrading the selected resource.

2.  **Terminate**: Start the process of terminating the selected resource.

3.  **Go to details page**: View the full details page of the selected resource.

4.  **Clean up**: Removes the VNF Identifier for a failed instantiated resource from the database.

5.  **Add node to ENM**: Adds the VNF to ENM.

6.  **Delete node from ENM**: Deletes a node from ENM.

7.  **Scale**: Start the process of scaling the selected resource.

8.  **Rollback**: Start the process of rolling back the selected resource.

9.  **Heal**: Start the process of healing the selected resource.

10.  **Sync**: Start the process of synchronization the selected resource.

![](./documentation/images/resources_table_triple_dot_menu_example_1.png)
_Figure Resources > Table Triple Dot Menu (Example 1)_

&nbsp;

![](./documentation/images/resources_table_triple_dot_menu_example_2.png)
_Figure Resources > Table Triple Dot Menu (Example 2)_

&nbsp;

![](./documentation/images/resources_table_triple_dot_menu_example_3.png)
_Figure Resources > Table Triple Dot Menu (Example 3)_

&nbsp;

![](./documentation/images/resources_enabled_instantiate_new_button.png =70%x*)
_Figure Resources > Enabled Instantiate New Button_

&nbsp;

To instantiate a new resource click **Instantiate new** in the top right corner of the screen. The button is disabled if there are no onboarded packages

&nbsp;

**Important!** If there is no valid EVNFM license present in NeLS, the 'Instantiate new' button will be enabled but the instantiate request will be rejected with corresponding error message. For more information about the licensing feature refer to the EO Cloud Native System Administration guide.

&nbsp;

If the Onboarding service is unavailable or the NFVO is enabled **Instantiate new** button along with almost all options from the triple dot menu won't be available.

Available options are:
- Scale (if applicable)
- Modify VNF Information
- Go to details page

![](./documentation/images/resources_table_triple_dot_menu_disabled_options.png =70%x*)

_Figure Resources(Onboarding service is unavailable or NFVO is enabled)_

&nbsp;

Also you will see the notification banner that NFVO is enabled or onboarding service is unavailable so some actions have been disabled.

![](./documentation/images/resources_notification_banner.png =70%x*)
_Figure Resources(Notification banner)_

&nbsp;

Wizards from triple dot menu also has been disabled(in case user go to these pages via links and not from Resources page)

![](./documentation/images/upgrade_disabled.png =70%x*)
_Figure Resources > Table Triple Dot Menu > Upgrade(disabled)_

&nbsp;

![](./documentation/images/instantiate_disabled.png =70%x*)
_Figure Resources > Table Triple Dot Menu > Instantiate(disabled)_

&nbsp;

![](./documentation/images/heal_disabled.png =70%x*)
_Figure Resources > Table Triple Dot Menu > Heal(disabled)_

&nbsp;

###Filtering

To filter the resources table, open the filters panel by clicking on the funnel icon in the top left of the screen. The resources table can be filtered on every column. The textual filters are case-sensitive and will match to any part of the text. If multiple filters are specified a resource will have to match on all of them to be shown. 

Click **Reset** button at the bottom of the filters panel to clear all of the filter fields. Click **Apply** at the bottom of the filters panel to get a view of resources consistent with the current state of the filter fields. To get an unfiltered view of resources, first click **Reset** to clear all filter fields followed by **Apply**.

![](./documentation/images/resources_filter_funnel_icon.png =70%x*)
_Figure Resources > Filter Funnel Icon_

&nbsp;

![](./documentation/images/resources_filter_panel.png =70%x*)
_Figure Resources > Filter Panel_

&nbsp;

###Details Panel

To view more information about a resource, select the resource row and click the info icon in the top right corner of the screen. This opens a details panel where additional information about the resource can be viewed under four tabs:

- **General information**

- **Components**

- **Operations**

- **Additional attributes**

- **Backups**

![](./documentation/images/resources_details_panel.png =70%x*)
_Figure Resources > Details Panel_

&nbsp;

####General Information Tab

The general information tab shows information about the resource. The **Source package** field can be used to navigate to the full details page of the source package.

![](./documentation/images/resources_details_panel_general_information_tab.png =70%x*)
_Figure Resources > Details Panel > General Information Tab_

&nbsp;

####Components Tab

The components tab shows the components belonging to the selected resource. It displays the state and name for each deployed component. They can be sorted in ascending or descending order. Components can be searched by name or state using the search bar. 
The component states map to the pod phases provided by Kubernetes, for more information on these states refer to Kubernetes: Pod Lifecycle.

> Note: The component name and component state are only shown for components that have a label with the release name of the resource. Components without a release name label are not displayed under this tab.

![](./documentation/images/resources_details_panel_components_tab.png =70%x*)
_Figure Resources > Details Panel > Components Tab_

&nbsp;

If no components are found for the selected resource an error message appears in the details panel.

![](./documentation/images/resources_details_panel_components_tab_error.png =70%x*)
_Figure Resources > Details Panel > Components Tab Error_

&nbsp;

####Operations Tab

The operations tab shows the history of operations performed on the selected resource.

![](./documentation/images/resources_details_panel_operations_tab.png =70%x*)
_Figure Resources > Details Panel > Operations Tab_

&nbsp;

####Additional Attributes Tab

The additional attributes tab contains the additional attributes of the selected resource. These additional attributes represent the set of attribute values that were provided during instantiation, or if the resource was upgraded, the set of attribute values provided during its most recent upgrade. 
These additional attributes do not contain values that were provided using a YAML file. The attributes can be sorted in either ascending or descending order. Additional attributes can be searched by parameter name or value using the search bar.

![](./documentation/images/resources_details_panel_additional_attributes_tab.png =70%x*)
_Figure Resources > Details Panel > Additional Attributes Tab_

&nbsp;

Attribute value that is truncated can be viewed in a larger viewing area by clicking the value in the table.

![](./documentation/images/resources_details_panel_additional_attributes_tab_truncated.png =70%x*)
_Figure Resources > Details Panel > Additional Attributes Tab > Additional Attributes Table(with truncated attribute value)_

&nbsp;

![](./documentation/images/resources_details_panel_additional_attributes_value_fullscreen.png =70%x*)
_Figure Resources > Details Panel > Additional Attributes Tab > Attribute Value Dialog_

&nbsp;

###Backups tab
Backups tab contains list of backups for selected resource. In case of resource is not in INSTANTIATED state error appears. In case of 
incorrect BRO url for selected resource error appears.

![](./documentation/images/resources_details_panel_backups_tab.png =70%x*)
_Figure Resources > Details Panel > Backups tab_

&nbsp;

###Triple Dot Menu

The triple dot menu in the top right corner of the Details panel shows options for the selected resource:

1.  **Upgrade**: Start the process of upgrading the selected resource.

2.  **Terminate**: Start the process of terminating the selected resource.

3.  **Go to details page**: View the full details page of the selected resource.

4.  **Clean up**: Removes the VNF Identifier for a failed instantiated resource from the database.

5.  **Add node to ENM**: Adds the VNF to ENM

6.  **Delete node from ENM**: Deletes a node from ENM

7.  **Scale**: Start the process of scaling the selected resource.

8.  **Rollback**: Start the process of rolling back the selected resource.

9.  **Heal**: Start the process of healing the selected resource.

10.  **Sync**: Start the process of synchronization the selected resource.

![](./documentation/images/resources_details_panel_triple_dot_menu.png)
_Figure Resources > Details Panel Triple Dot Menu_

&nbsp;

###Resource Details Page

To view resource details in full screen click on the resource instance name in the resource table or select **Go to details page** from the triple dot menu. Breadcrumb navigation can be used to navigate back to **Resources**.

####General Information Tab

![](./documentation/images/resource_details_general_information_tab.png =70%x*)
_Figure Resource Details > General Information Tab_

&nbsp;

####Components tab

![](./documentation/images/resource_details_components_tab.png =70%x*)
_Figure Resource Details > Components Tab_

&nbsp;

![](./documentation/images/resource_details_components_tab_error.png =70%x*)
_Figure Resource Details > Components Tab Error_

&nbsp;

####Operations Tab

This tab shows the history of operations performed on the resource. The operations can be sorted in ascending or descending order.

![](./documentation/images/resource_details_operations_tab.png =70%x*)
_Figure Resource Details > Operations Tab_

&nbsp;

To access the options for an operation click on the triple dot icon located between the operation name and event. This menu may contain the following options:

Rollback: this option is used to rollback the operation. Will only be available if the Event is failed_temp.

Force fail: Fails the operation. Will only be available if the Event is failed_temp.

View error message: View the error message associated with the operation.

![](./documentation/images/resource_details_operations_triple_dot_menu.png =70%x*)
_Figure Resource Details > Operations Tab > Triple Dot Menu_

&nbsp;

To view the error message panel select an operation from the list and select "View error message" from the menu. To close the message panel click on the close icon in the top right corner of the panel or select any other row from the table.

![](./documentation/images/resource_details_operations_tab_message_panel.png =70%x*)
_Figure Resource Details > Operations Tab > Message Panel_

&nbsp;

To open the message in a larger viewing area, click **View in dialog**.

![](./documentation/images/resource_details_operations_tab_full_screen_error.png =70%x*)
_Figure Resource Details > Operations Tab > Full Screen Error_

&nbsp;

To close the dialog click on the close icon in the top right corner of the dialog box.





####Additional Attributes Tab

![](./documentation/images/resource_details_additional_attributes_tab.png =70%x*)
_Figure Resource Details > Additional Attributes Tab_

&nbsp;

Attribute value that is truncated can be viewed in a larger viewing area by clicking the value in the table.

![](./documentation/images/resource_details_additional_attributes_tab_truncated.png =70%x*)
_Figure Resource Details > Additional Attributes Tab > Additional Attributes Table(with truncated attribute value)_

&nbsp;

![](./documentation/images/resource_details_additional_attributes_value_fullscreen.png =70%x*)
_Figure Resource Details > Additional Attributes Tab > Attribute Value Dialog_

&nbsp;

####Backups Tab


![](./documentation/images/resources_details_backups_tab.png =70%x*)
_Figure Resources > Details page > Backups tab_

&nbsp;

Triple dot menu for Delete or Export to external location backup

![](./documentation/images/resource_details_backup_delete.png =70%x*)
_Figure Resources > Resource detail > Backups > Delete dialog_

&nbsp;
___
## Operations

**Operations** shows all operations that have been performed on packages and resources. The list of operations auto-updates to provide a live view. Operations can be sorted in ascending or descending order. The page contains partial data filtered by page. (15 operations on the page by default). General information about the entries on the page is presented in the subtitle. Click the **Resource instance name** in the table to view the details page for that resource.

![](./documentation/images/operations.png =70%x*)
_Figure Operations_

&nbsp;

###Filtering

To filter the table of operations open the filters panel by clicking on the funnel icon in the top left of the screen. The operations table can be filtered on every column. The textual filters are case-sensitive and will match to any part of the text. 

If multiple filters are specified an operation will have to match on all of them to be shown. Click the **Reset** button at the bottom of the filters panel to clear all of the filter fields. Click the **Apply** button at the bottom of the filters panel to get a view of operations that is consistent with the current state of the filter fields. 

To get an unfiltered view of operations, first click the **Reset** button to clear all filter fields followed by the **Apply** button.

![](./documentation/images/operations_filter_funnel_icon.png =70%x*)
_Figure Operations > Filter funnel icon_

&nbsp;

![](./documentation/images/operations_filter_panel.png =70%x*)
_Figure Operations > Filter Panel_

&nbsp;

###Details Panel

To view more information about a particular operation select the **Operation** row and click the info icon in the top right corner of the screen. This opens a details panel with additional information about the operation. The resource field can be used to navigate to the full details page of that resource.

![](./documentation/images/operations_details_panel_message.png =70%x*)
_Figure Operations > Details Panel Message_

&nbsp;

When no error message exists for an operation the message field will not be shown.

![](./documentation/images/operations_details_panel_no_message.png =70%x*)
_Figure Operations > Details Panel, no message_

&nbsp;
___
## Instantiate

**Instantiate** is used to create a resource from an onboarded package. **Instantiate** is accessible from **Resources** and **Packages**.

**Instantiation from Resources**

**Instantiate** is accessible using the **Instantiate new** button in the top right corner of **Resources**.

![](./documentation/images/resources_2.png =70%x*)
_Figure Resources_

&nbsp;

###Instantiation from Packages page

Instantiate with a preselected package is accessible from the triple dot menu of **Packages**.

![](./documentation/images/packages_triple_dot_menu_instantiate.png =70%x*)
_Figure Packages > Triple dot menu > Instantiate_

&nbsp;

![](./documentation/images/instantiate_preselected_package.png =70%x*)
_Figure Instantiate Preselected Package_

&nbsp;

####Instantiate steps

**Important!** If there is no valid EVNFM license present in NeLS, the 'Instantiate new' button or option from triple dot menu in package page will be enabled but instantiate request will be rejected with corresponding error message. For more information about the licensing feature refer to the EO Cloud Native System Administration guide.

The following five steps are required to instantiate a resource:

- Package selection

- Infrastructure

- General attributes

- Additional attributes

- Summary

To navigate between the steps click the **Next** and **Previous** buttons at the bottom right of the screen. To quickly navigate between any completed steps use the header. Fields that are marked with "\*" are mandatory and must be completed.

If a change is made to an earlier step quick navigation using the header to any following completed steps is disabled and the **Next** and **Previous** buttons have to be used instead.

####Package selection

Select the onboarded CSAR package to use to instantiate a new resource. The packages can be sorted in either ascending or descending order. Packages with operational status of **DISABLED** will be hidden. The **Next** button is disabled until a package is selected.

![](./documentation/images/instantiate_package_selection_no_package_selected.png =70%x*)
_Figure Instantiate > Package selection, no package selected_

&nbsp;

![](./documentation/images/instantiate_package_selection_package_selected.png =70%x*)
_Figure Instantiate > Package selection, package selected_

&nbsp;

####Infrastructure

Select the cluster and specify the namespace to instantiate into.

![](./documentation/images/instantiate_infrastructure.png =70%x*)
_Figure Instantiate > Infrastructure_

&nbsp;

**Cluster**

Cluster configuration file name for cluster to which resource will be deployed.

To register new cluster config file please refer to [Register Cluster](registercluster) section of this document.

**Namespace**

Namespace to which the resource will be deployed in. If the namespace does not exist the request will first create the namespace and then proceed with the life cycle operation.
In case namespace field has not provided, it will be auto generated with instance name as prefix and random 5 symbols.

If the namespace attribute is present in VNFD's additional attributes, it will be pre-populated during *Infrastructure* step and automatically removed from *Additional attributes* step.

> Tip: A valid namespace must consist of up to 63 lower case alphanumeric characters or "-" and must begin and end with an alphanumeric character, i.e. "my-cluster1". If an invalid namespace is provided, an error message is displayed below the input field which explains the accepted values.

![](./documentation/images/infrastructure_error_messages.png)
_Figure Infrastructure > Error messages_

&nbsp;

![](./documentation/images/instantiate_infrastructure_validated.png =70%x*)
_Figure Instantiate > Infrastructure, validated_

&nbsp;

####General attributes

Provide a **Resource instance name** for the resource that is being instantiated. **Resource instance name** is required and the **Next** button is disabled until a valid value is provided.

![](./documentation/images/general-attributes-instantiation-scale-level.png)
_Figure Instantiate > General attributes, instantiation scale level selected_

&nbsp;

![](./documentation/images/general-attributes-dynamic-level-no-exceptions.png)
_Figure Instantiate > General attributes, dynamic scale level selected_

&nbsp;

![](./documentation/images/general-attributes-dynamic-level-exceptions.png)
_Figure General attributes > Error messages_

&nbsp;

![](./documentation/images/instantiate-general-attributes-deployable-modules.png)
_Figure General attributes > Deployable Modules_

&nbsp;

**Resource instance name**

> Tip: A valid resource instance name must consist of up to 50 lower case alphanumeric characters or '-'. It must start with an alphabetic character and end with an alphanumeric character. If an invalid resource instance name is provided an error message is displayed below the input field which explains the accepted values.

**Description**

An optional description of the resource.

**Application timeout**

Application timeout is the maximum time allowed for application instantiation. By default, the field will be prefilled with value '3600'. If the applicationTimeOut attribute is present in VNFD's additional attributes, it will be pre-populated during *General attributes* step and automatically removed from *Additional attributes* step.

> Tip: A valid application timeout must consist of integers only,for example: "270". If an invalid timeout is provided, an error message is displayed below the input field which explains the accepted values.

**Helm client version**

Allows a user predefine helm client version. By default, the field will be prefilled with version '3.8', but if VNFD has an additional parameter **helm\_client\_version**, the value will be taken from it and automatically removed from *Additional attributes* step. This value can be changed during upgrade. Valid values are things like 3.8, 3.10, 3.12, 3.13, 3.14 and latest.

**Kubernetes OpenAPI schema validation**

Allows a user to disable strict package validation against Kubernetes OpenAPI schema. It is recommended to leave disabled unless you are aware of the OpenAPI validation and wish it to be performed. By default, the field will be checked. If the disableOpenapiValidation attribute is present in VNFD's additional attributes, it will be pre-populated during *General attributes* step and automatically removed from *Additional attributes* step.

**Verification - Skip Job Verification**

Flag indicating whether to bypass verification of Pods created as part of Job. By default, the field will be unchecked. If the skipJobVerification attribute is present in VNFD's additional attributes, it will be pre-populated during *General attributes* step and automatically removed from *Additional attributes* step.

**Verification - Skip application verification**

Flag indicating whether to bypass verification of application created. By default, the field will be unchecked. If the skipVerification attribute is present in VNFD's additional attributes, it will be pre-populated during *General attributes* step and automatically removed from *Additional attributes* step.

**Helm hooks**

Skip helm hooks - If set, adds no hooks to the helm command. By default, the field will be unchecked. If the helmNoHooks attribute is present in VNFD's additional attributes, it will be pre-populated during *General attributes* step and automatically removed from *Additional attributes* step.

**Clean up resources**

Removes the resources on the cluster associated with the application, including the Persistent Volume Claims and Persistent Volumes. By default, the field will be checked. If the cleanUpResources attribute is present in VNFD's additional attributes, it will be pre-populated during *General attributes* step and automatically removed from *Additional attributes* step.

**Manual controlled scaling**

If set, scaling is handled by EVNFM controlling the HPA through Scale VNF requests rather than the Horizontal Pod Autoscaler (HPA). By default, the field will be unchecked. If the manoControlledScaling attribute is present in VNFD's additional attributes, it will be pre-populated during *General attributes* step and automatically removed from *Additional attributes* step.

**Scale level**

Select which kind of scaling should be applied when instantiating CNF. Choose Instantiation
Level ID to select specific instantiation level defined in vnfd. Select Dynamic Scale Level to
set scaling level value to each scaling aspect individually.

**Instantiation Level ID**

Select the instantiation level to be used during instantiation. This option will only be displayed if
instantiation levels are defined in the vnfd. The default level defined will be selected automatically.

**Target scale level info**

This section will be available when using **Dynamic Scale Level** option. It contains a list of scaling aspect with basic informtion and allows to set scaling level for each scaling aspect defined in vnfd.

**Extensions**

Select the extension to be used for each aspect defined in the vnfd. This will determine how each aspect will be scaled. Either CISMControlled or
ManualControlled can be selected for each aspect

**Deployable Modules**

Select which deployable module should be disabled or enabled when instantiating CNF.


![](./documentation/images/general_attributes_error_messages.png)
_Figure General attributes > Error messages_

&nbsp;

![](./documentation/images/instantiate_general_attributes_validated.png)
_Figure Instantiate > General attributes, validated_

&nbsp;

####Additional attributes

**Additional attributes** allows the user to provide values for the additional attributes specified by the VNF descriptor for the selected package. Any default values provided in the VNF descriptor will be pre-populated into the list. The user can overwrite the defaults, populate blank fields or leave them empty. 
A YAML file that provides additional attribute values can be used instead of or in addition to the values supplied manually through the user interface. The user can choose to use either options by selecting the 'Upload values file' or 'Input UI values' checkbox at the top of the list. The 'Input UI values' checkbox is checked by default when the page first loads. 
The user can upload a values file and also input UI values by selecting or deselecting both checkboxes.

> Note:
> - The container registry URL can be overridden during Instantiate operation (this can be done if the user needs to manage an external container registry used for EVNFM, which is installed using "Option 2" See - _EO Cloud Native Installation Instructions_: EVNFM-Specific Pre-Deployment and _EO Cloud Native Upgrade Instructions_: Container VNFM Pre-Deployment for details of deploying EVNFM with internal and external container registries). For more information about how to manage the Global Registry URL, please check the Overridable Global Registry URL section in the User Guide.
> - Values present in the user interface shall override any values defined in the YAML file. This restriction also applies to any default values that were automatically populated from the VNF descriptor. To override default values with a YAML file manually remove them from the user interface by clearing their input fields.
> - When only the 'Upload values file' is selected, any inputs added in the UI will be ignored.
> - Boolean values can be updated in the dropdown. To clear the selection, the user can select the 'None' option.
> - YAML files with fields in dot notation such as "influxdb.ext.apiAccessHostname: test" will not work. Please use the following YAML structure:

```
            influxdb:
                ext:
                    apiAccessHostname: test
```
> - Additional Attributes supported types: primitive types - int/string/null/boolean/timestamp/float; complex types - list, map. Primitive types validation by "entry_schema" is supported for content of complex types (list, map).
> - Secret attribute details can be provided via UI if VNF descriptor are configuared with secret attributes.
> - There is no validation for the additional attribute fields except list, map and secrets types. You can continue with the instantiation even if fields
> marked as mandatory are not provided with a value. Failure to provide valid values for mandatory additional attributes will result in a broken deployment. By default, the 'Next' button is always enabled. However, if the user has enabled the file upload option, the 'Next' button will be disabled until a file is uploaded, or the user deselects the option.
> - To add VNF to ENM after instantiation, all OSS topology attributes must be set during this step.
> - EVNFM does not allow override scaling values from VNF descriptor by additional attributes.

![](./documentation/images/additional_attributes_edit.png =70%x*)
_Figure Instantiate > Additional attributes_

&nbsp;

If the selected file is not of type .yml or .yaml a notification will be displayed to the user stating that this is an unsupported type.

![](./documentation/images/additional_attributes_unsupported_file_type.png)
_Figure Additional attributes > Unsupported file type_

&nbsp;

![](./documentation/images/additional_attributes_file.png =70%x*)
_Figure Additional attributes > Disabled inputs when using file upload_

&nbsp;

![](./documentation/images/additional_attributes_boolean.png =70%x*)
_Figure Additional attributes > Boolean value dropdown_

&nbsp;

![](./documentation/images/additional_attributes_fields.png =70%x*)

&nbsp;

![](./documentation/images/additional_attributes_fields_not_valid.png =50%x*)
_Figure Additional attributes > List and Map types_

&nbsp;

> **Note:**
> Values for list/map types should be in JSON format (e.g. valid input JSON) 
>   - For the list type with string type in the entry-schema: ["value1","value2"]; 
>   - For the map type with int type in the entry-schema: {"key1" : 1, "key2" : 2}.

**Passing values.yaml Content as Additional Parameters**

In a full stack environment where an NFVO communicates with the VNFM, all additional parameters must be in the VNFD - values.yaml cannot be used. However, if it is not feasible to include all additional parameters in the VNFD, EVNFM allows you to add the contents of values.yaml as a regular JSON format to a life cycle operation request.

The key for this additional parameter is values.yaml

Example of value for values.yaml:
```
{
  "eric-pm-server": {
    "server": {
      "persistentVolume": {
        "storageClass": "network-block"
      }
    }
  }
}
```
**Secret attributes**

![](./documentation/images/additional_attributes_secrets_card.png =50%x*)
_Figure Additional attributes > Secret attributes_

&nbsp;

Secret attributes can be provided in a group of input cards

**Note:**
* A new secret attribute can be added by clicking the Add secret button. A secret attribute card will be added.
* Each card contains a Secret name and a group of key/value pairs. Multiple secret attributes should not contain same the secret name. For each secret attribute, there should be at least one key/value pair provided and multiple key/value pairs should not contain the same key.
* For each key/value pair, the value text field can be shown/hidden by clicking the eye icon when hover over on the right side of the value text field.
* For key/value pair that has a JSON format value, the value can be provided by attaching a .json file. File can be attached by clicking the file uploader icon beside the value text field. The content of file will then be parsed and validated for correctness of JSON format. Alternatively, a JSON value can also be given by directly typing in the text field, but in this case, the format of JSON will not be validated.
* Secret attributes and key/value pairs can be deleted by clicking the trashcan icon.

![](./documentation/images/additional_attributes_secrets_card_duplicate_secret_name.png =50%x*)
_Figure Additional attributes > Secret attributes with duplicate secret name_

&nbsp;

![](./documentation/images/additional_attributes_secrets_card_duplicate_key.png =50%x*)
_Figure Additional attributes > Secret attributes with duplicate key_

&nbsp;

![](./documentation/images/additional_attributes_secrets_card_show_hide_value.png =50%x*)
_Figure Additional attributes > Secret attributes show/hide value_

&nbsp;

![](./documentation/images/additional_attributes_secrets_card_file.png =50%x*)
_Figure Additional attributes > Secret attributes attach .json file_

&nbsp;

![](./documentation/images/additional_attributes_secrets_card_file_invalid.png =50%x*)
_Figure Additional attributes > Secret attributes attach invalid .json file_

&nbsp;

####Summary

**Summary** offers the final opportunity to review the information provided for instantiation. 
- To view the additional attributes click the arrow to the right of **Additional attributes** in the center of the screen.
- To view changed deployable modules click the arrow to the right of **Deployable Modules** in the center of the screen.

![](./documentation/images/instantiate_summary.png =80%x*)
_Figure Instantiate > Summary_

&nbsp;

> Note: If a values file was used it will only display the name of the uploaded file.

![](./documentation/images/instantiate_summary_with_file.png =80%x*)
_Figure Instantiate > Summary with file_

&nbsp;

To start the instantiation operation click the **Instantiate** button. When clicked a pop up message will appear in the center of the screen informing about the ongoing instantiation of the resource. The message displays two buttons.

The **See Resource** list button redirects back to **Resources** where the new resource can be viewed. The **See Operation list** button redirects to **Operations** where the list of operations that have been performed on the resources can be viewed, with the most recent operations displaying at the top of the list.

![](./documentation/images/instantiate_summary_instantiate_message.png =70%x*)
_Figure Instantiate > Summary > Instantiate message_

&nbsp;

If the Instantiate operation request fails, a dialog box displays the content of the error. Click **Close** to close the dialog box and return to the **Summary** step.

![](./documentation/images/instantiate_summary_error_message_dialog.png =70%x*)
_Figure Instantiate > Summary > Error message dialog_

&nbsp;
___
## CISM Clusters

The **CISM Clusters** page provides basic cluster config files management capabilities. 

The **CISM Clusters** table shows the details of the registered CISM clusters available on the system.

Registered CISM clusters can be used to instantiate new resources. The list of cism clusters auto-updates to provide a live view. Cism clusters can be sorted in ascending or descending order. The page contains partial data filtered by page. (15 clusters on the page by default). General information about the entries on the page is presented in the subtitle.

![](./documentation/images/cism_clusters.png =70%x*)
_Figure CISM Clusters_

&nbsp;

To access the options for a cluster config click on the triple dot icon located in the cluster name cell. This menu contains two options:

1. **Deregister cluster**: Start the process of deregister the selected cluster.
2. **Update cluster config**: Start the process of update config the selected cluster.
3. **Make default**: Start the process of set cluster as default the selected cluster.

![](./documentation/images/cism_cluster_tripe_dot_menu.png =70%x*)
_Figure CISM Clusters > Triple Dot Menu_

&nbsp;

###Register cluster

To register a new cluster simply click on the **Register cluster** button on the top right of the CISM Clusters page to open the **Register cluster** dialog.

Select the cluster config file you want to register and add optional description. Once the file has been selected the **Upload** button will be enabled.

**Important!** If there is no valid EVNFM license present in NeLS, the 'Register cluster' button will be enabled but cluster registration request will be rejected with corresponding error message. For more information about the licensing feature refer to the EO Cloud Native System Administration guide.

Currently only config files with one context is supported.

The first registered cluster will be marked as default by default. Optionally mark the cluster to be used as default and it becomes a new default cluster.

![](./documentation/images/cism_cluster_register_dialog.png =70%x*)
_Figure CISM Clusters > Register a cluster config_

&nbsp;

###Update cluster config

To update a cluster config if the user has the correct permissions then it can be updated by selecting the **Update cluster config** option in the cluster triple dot menu.

Select the cluster config file you want to update and add optional description. Also user has possibility to disable EVNFM checking that updated cluster config refer to the same cluster. Once the file has been selected the **Upload** button will be enabled.

**Important!** If there is no valid EVNFM license present in NeLS, the 'Update cluster config' option will be enabled but cluster update request will be rejected with corresponding error message. For more information about the licensing feature refer to the EO Cloud Native System Administration guide.

If the cluster is not used as default currently, it could be marked as such and will become a new default cluster. It is not possible to clear that flag for default cluster though as default cluster should exist in the system at any point of time.

![](./documentation/images/cism_cluster_update_clusrer_config_dialog.png =70%x*)
_Figure CISM Clusters > Update a cluster config_

&nbsp;

###Deregister cluster

To deregister a cluster if the user has the correct permissions and the cluster is not in _in use_ state and is not marked as default then it can be deregistered by selecting the **Deregister Cluster** option in the cluster triple dot menu.

**Important!** If there is no valid EVNFM license present in NeLS, the 'Deregister cluster' option will be enabled but cluster deletion request will be rejected with corresponding error message. For more information about the licensing feature refer to the EO Cloud Native System Administration guide.

![](./documentation/images/cism_cluster_deregister_cluster_option.png =50%x*)
_Figure Deregister Cluster > Deregister Cluster Option_

&nbsp;

The user will be presented with a dialog to confirm the deregistration. Once the **Deregister** is pressed then it cluster will be deregistered.

![](./documentation/images/cism_cluster_deregister_cluster_dialog.png =70%x*)
_Figure Deregister Cluster > Deregister Cluster Dialog_

&nbsp;

###Make default
To set cluster as default user must have the correct permissions and the cluster should be is not in _default_ state then it can proceed by selecting the **Make default** option in the cluster triple dot menu.

![](./documentation/images/cism_cluster_set_default_cluster_dialog.png =70%x*)
_Figure Make Default > Make Default Dialog_

&nbsp;

###Filtering

To filter the table of CISM clusters open the filters panel by clicking on the funnel icon in the top left of the screen. The CISM clusters table can be filtered by *Usage state* and *Cluster name* column. The textual filters are case-sensitive and will match to any part of the text.

If multiple filters are specified an cluster will have to match on all of them to be shown. Click the **Reset** button at the bottom of the filters panel to clear all of the filter fields. Click the **Apply** button at the bottom of the filters panel to get a view of clusters that is consistent with the current state of the filter fields.

To get an unfiltered view of clusters, first click the **Reset** button to clear all filter fields followed by the **Apply** button.

![](./documentation/images/cism_clusters_filter_funnel_icon.png =70%x*)
_Figure CISM clusters > Filter funnel icon_

&nbsp;

![](./documentation/images/cism_clisters_filter_panel.png =70%x*)
_Figure CISM clusters > Filter Panel_

&nbsp;

###Details Panel

To view more information about a cluster select the package row and click the info icon in the top right corner of the screen. This opens a details panel where information about the cluster can be viewed.

![](./documentation/images/cism_cluster_details_panel.png =70%x*)
_Figure CISM Clusters > Details Panel_

&nbsp;

###Triple Dot Menu

The triple dot menu in the top right corner of the Details panel shows options for the selected cluster:

1.  **Deregister cluster**: Start the process of cluster deregistration for selected cluster.

![](./documentation/images/cism_cluster_details_panel_triple_dot_menu.png =70%x*)
_Figure CISM Clusters > Details Panel > Triple Dot Menu_

&nbsp;
___
## Add node to ENM

###Prerequisites

- EVNFM deployed with Ericsson Network Manager (ENM) instance.

- The Resource is in the instantiated state.

To add a resource to ENM navigate to **Resources** and click the triple dot icon of the resource to be added. This menu is accessible from either the details panel on the right side of the screen when the chosen resource is selected or from the table row next to the **Resource instance name**. Select the **Add node to ENM** option to open the **Add node to ENM** page.

**Important!** If there is no valid EVNFM license present in NeLS, the 'Add node to ENM' option will be enabled but after further steps the request will be rejected with corresponding error message. For more information about the licensing feature refer to the EO Cloud Native System Administration guide.

![](./documentation/images/resources_triple_dot_menu_add_node_to_enm.png =70%x*)
_Figure Resources > Triple dot menu > Add node to ENM_

&nbsp;

###Add node to ENM page

When the **Add node to ENM** option from the menu is clicked, the **Add node to ENM** page opens.

If during instantiation operation there is no form for oss Topology data at the stage of  Additional attributes, a page without a form opens and then upload data as a file and click the Add node button.

![](./documentation/images/add_node_instantiation_without_oss.png =70%x*)
_Figure Instantiate page > Instantiation without form for oss Topology_

&nbsp;

![](./documentation/images/add_node_page_without_form.png =70%x*)
_Figure Add node to ENM > Add node page without form_

&nbsp;

And if during the *instantiation* operation there is a form for data **oss Topology**, then the page with the form opens.

![](./documentation/images/add_node_instantiation_with_oss.png =70%x*)
_Figure Instantiate page > Instantiation with form for oss Topology_

&nbsp;

![](./documentation/images/add_node_page_with_form.png =70%x*)
_Figure Add node to ENM > Add node page with form_

&nbsp;

The request can be cancelled using the **Cancel** button.

To proceed without overriding attributes set during **Instantiate**:

- Select **Edit Attributes** under **Override Topology Attributes**, do not change any fields, and click the **Add node** button.

To override attributes set during **Instantiate**:

- Select **Upload Values File** under **Override Topology Attributes**, upload a valid YAML or YML file using the **Select file** button, and click the **Add node** button.

**Example1** addNodeToENM\_required\_and\_optional\_params.yaml

```
  managedElementId: myId
  networkElementType: PCG
  networkElementUsername: root
  networkElementPassword: c2hyb290
  nodeIpAddress: 123.34.56.78.67
  operationResponse: add_node_data
  fmAlarmSupervision: true
  vnfInstanceId: c8731261-2bd8-420d-a9d9-f50ae97fd422
  smallStackApplication: true
  communityString: enm-public
  transportProtocol: SSH
  netConfPort: 830
  snmpPort: 161
  pmFunction: false
  cmNodeHeartbeatSupervision: true
  operation: add_node_data
  timeZone: Europe/Stockholm
```

**Example2** addNodeToENM\_required\_params\_template.yaml

```
  managedElementId: myId
  networkElementType: UDM-AUSF
  networkElementUsername: my-user
  networkElementPassword: my-password
  nodeIpAddress: 10.210.174.58
  communityString: enm-public
  netConfPort: 830
  timeZone: Europe/Stockholm
```
&nbsp;
or

- Select **Edit Attributes** under **Override Topology Attributes**, configure attributes using the relevant fields, and click the **Add node** button.

![](./documentation/images/add_node_upload_file.png =70%x*)
_Figure Add node to ENM > Upload values file to override topology attributes_

&nbsp;

![](./documentation/images/add_node_edit_attributes.png =70%x*)
_Figure Add node to ENM > Edit attributes to override topology attributes_

&nbsp;

After clicking **Add node**, the user is redirected to the **Resources** page and an **Add node operation started** notification appears in the top right corner of the screen.

![](./documentation/images/add_node_started_notification.png)
_Figure Add node operation started notification_

&nbsp;

When the **Add node** request has received a successful response, a **Success** notification appears in the top right corner of the screen.

![](./documentation/images/add_node_success.png =70%x*)
_Figure Add node success notification_

&nbsp;

In the event that the **Add node** request returns an unsuccessful response, an error notification will appear.

&nbsp;
___
## Delete Node from ENM

###Prerequisites

- The Resource is in the instantiated state.

- A node has been added to ENM.

###Steps to remove node

1.  To remove a resource from ENM, navigate to **Resources** and click the triple dot icon of the resource to be removed. This menu is accessible from either the details panel on the right side of the screen when the chosen resource is selected, or from the table row next to the Resource instance name. On the context menu, select the **Delete node from ENM** option to remove the resource from ENM.

**Important!** If there is no valid EVNFM license present in NeLS, the 'Delete node from ENM' option will be enabled but the request will be rejected with corresponding error message. For more information about the licensing feature refer to the EO Cloud Native System Administration guide.

![](./documentation/images/resources_triple_dot_menu_delete_node_from_enm.png =70%x*)
_Figure Resources > Triple dot menu > Delete node from ENM_

&nbsp;

2.  When the **Delete node from ENM** option from the menu is clicked, a dialog message is displayed. Click **Cancel**, or **Delete node** to proceed.

![](./documentation/images/delete_node_dialog.png)
_Figure Delete node dialog_

&nbsp;

    A success notification is displayed on completion, and the Resource details is updated.

![](./documentation/images/success_notification_2.png)
_Figure Success notification_

&nbsp;
___
## Upgrade

To upgrade a resource navigate to **Resources** and click the triple dot menu of the resource to be upgraded. This menu is accessible from either the details panel on the right side of the screen when the chosen resource is selected or from the table row next to the **Resource instance name**. Select the **Upgrade** option to upgrade the resource.

**Important!** If the source package VNFD does not contain scaling aspects and corresponding initial, scaling deltas for vDUs (Deployment, ReplicaSet, Replication Controller, StatefulSet) defined, it is possible to upgrade to a package which does contain them. In this case, the default initial deltas or default instantiation level (if it exists) of the target package will be used.

**Important!** If there is no valid EVNFM license present in NeLS, the 'Upgrade' option will be enabled but the upgrade request will be rejected with corresponding error message. For more information about the licensing feature refer to the EO Cloud Native System Administration guide.

![](./documentation/images/resources_triple_dot_menu_upgrade.png =70%x*)
_Figure Resources > Triple dot menu > Upgrade_

&nbsp;

![](./documentation/images/resources_details_panel_triple_dot_menu_upgrade.png =70%x*)
_Figure Resources > Details panel > Triple dot menu > Upgrade_

&nbsp;

####Upgrade steps

There are five steps to complete to upgrade a resource:

- Package selection

- Infrastructure

- General attributes

- Additional attributes

- Summary

To navigate between the steps click the **Next** and **Previous** buttons at the bottom right of the screen. To cancel the upgrade operation click the **Cancel** button on the bottom left of the screen. To quickly navigate between any completed steps use the header. Fields that are marked with "\*" are mandatory and must be completed before the operation can continue.

If a change is made to an earlier step quick navigation using the header to any following completed steps is disabled and the **Next** and **Previous** buttons have to be used instead.

![](./documentation/images/upgrade_package_selection.png =70%x*)
_Figure Upgrade > Package selection_

&nbsp;

####Package selection

Select the onboarded CSAR package to use to upgrade the resource. The packages can be sorted in either ascending or descending order. The **Next** button is disabled until a package is selected.

![](./documentation/images/upgrade_package_selection_2.png =70%x*)
_Figure Upgrade > Package selection_

&nbsp;

####Infrastructure

View the package and infrastructure information. The infrastructure configuration is inherited from the resource that is being upgraded.

![](./documentation/images/upgrade_infrastructure.png =70%x*)
_Figure Upgrade > Infrastructure_

&nbsp;

####General attributes

Optionally update the description, application timeout for the resource that is being upgraded.

![](./documentation/images/upgrade_general_attributes.png =50%x*)
_Figure Upgrade > General attributes_

&nbsp;

**Description**

An optional description of the resource.

**Application timeout**

Application timeout is the maximum time allowed for application upgrade. By default, the field will be prefilled with value '3600'. If the applicationTimeOut attribute is present in VNFD's additional attributes, it will be pre-populated during *General attributes* step and automatically removed from *Additional attributes* step.

> Tip: A valid application timeout must consist of integers only,for example: "270". If an invalid timeout is provided, an error message is displayed below the input field which explains the accepted values.

**Helm client version**
Allows a user predefine helm client version. By default, the field will be prefilled with version '3.8', but if VNFD has an additional parameter **helm\_client\_version**, the value will be taken from it and automatically removed from *Additional attributes* step. Valid values are things like 3.8, 3.10, 3.12, 3.13, 3.14 and latest.

**Kubernetes OpenAPI schema validation**

Allows a user to disable strict package validation against Kubernetes OpenAPI schema. It is recommended to leave disabled unless you are aware of the OpenAPI validation and wish it to be performed. By default, the field will be checked. If the disableOpenapiValidation attribute is present in VNFD's additional attributes, it will be pre-populated during *General attributes* step and automatically removed from *Additional attributes* step.

**Verification - Skip Job Verification**

Flag indicating whether to bypass verification of Pods created as part of Job. By default, the field will be unchecked. If the skipJobVerification attribute is present in VNFD's additional attributes, it will be pre-populated during *General attributes* step and automatically removed from *Additional attributes* step.

**Verification - Skip application verification**

Flag indicating whether to bypass verification of application created. By default, the field will be unchecked. If the skipVerification attribute is present in VNFD's additional attributes, it will be pre-populated during *General attributes* step and automatically removed from *Additional attributes* step.

**Helm hooks**

Skip helm hooks - If set, adds no hooks to the helm command. By default, the field will be unchecked. If the helmNoHooks attribute is present in VNFD's additional attributes, it will be pre-populated during *General attributes* step and automatically removed from *Additional attributes* step.

**Skip merging previous values**

If ticked allows to skip merging values from previous release during the Upgrade operation. By default, the field will be unchecked. If the skipMergingPreviousValues attribute is present in VNFD's additional attributes, it will be pre-populated during *General attributes* step and automatically removed from *Additional attributes* step.

**Clean up resources**

Removes the resources on the cluster associated with the application, including the Persistent Volume Claims and Persistent Volumes. By default, the field will be checked. If the cleanUpResources attribute is present in VNFD's additional attributes, it will be pre-populated during *General attributes* step and automatically removed from *Additional attributes* step.

**Manual controlled scaling**

If set, scaling is handled by EVNFM controlling the HPA through Scale VNF requests rather than the Horizontal Pod Autoscaler (HPA). By default, the field will be unchecked. If the manoControlledScaling attribute is present in VNFD's additional attributes, it will be pre-populated during *General attributes* step and automatically removed from *Additional attributes* step.

**Persist Scale Info**

Persists the scale information from previous state. By default, the field will be checked. If the persistScaleInfo attribute is present in VNFD's additional attributes, it will be pre-populated during *General attributes* step and automatically removed from *Additional attributes* step.

**Instantiation Level ID**

This cannot be changed during an upgrade. It will display the instantiation level of the current package if it is present, if not present it will display the default instantiation level of the target package.

**Extensions**

Select the extension to be used for each aspect defined in the vnfd. This will determine how each aspect will be scaled. Either CISMControlled or
ManualControlled can be selected for each aspect

![](./documentation/images/upgrade_general_attributes_error_message.png =70%x*)

_Figure Upgrade > General attributes > Error messages_

&nbsp;

**Deployable Modules**

Select **Persist Deployable Modules configuration from previous state** checkbox to persist previous configuration state. By default, the field will be unchecked. If the persistDMConfig attribute is present in VNFD's additional attributes, it will be pre-populated during *General attributes* step and automatically removed from *Additional attributes* step.

Select which deployable module should be disabled or enabled when Upgrading CNF.

![](./documentation/images/upgrade-general-attributes-deployable-modules.png =40%x*)

_Figure Upgrade > General attributes > Deployable Modules_

&nbsp;

####Additional attributes

**Additional attributes** allows the user to provide values for the additional attributes specified by the VNF descriptor for the selected package. Any default values provided in the VNF descriptor will be pre-populated into the list. The user can overwrite the defaults, populate blank fields or leave them empty. A YAML file that provides additional attribute values can be used instead of or in addition to the values supplied manually through the user interface. The user can choose to use either options by selecting the 'Upload values file' or 'Input UI values' checkbox at the top of the list. The 'Input UI values' checkbox is checked by default when the page first loads. The user can upload a values file and also input UI values by selecting or deselecting both checkboxes.

> Note:
> - The container registry URL can be overridden during Upgrade operation (this can be done if the user needs to manage an external container registry used for EVNFM, which is installed using "Option 2" See _EO Cloud Native Installation Instructions_: EVNFM-Specific Pre-Deployment and _EO Cloud Native Upgrade Instructions_: Container VNFM Pre-Deployment for details of deploying EVNFM with internal and external container registries). For more information about how to manage the Global Registry URL, please check the Overridable Global Registry URL section in the User Guide.
> - Values present in the user interface shall override any values defined in the YAML file. This restriction also applies to any default values that were automatically populated from the VNF descriptor. To override default values with a YAML file manually remove them from the user interface by clearing their input fields.
> - When only the 'Upload values file' is selected, any inputs added in the UI will be ignored.
> - Boolean values can be updated in the dropdown. To clear the selection, the user can select the 'None' option.
> - YAML files with fields in dot notation such as "influxdb.ext.apiAccessHostname: test" will not work. Please use the following YAML structure:

```
            influxdb:
                ext:
                    apiAccessHostname: test
```
> - Additional Attributes supported types: primitive types - int/string/null/boolean/timestamp/float; complex types - list, map. Primitive types validation by "entry_schema" is supported for content of complex types (list, map).
> - There is no validation for the additional attribute fields except list and map types. Failure to provide valid values for mandatory additional attributes will result in a broken deployment. By default, the 'Next' button is always enabled. However, if the user has enabled the file upload option, the 'Next' button will be disabled until a file is uploaded, or the user deselects the option.
> - EVNFM does not allow override scaling values from VNF descriptor by additional attributes.

![](./documentation/images/additional_attributes_edit.png =70%x*)
_Figure Upgrade > Additional attributes_

&nbsp;

If the selected file is not of type .yml or .yaml a notification is displayed stating that this is an unsupported type.

![](./documentation/images/additional_attributes_unsupported_file_type_2.png)
_Figure Additional attributes > Unsupported file type_

&nbsp;

![](./documentation/images/additional_attributes_file.png =70%x*)
_Figure Additional attributes > Disabled inputs when using file upload_

&nbsp;

![](./documentation/images/additional_attributes_boolean.png =70%x*)
_Figure Additional attributes > Boolean value dropdown_

&nbsp;

![](./documentation/images/additional_attributes_fields.png =70%x*)

&nbsp;

![](./documentation/images/additional_attributes_fields_not_valid.png =70%x*)
_Figure Additional attributes > List and Map types_

&nbsp;

> Note:
> Values for list/map types should be in JSON format (e.g. valid input JSON) 
>   - For the list type with string type in the entry-schema: ["value1","value2"]; 
>   - For the map type with int type in the entry-schema: {"key1" : 1, "key2" : 2}.


####Summary

**Summary** offers the final opportunity to review the information provided for upgrade. 
- To view the additional attributes click the arrow to the right of **Additional attributes** in the center of the screen.
- To view changed deployable modules click the arrow to the right of **Deployable Modules** in the center of the screen.

![](./documentation/images/upgrade_summary.png =80%x*)
_Figure Upgrade > Summary_

&nbsp;

> Note: If a values file was used it will only display the name of the uploaded file.

![](./documentation/images/upgrade_summary_with_file.png =80%x*)
_Figure Upgrade > Summary with file_

&nbsp;

To start the upgrade operation click **Upgrade**. When clicked a pop up message displays the upgrade status of the resource. The message displays two buttons.

The **See Resource list** button redirects back to **Resources** where the upgraded resource can be viewed. The **See Operation list** button redirects to **Operations** where the list of operations that have been performed on the resources can be viewed, with the most recent operations displaying at the top of the list.

![](./documentation/images/upgrade_summary_upgrade_message.png =70%x*)
_Figure Upgrade > Summary > Upgrade message_

&nbsp;

If the Upgrade operation request fails, a dialog box displays the content of the error. Click **Close** to close the dialog box and return to the **Summary** step.

![](./documentation/images/upgrade_summary_error_message_dialog.png =70%x*)
_Figure Upgrade > Summary > Error message dialog_

&nbsp;
___
## Rollback Resource

###CNF rollback process

To rollback a resource navigate to **Resources** and click the triple dot menu of the resource to be rollback. This menu is accessible
from either the details panel on the right side of the screen when the chosen resource is selected or from the table row next to the **Resource
instance name**. Select the **Rollback** option to rollback the resource.

**Important!** If there is no valid EVNFM license present in NeLS, the 'Rollback' option will be enabled but the rollback request will be rejected with corresponding error message. For more information about the licensing feature refer to the EO Cloud Native System Administration guide.

![](./documentation/images/rollback_resources_downgrade.png =70%x*)
_Figure Resources > Triple dot menu > Rollback_

&nbsp;

![](./documentation/images/resources_details_panel_triple_dot_menu_rollback.png =70%x*)
_Figure Resources > Details panel > Triple dot menu > Rollback_

&nbsp;

The user will open the Rollback page to confirm the rollback. This will allow the user to enter additional parameters that are defined in the VNFD. Click Cancel to return to Resources page. Click Rollback to start the rollback operation.
Rollback uses a rollback pattern defined in VNFD. If it is not defined then a default pattern will be used which just calls rollback helm command. Please see VNFD guide on the rollback pattern.

&nbsp;

![](./documentation/images/rollback_page.png =70%x*) 

&nbsp;

If the previous package version for rollback doesn't exist or rollback on the selected resource cannot be performed or the previous package version for rollback doesn't exist, the user is notified with the reason  

![](./documentation/images/rollback_cannot_be_performed.png =70%x*)

&nbsp;

If rollback operation was completed successfully, last operation for the resource will be changed to "Change package info" with operation state. If rollback
 operation fails, last operation for the resource will be changed to "Change package info" with operation state.

&nbsp;

##Rollback Operation

###Operation rollback process

To rollback an operation from a failed_temp state, select Rollback from the triple dot menu. 

![](./documentation/images/resource_details_operations_force_fail_menu.png =70%x*)
_Figure Resources > Resource detail > operations > Rollback menu_

&nbsp;

![](./documentation/images/operations_force_fail_menu.png =70%x*)
_Figure Operations > Rollback menu_

&nbsp;

The user will be presented with a dialog to confirm the rollback. Click Cancel to close the dialog. Click Rollback to start the rollback of the operation. 

&nbsp;

![](./documentation/images/confirm_rollback_dialog.png)
_Figure Resources > Resource detail > Rollback dialog_

&nbsp;

####Rollback notification

When the Rollback operation is confirmed, a notification appears in the top right hand corner of the screen. 

![](./documentation/images/resource_details_rollback_notification.png)
_Figure Rollback notification_

&nbsp;

![](./documentation/images/operations_rollback_notification.png)
_Figure Operations Rollback notification_

&nbsp;

___
## Scale

To scale a resource navigate to **Resources** and click the triple dot menu of the resource to be scaled. This menu is accessible from either the details panel on the right side of the screen when the chosen resource is selected or from the table row next to the **Resource instance name**. Select the **Scale** option to scale the resource.

**Important!** If there is no valid EVNFM license present in NeLS, the 'Scale' option will be enabled but after further steps the request will be rejected with corresponding error message. For more information about the licensing feature refer to the EO Cloud Native System Administration guide.

![](./documentation/images/resources_table_triple_dot_menu_scale.png)
_Figure Resources > Triple dot menu > Scale_

&nbsp;

![](./documentation/images/resources_details_panel_triple_dot_menu_scale.png)
_Figure Resources > Details panel > Triple dot menu > Scale_

&nbsp;

####Scale steps

These are the steps to complete scaling a resource:

- Scale Type

- Scaling Aspect

- Steps to Scale

- Application Timeout

- Helm hooks

![](./documentation/images/scale_resource_panel.png )
_Figure Scale >Scale Resource_

&nbsp;

**Scale type**
Two types available

- scale_in: removing VNFC instances from the VNF in order to release unused capacity.
- scale_out: adding additional VNFC instances to the VNF to increase capacity

Select the scale type required to scale the resource. "scale_out" is the default option.

**Scaling aspect**

- An identifier that is unique within a VNF descriptor.
- This field is required.
- An option must be selected from the dropdown box.

Once option is selected the scaling levels are populated. The scaling levels displayed are the current, Minimum and Maximum scaling levels of the vnf.

![](./documentation/images/scale_resource_panel_scaling_levels.png)
_Figure Scale >Scale Resource > Scaling Levels_

&nbsp;

####Steps to scale

- This field is optional.
- Number of scaling steps to be executed as part of this Scale VNF operation. It shall be a positive number and the default value shall be 1.

Select the number of steps to be executed or leave blank.

> Tip: A valid steps to scale is a positive number.

If an invalid steps to scale is provided, an error message is displayed below the input field which explains the accepted values.

![](./documentation/images/scale_resource_panel_error_message_1.png)
_Figure Scale > Scale Resource > Error messages 1_

&nbsp;

![](./documentation/images/scale_resource_panel_error_message_2.png)
_Figure Scale > Scale Resource > Error messages 2_

&nbsp;

![](./documentation/images/scale_resource_panel_error_message_3.png)
_Figure Scale > Scale Resource > Error messages 3_

&nbsp;

To execute a scale request all required field must be selected and pass validation.
On successful validation the scale button is enabled.

![](./documentation/images/scale_resource_panel_validated.png)
_Figure Scale > Scale Resource > validated_

&nbsp;

**Application timeout**

Application timeout is the maximum time allowed for application to scale.

Tip: A valid application timeout must consist of integers only, i.e. "270". If an invalid timeout is provided, the Scale button is disabled and an error message is displayed below the input field which explains the accepted values.

![](./documentation/images/scale_resource_panel_timeout_error.png)
_Figure Scale > Scale Resource > timeout error_

&nbsp;

**Helm hooks**

Skip helm hooks - If set, adds no hooks to the helm command

![](./documentation/images/scale_resource_panel_helmNoHooks.png)
_Figure Scale > Scale Resource > Skip helm hooks_

&nbsp;

To begin the scaling of a resource click **Scale**. This will open the Confirm Scale dialog.

####Confirm Scale dialog

Confirm Scale dialog displays the current the components associated with the resource, their current replica counts and their expected replica counts
after the proposed scale operation has completed.


![](./documentation/images/scale_confirm.png =70%x*)
_Figure Scale > Scale Resource > Confirm Scale dialog_

&nbsp;

Click **Scale** to start a scale operation on the resource with the input data provided. The user is then redirected back to **Resources** where
the upgraded resource can be viewed.
Click **Cancel** to close the Confirm Scale dialog.

&nbsp;
___
## Heal

To heal a resource navigate to **Resources** and click the triple dot menu of the resource to be healed. This menu is accessible from either the 
details panel on the right side of the screen when the chosen resource is selected or from the table row next to the **Resource instance name**. 
Select **Heal** to open the Heal Resource page.

**Important!** If no valid EVNFM license present in NeLS, the 'Heal' option will be enabled but after further steps the request will be rejected with corresponding error message. For more information about the licensing feature refer to the EO Cloud Native System Administration guide.

![](./documentation/images/resources_table_triple_dot_menu_heal.png)
_Figure Resources > Triple dot menu > Heal_

&nbsp;

![](./documentation/images/resources_details_panel_triple_dot_menu_heal.png)
_Figure Resources > Details panel > Triple dot menu > Heal_

&nbsp;

####Heal steps

These are the steps to complete healing a resource:

- Cause

- Application timeout

- Additional Parameters

- Secret Attributes (Only when VNF Descriptor is configured with secret attributes for heal)

![](./documentation/images/heal_resource_panel.png =70%x*)
_Figure Heal > Heal Resource_

&nbsp;

**Cause**

This is a mandatory parameter and currently the "Full Restore" is the only value supported.

![](./documentation/images/heal_resource_panel_cause.png)
_Figure Heal > Heal Resource > Cause_

&nbsp;

If this parameter is not contained in the descriptor file of the package associated with the resource, a heal operation is not supported.
A dialog is displayed asserting why the Heal operation cannot be pursued.

![](./documentation/images/resources_heal_resource_cause_not_present.png =70%x*)
_Figure Resources > Triple dot menu > Heal > Cause Not Present_

&nbsp;

**Application Timeout**

Application timeout is the maximum time allowed for application to heal.

Tip: A valid application timeout must consist of integers only, i.e. "270". If an invalid timeout is provided, the Heal button is disabled and an error message is displayed below the input field which explains the accepted values.

![](./documentation/images/heal_resource_panel_timeout_error.png)
_Figure Heal > Heal Resource > timeout error_

&nbsp;

**Additional Parameters**

This allows the user to provide values for the additional parameters specified by the VNF descriptor for the package associated with the selected resource. Any default values provided in the VNF descriptor will be pre-populated into the list. The user can overwrite the defaults, populate blank fields or leave them empty. Fields that are marked with "\*" are mandatory and must be completed.

&nbsp;

**Secret Attributes**

Secret attributes can be provided in a group of input cards

**Note:**
* A new secret attribute can be added by clicking the Add secret button. A secret attribute card will be added.
* Each card contains a Secret name and a group of key/value pairs. Multiple secret attributes should not contain same the secret name. For each secret attribute, there should be at least one key/value pair provided and multiple key/value pairs should not contain the same key.
* For each key/value pair, the value text field can be shown/hidden by clicking the eye icon when hover over on the right side of the value text field.
* For key/value pair that has a JSON format value, the value can be provided by attaching a .json file. File can be attached by clicking the file uploader icon beside the value text field. The content of file will then be parsed and validated for correctness of JSON format. Alternatively, a JSON value can also be given by directly typing in the text field, but in this case, the format of JSON will not be validated.
* Secrets can be deleted using the trashcan icon in the top right corner of each card.

![](./documentation/images/heal_add_secret.png =70%x*)
_Figure Heal > Heal Resource > Adding a Secret_

&nbsp;

![](./documentation/images/heal_multiple_secrets.png =70%x*)
_Figure Heal > Heal Resource > Adding  Multiple Secrets_

&nbsp;

![](./documentation/images/heal_invalid_multi_secret.png =70%x*)
_Figure Heal > Heal Resource > Multiple Secrets showing Invalid Inputs_

&nbsp;

####Heal Resource

To begin the healing of a resource click **Heal**. This will open the Confirm Heal dialog. Click **Heal** to start a heal operation on the resource with the input data provided. The user is then redirected back to **Resources** where the healed resource can be viewed.
Click **Cancel** to close the Confirm Heal dialog.

![](./documentation/images/heal_resource_confirm_heal.png)
_Figure Heal > Heal Resource > Confirm Heal Dialog_

&nbsp;

##Sync

To sync a resource navigate to **Resources** and click the triple dot menu of the resource to be sync. This menu is accessible from either the details panel on the right side of the screen when the chosen resource is selected or from the table row next to the **Resource instance name**. Select **Sync** to open the Sync dialog.

**Important!** If there is no valid EVNFM license present in NeLS, the 'Sync' option will be enabled but after further steps the request will be rejected with corresponding error message. For more information about the licensing feature refer to the EO Cloud Native System Administration guide.

![](./documentation/images/sync_details_operations_menu.png =70%x*)
_Figure Resources > Resource detail > operations > Sync menu_

&nbsp;

The user will be presented with a dialog to confirm the sync. Click **Cancel** to close the dialog. Click **Sync** to start the sync of the operation. Since it is asynchronous operation, user will be able to input timeout in input. Timeout default value is 3600 (1 hour). 

&nbsp;

![](./documentation/images/confirm_sync_dialog.png)
_Figure Resources > Resource detail > Sync dialog_

&nbsp;

####Sync notification

When the **Sync** operation is confirmed, a notification appears in the top right hand corner of the screen. 

![](./documentation/images/resource_details_sync_notification.png)
_Figure Sync notification_

&nbsp;

___
## Modify VNF Information

To modify the VNF information of a resource navigate to **Resources** and click the triple dot menu of the resource to be modified.

**Important!** If there is no valid EVNFM license present in NeLS, the 'Modify VNF Information' option will be enabled but after further steps the request will be rejected with corresponding error message. For more information about the licensing feature refer to the EO Cloud Native System Administration guide.

![](./documentation/images/resources_table_triple_dot_menu_modify_vnf.png =70%x*)
_Figure Resources > Triple dot menu > Modify VNF Information_

&nbsp;

#### Modify VNF Information steps

The 'Modify VNF Information' dialog displays the VNF information attributes that are eligible for modification.

![](./documentation/images/modify_vnf_info_dialog.png =70%x*)
_Figure Modify VNF Information Dialog_

&nbsp;

**Description**

This field represents the vnfInstanceDescription of the resource and is always present in the 'Modify VNF Information' dialog.

**Extensions**

This field represents the modifiable extensions of the resource and is only displayed in the 'Modify VNF Information' dialog if there are currently
extensions associated with the resource. Modifiable extensions are the contents of vnfControlledScaling within the extensions of the resource.

&nbsp;

To begin the modification of VNF Information operation on the resource click **Modify**. Click **Cancel** to close the 'Modify VNF Information' dialog.

&nbsp;

####Modify VNF Information Notification

When the modify operation begins a notification appears in the top right hand corner of the screen. Clicking on the notification redirects to
**Operations** where the modify operation is shown.

![](./documentation/images/modify_vnf_info_notification.png)
_Figure Modify VNF Information Notification_

&nbsp;

___
## Terminate

To terminate a resource navigate to **Resources** and click the triple dot menu of the resource to be terminated. This menu is accessible from either the details panel on the right side of the screen when the chosen resource is selected or from the table row next to the **Resource instance name**. Select **Terminate** to open the Confirm Termination dialog.

**Important!** If there is no valid EVNFM license present in NeLS, the 'Terminate' option will be enabled but after further steps the request will be rejected with corresponding error message. For more information about the licensing feature refer to the EO Cloud Native System Administration guide.

![](./documentation/images/resources_triple_dot_menu_terminate.png =70%x*)
_Figure Resources > Triple dot menu > Terminate_

&nbsp;

####Confirm Termination dialog

Confirm Termination dialog informs the user of the consequences of terminating the resource and provides optional configuration fields. Click **Cancel** to close the dialog. Click **Terminate** to start the termination operation.


> Note: Terminate from UI will always delete the instance identifier on completion and all references to the terminated instance will be removed and will not be visible on the **Operations** page.

![](./documentation/images/resources_confirm_termination_dialog.png)
_Figure Resources > Confirm Termination dialog_

&nbsp;

**Clean up resources**

When ticked also remove persistent volume claims and persistent volumes of an application.

**Skip Job verification**

When ticked, the flow will bypass the verification of Pods created as part of Job.

**Application timeout**

Application timeout is the maximum time allowed for application to terminate.

> Tip: A valid application timeout must consist of integers only, i.e. "270". If an invalid timeout is provided, the Terminate button is disabled and an error message is displayed below the input field which explains the accepted values.

![](./documentation/images/resources_confirm_termination_dialog_2.png)
_Figure Resources > Confirm Termination dialog, invalid input_

&nbsp;

####Terminate notification

When the termination operation begins a notification appears in the top right hand corner of the screen. Clicking on the notification redirects to **Operations** where the termination operation is shown.

![](./documentation/images/terminate_notification.png)
_Figure Terminate notification_

&nbsp;

####Terminate error message

If the Terminate operation request fails, a dialog box will display the content of the error. Click **Close** to close the dialog box and return to the **Resources** page.

![](./documentation/images/resources_confirm_termination_dialog_error_message_dialog.png =70%x*)
_Figure Resources > Confirm Termination dialog > Error message dialog_

&nbsp;
___
## Clean Up

Clean up of resource instances

Select **Clean up** from the triple dot menu, to remove a resource instance from the UI that has failed to instantiate.

The VNF is deleted and artifacts that were instantiated as part of the deployment are also removed.

![](./documentation/images/clean_up_menu.png =70%x*)
_Figure Clean up menu_

&nbsp;

When the **Clean up** option from the triple dot menu is clicked, a dialog message is displayed and provides optional configuration fields. The request can be canceled, or the **Clean up** button clicked to proceed.

**Important!** If there is no valid EVNFM license present in NeLS, the 'Clean Up' option will be enabled but after further steps the request will be rejected with corresponding error message. For more information about the licensing feature refer to the EO Cloud Native System Administration guide.

![](./documentation/images/confirm_clean_up_dialog.png)
_Figure Resources > Clean up dialog_

&nbsp;

**Application timeout**

Application timeout is the maximum time allowed for application to terminate.

> Tip: A valid application timeout must consist of integers only, i.e. "270". If an invalid timeout is provided, the Clean up button is disabled and an error message is displayed below the input field which explains the accepted values.

![](./documentation/images/confirm_clean_up_dialog_invalid_input.png)
_Figure Resources > Confirm Clean up dialog, invalid input_

&nbsp;

####Clean up notification

When the clean up operation begins, a notification appears in the top right hand corner of the screen. Clicking on the notification redirects to **Operations** where the clean up operation is shown. 
The clean up operation is of type Terminate and therefore will be displayed as a Terminate operation on the Operations page.

![](./documentation/images/clean_up_notification.png)
_Figure Clean up notification_

&nbsp;
___

## Force fail

Force fail an operation when the operation is in a failed_temp state

Select **Force fail** from the triple dot menu, to fail an operation.

The operation is updated from a failed_temp state to a failed state

![](./documentation/images/resource_details_operations_force_fail_menu.png =70%x*)
_Figure Resources > Resource detail > operations > Force fail menu_

&nbsp;

![](./documentation/images/operations_force_fail_menu.png =70%x*)
_Figure Operations > Force fail menu_

&nbsp;

When the **Force fail** option from the triple dot menu is clicked, a dialog message is displayed. The request can be canceled, or the **Force fail** button clicked to proceed.

**Important!** If there is no valid EVNFM license present in NeLS, the 'Force fail' option will be enabled but after further steps the request will be rejected with corresponding error message. For more information about the licensing feature refer to the EO Cloud Native System Administration guide.

![](./documentation/images/confirm_force_fail_dialog.png)
_Figure Resources > Resource detail > Force fail dialog_

&nbsp;

####Force fail notification

When the force fail operation is confirmed, a notification appears in the top right hand corner of the screen. 

![](./documentation/images/force_fail_notification.png)
_Figure Force fail notification_

&nbsp;
___
## Backup

Backup allows users to create a backup of a CNF using there ADP BRO that has been deployed with the CNF. It will connect to it by providing its endpoint at either instantiate or upgrade as additional parameters.
The parameter name is "bro_endpoint_url" which contains the url to the BRO.


###Create a backup:
Note: Backup is only compatible with ADP BRO solution. The CNF must be instantiated in the same cluster as EVNFM. It currently does not support connection to ADP BRO in another cluster.

Prerequisites:
- CSAR is deployed with enabled bro.
- The resource is in the instantiated state.
- The resource last operation state is completed.
- The resource has defined the bro end point url when instantiated or on upgrade.

To create a backup:
1. Navigate to resources page and click the triple dot menu of the resource table. Click the backup option.
 > Tip: This menu is accessible from either the details panel on the right side of the screen when the chosen
resource is selected or from the table row next to the resource instance name. On the context menu, select the backup option to create the backup of the resource.


2. When the backup option from the menu is clicked, the backup dialog will be displayed.
 > Tip: The request can be cancelled using the cancel button.


3. Fill in the mandatory fields.
4. Click the "Backup" button to create the backup.
5. A notification will be displayed to the user when the backup request has been sent successfully.

![](./documentation/images/resources_backup_dialog.png)
_Figure Resources > Backup dialog_

&nbsp;

***Backup scope*** - the backup manager that will be used for the backup creation.

***Backup name*** - the resource's backup name that will be created.
> Tip: A valid backup name must consist of up to 250 alphanumeric characters, '-' character or '_' character only.
> If an invalid backup name is provided, an error message is displayed below the input field which explains the accepted values.

&nbsp;

###Get backups:

Prerequisites:
- CSAR is deployed with enabled bro.
- The resource is in the instantiated state.
- The resource last operation state is completed.
- The resource has defined the bro end point url when instantiated or on upgrade.

Here are two ways to get backups: 

1. Navigate to resources page -> select resource -> go to side panel -> go to backups tab - backup name and timestamp displayed here.

![](./documentation/images/resources_details_panel_backups_tab.png =70%x*)
_Figure Resources > Side Panel > Backups tab_

&nbsp;

2. Navigate to resource page -> click on resource`s triple dot menu -> go to details page -> go to backup tab - backup info displayed here.

![](./documentation/images/resources_details_backups_tab.png =70%x*)
_Figure Resources > Details page > Backups tab_

&nbsp;

In case of any prerequisites is not followed error notification appears.

###Delete a backup:

To delete a backup:
1. Navigate to the resources page and click the triple dot menu of the resource table. Click the Go to the details page.

2. On the resource details page click on Backups.
> Tip: One resource may have several backups.

3. On this page choose the backup and click the triple dot menu. Click the delete. When the delete from the menu is clicked, the backup dialog will be displayed.
   ![](./documentation/images/delete_backup.png =70%x*)
   _Figure Resources > Resource detail > Backups_

&nbsp;

4. Click the "Delete" button to delete the backup.
> Tip: The request can be canceled using the cancel button.

![](./documentation/images/delete_backup_dialog.png =70%x*)
_Figure Resources > Resource detail > Backups > Delete dialog_

&nbsp;

###Export a backup:

To export a backup:
1. Navigate to the resources page and click the triple dot menu of the resource table. Click the Go to the details page.

2. On the resource details page click on Backups.
> Tip: One resource may have several backups.

3. On this page choose the backup and click the triple dot menu. Click the Export to external location.
   ![](./documentation/images/export_to_external_location.png =70%x*)
   _Figure Resources > Resource detail > Backups_

&nbsp;

4. When the Export to external location from the menu is clicked, the export backup dialog will be displayed. Provide the remote Url, username and password details.
   ![](./documentation/images/export_backup_dialog.png =70%x*)
   _Figure Resources > Resource detail > Backups > Export dialog_

&nbsp;

5. Click the "Export" button to export the backup.
> Tip: The request can be canceled using the cancel button.




&nbsp;

___
## Reference List

\[1\] _User Guide, 1553-CSX 101 106_

\[2\] _Product Description, 1551-CSX 101 106_

\[3\] _Troubleshooting Guide, 159 01-CSX 101 106_
