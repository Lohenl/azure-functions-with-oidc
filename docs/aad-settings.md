AAD Settings
===

    1. App Registration
    2. Redirect URIs:
        - http://localhost:3000
        - https://your-app.here
    3. Front channel logout URL:
        - TBC
    4. Implicit grant and hybrid flows
        - Dont enable access tokens
        - Dont enable ID Tokens
        - (The above 2 settings will enable PKCE flow required by MSAL)
    5. Supported account types
        - Default Directory only - Single tenant
    6. Allow public client flows
        - Dont enable public client flows