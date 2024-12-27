trigger WealthManagementTrigger on Wealth_Management__c (before insert) {
    // Collect New_Account__c IDs from Wealth_Management__c records being inserted
    Set<Id> newAccountIds = new Set<Id>();
    for (Wealth_Management__c wealth : Trigger.new) {
        if (wealth.New_Account__c != null) {
            newAccountIds.add(wealth.New_Account__c);
        }
    }

    // Fetch existing Wealth_Management__c records linked to the New_Account__c records
    Map<Id, Wealth_Management__c> existingWealthRecords = new Map<Id, Wealth_Management__c>();
    if (!newAccountIds.isEmpty()) {
        List<Wealth_Management__c> wealthList = [
            SELECT Id, New_Account__c 
            FROM Wealth_Management__c 
            WHERE New_Account__c IN :newAccountIds
        ];

        for (Wealth_Management__c wealth : wealthList) {
            existingWealthRecords.put(wealth.New_Account__c, wealth);
        }
    }

    // Fetch RecordType of New_Account__c
    Map<Id, String> accountRecordTypes = new Map<Id, String>();
    if (!newAccountIds.isEmpty()) {
        List<New_Account__c> accounts = [
            SELECT Id, RecordType.Name 
            FROM New_Account__c
            WHERE Id IN :newAccountIds
        ];

        for (New_Account__c account : accounts) {
            accountRecordTypes.put(account.Id, account.RecordType.Name);
        }
    }

    // Iterate over the records being inserted to check for duplicates
    for (Wealth_Management__c wealth : Trigger.new) {
        if (wealth.New_Account__c != null && existingWealthRecords.containsKey(wealth.New_Account__c)) {
            Wealth_Management__c existingWealth = existingWealthRecords.get(wealth.New_Account__c);
            
            // Get the record type of the Account associated with the New_Account__c field
            String accountRecordType = accountRecordTypes.get(wealth.New_Account__c);

            // If the Account's Record Type matches, throw an error to prevent duplicate wealth management records
            if (accountRecordType != null) {
                wealth.addError('A Wealth Management record already exists for this New Account and Record Type: ' + accountRecordType);
            }
        }
    }
}