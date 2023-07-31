import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./AuthConfig";

export const authProvider = new PublicClientApplication(msalConfig);
