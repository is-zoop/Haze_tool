/**
 * Temporary prototype data.
 * Replace with API data when backend integration begins.
 */
import { AuthProviderConfig } from "../types/system-management";

export const systemAuthSettings: AuthProviderConfig[] = [
  {
    id: "PROV_PWD",
    name: "本地账号密码",
    type: "password",
    enabled: true,
    configured: true,
    lastTestTime: "2026-06-15 10:00:00",
    userCount: 45
  },
  {
    id: "PROV_OIDC",
    name: "企业 OIDC 网关",
    type: "oidc",
    enabled: true,
    configured: true,
    lastTestTime: "2026-06-15 12:43:00",
    userCount: 152,
    issuerUrl: "https://sso.haze-corp.com/oauth2/default",
    clientId: "haze_intelligence_portal_prod",
    clientSecretRef: "secret://auth/oidc/client-secret",
    authEndpoint: "https://sso.haze-corp.com/oauth2/v1/authorize",
    tokenEndpoint: "https://sso.haze-corp.com/oauth2/v1/token",
    userinfoEndpoint: "https://sso.haze-corp.com/oauth2/v1/userinfo",
    scopes: "openid profile email phone offline_access",
    userField: "sub",
    emailField: "email",
    nameField: "display_name",
    deptField: "department_code",
    autoCreateUser: true,
    defaultRole: "NORMAL_USER",
    autoSyncDept: true
  },
  {
    id: "PROV_SAML",
    name: "SAML 2.0 企业 SSO",
    type: "saml",
    enabled: false,
    configured: true,
    lastTestTime: "2026-06-10 11:15:30",
    userCount: 0,
    issuerUrl: "https://saml.haze-corp.com/metadata",
    clientId: "haze_sp_entity_id",
    clientSecretRef: "secret://auth/saml/sign-cert",
    authEndpoint: "https://saml.haze-corp.com/sso/post",
    scopes: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
    emailField: "NameID",
    autoCreateUser: true,
    defaultRole: "NORMAL_USER"
  },
  {
    id: "PROV_LDAP",
    name: "LDAP / Active Directory",
    type: "ldap",
    enabled: false,
    configured: false,
    lastTestTime: "未测试",
    userCount: 0,
    issuerUrl: "ldap://ad.haze-corp.com:389",
    clientId: "cn=admin,dc=haze,dc=co",
    clientSecretRef: "secret://auth/ldap/bind-pwd",
    scopes: "ou=People,dc=haze,dc=co",
    userField: "sAMAccountName",
    emailField: "mail",
    nameField: "cn",
    deptField: "memberOf",
    autoCreateUser: false,
    autoSyncDept: false
  },
  {
    id: "PROV_GWORK",
    name: "Google Workspace Link",
    type: "google",
    enabled: false,
    configured: false,
    lastTestTime: "未测试",
    userCount: 0
  },
  {
    id: "PROV_MSENTRA",
    name: "Microsoft Entra ID",
    type: "microsoft",
    enabled: false,
    configured: false,
    lastTestTime: "未测试",
    userCount: 0
  }
];
