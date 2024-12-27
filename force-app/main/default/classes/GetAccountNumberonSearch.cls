public with sharing class GetAccountNumberonSearch {
@AuraEnabled(cacheable=true)
    public static List<Account> getAccountByNumber(String accountNumber) {
        // Query account based on the provided account number
        return [SELECT Name, AccountNumber, Phone, BillingStreet, BillingCity, BillingState, BillingPostalCode 
                FROM Account 
                WHERE AccountNumber = :accountNumber];
    }
    public static void processAccount(Account acc) {
        // Example logic: Ensure the account number exists and is unique
        List<Account> existingAccounts = getAccountByNumber(acc.AccountNumber);
        
        if (!existingAccounts.isEmpty()) {
            // Perform some logic if needed, e.g., validation, updates, etc.
            System.debug('Account with this number already exists: ' + existingAccounts[0].Name);
        } else {
            System.debug('No existing account found with this number.');
        }
    }
}