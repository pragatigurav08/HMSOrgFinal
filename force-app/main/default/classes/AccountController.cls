public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static New_Account__c getAccountById(string accountId) {
        try {
            System.debug('Account ID passed: ' + accountId);  // Debug log

            // Fetch New_Account__c record with the given ID
            List<New_Account__c> accounts = [SELECT Id, Annual_Income__c 
                                             FROM New_Account__c 
                                             WHERE Name = :accountId LIMIT 1];

            // Check if any record is returned
            if (accounts.isEmpty()) {
                throw new AuraHandledException('No account found with this ID');
            }

            // Return the first record from the list
            New_Account__c account = accounts[0];
            System.debug('Fetched Account: ' + account);  // Log the fetched record
            return account;
        } catch (Exception e) {
            System.debug('Error: ' + e.getMessage());  // Log any errors
            throw new AuraHandledException('No account found with this ID');
        }
    }
}