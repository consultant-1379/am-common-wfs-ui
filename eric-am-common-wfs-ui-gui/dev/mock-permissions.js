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
export function superUserPermissions() {
  return {
    userInformation: {
      username: "iamsuperuser",
      permissions: {
        "E-VNFM Resource Instantiation Resource": ["POST"],
        "E-VNFM Manual Fail Operation": ["POST"],
        "E-VNFM Manual Rollback Operation": ["POST"],
        "E-VNFM Resource Resource": ["POST", "GET", "DELETE", "PATCH"],
        "E-VNFM Resource Termination Resource": ["POST"],
        "E-VNFM Operation History Resource": ["GET"],
        "E-VNFM ENM Node Integration Resource": ["POST"],
        "E-VNFM ENM Node Deletion Resource": ["DELETE"],
        "E-VNFM Resource Upgrade Resource": ["POST"],
        "E-VNFM Manual Scale Resource": ["POST"],
        "E-VNFM Packages Resource": ["POST"],
        "E-VNFM Package Onboarding Resource": ["PUT"],
        "E-VNFM Resource DowngradeInfo Resource": ["GET"],
        "E-VNFM Manual Heal Resource": ["POST"],
        "E-VNFM Backup Resource": ["POST"],
        "E-VNFM Cluster Configuration Resource": ["POST", "DELETE", "GET", "PUT", "PATCH"],
        "E-VNFM Syncronize Resource": ["POST"]
      },
      roles: ["E-VNFM UI User Role"]
    }
  };
}
