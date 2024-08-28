/*******************************************************************************
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
 ******************************************************************************/
package com.ericsson.orchestration.mgmt.wfs.ui.testware.api.idam;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.Collections;
import java.util.regex.Pattern;

import javax.ws.rs.core.Response;

public class KeycloakHelper {

    private static final Logger LOGGER = LoggerFactory.getLogger(KeycloakHelper.class);
    private static final Pattern PATTERN = Pattern.compile(".*/([^/]+)$");
    private static final String DEFAULT_KEYCLOAK_PASSWORD = "Ericsson123!"; //NOSONAR
    private static final String DEFAULT_KEYCLOAK_HOST = "https://ui-gerrit-keycloak-1017.hahn062.rnd.gic.ericsson.se";
    private static final String DEFAULT_KEYCLOAK_REALM = "master";
    private static final String DEFAULT_KEYCLOAK_USERNAME = "admin";
    private static final String DEFAULT_KEYCLOAK_CLIENT = "eo";
    private static final String DEFAULT_KEYCLOAK_SECRET = "6d19ab9b-9020-4210-ab4d-52847b5c9f31";

    private KeycloakHelper() {
    }

    private static Keycloak getInstance(String serverUrl, String realm, String username, String password, String clientId, String clientSecret) {
        return Keycloak.getInstance(serverUrl, realm, username, password, clientId, clientSecret, null, null, true, null);
    }

    public static void createUser(UserRepresentation user, String... roles) {

        Keycloak keycloak = getInstance(
                getHost(),
                getRealm(),
                getAdminUserName(),
                getAdminPassword(),
                getClient(),
                getClientSecret());

        RealmResource realmResource = keycloak.realm(DEFAULT_KEYCLOAK_REALM);
        UsersResource userResource = realmResource.users();

        CredentialRepresentation credentialRepresentation = new CredentialRepresentation();
        credentialRepresentation.setTemporary(false);
        credentialRepresentation.setType(CredentialRepresentation.PASSWORD);
        credentialRepresentation.setValue(DEFAULT_KEYCLOAK_PASSWORD);
        user.setCredentials(Collections.singletonList(credentialRepresentation));

        try (Response response = userResource.create(user)){
            String userId = PATTERN.matcher(response.getLocation().getPath()).replaceAll("$1");
            userResource.get(userId);

            for(String role : roles) {
                RoleRepresentation realmRole = realmResource.roles()
                        .get(role).toRepresentation();

                userResource.get(userId).roles().realmLevel()
                        .add(Arrays.asList(realmRole));
            }

            LOGGER.info("User {} has been created successfully", user.getUsername());
        } catch (Exception e) {
            LOGGER.error("Failed to create user {} because of error {}", user.getUsername(), e);
            throw e;
        }
    }

    private static String getHost() {
        String host = System.getProperty("keycloak.host", DEFAULT_KEYCLOAK_HOST) + "/auth";
        LOGGER.info("Using Host: " + host);
        return host;
    }

    private static String getRealm() {
        String realm = System.getProperty("keycloak.realm", DEFAULT_KEYCLOAK_REALM);
        LOGGER.info("Using realm: " + realm);
        return realm;
    }

    private static String getAdminUserName() {
        String username = System.getProperty("keycloak.user", DEFAULT_KEYCLOAK_USERNAME);
        LOGGER.info("Using user: " + username);
        return username;
    }

    private static String getAdminPassword() {
        String password = System.getProperty("keycloak.password", DEFAULT_KEYCLOAK_PASSWORD);
        LOGGER.debug("Using password: " + password);
        return password;
    }

    private static String getClient() {
        String client = System.getProperty("keycloak.client", DEFAULT_KEYCLOAK_CLIENT);
        LOGGER.info("Using client: " + client);
        return client;
    }

    private static String getClientSecret() {
        String secret = System.getProperty("keycloak.clientSecret", DEFAULT_KEYCLOAK_SECRET);
        LOGGER.debug("Using client secret: " + secret);
        return secret;
    }
}
