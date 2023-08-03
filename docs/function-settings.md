Azure Function Settings
===

    - Storage Account
        1. Need to create a Storage Account (not free tier?)
        2. Get a connection string
        3. In Azure Function portal page > Settings blade > Configuration > Application Settings tab
        4. If "AzureWebJobsStorage" is not defined, create a new setting, and paste the storage account connection string "DefaultEndpointsProtocol=..." inside
        
    - Authentication (Ensure Azure AD is set up first)
        1. Add Microsoft Identity Provider
        2. Tenant Type: Workforce
        3. App registration type: Existing App registration
        4. Select app registration set up in Azure AD
        5. Issuer URL: <Automatically set>
        6. Restrict access: Require authentication
        7. Unauthenticated requests: 302 Found redirect
        8. Token store: Yes
