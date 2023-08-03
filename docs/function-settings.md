Azure Function Settings
===

    - Storage Account
        1. Need to create a Storage Account (not free tier?)
        2. Get a connection string
        3. In Azure Function portal page > Settings blade > Configuration > Application Settings tab
        4. If "AzureWebJobsStorage" is not defined, create a new setting, and paste the storage account connection string "DefaultEndpointsProtocol=..." inside
        
    - Authentication
        1. 
