public with sharing class InsurancePolicyController {
    
    @AuraEnabled(cacheable=true)
    public static List<New_Account__c> searchAccounts(String searchTerm) {
        return [SELECT Id, Name FROM New_Account__c WHERE Name LIKE :('%' + searchTerm + '%') LIMIT 10];
    }
@AuraEnabled(cacheable=true)
    public static List<User> searchUsers(String searchTerm) {
        return [SELECT Id, Name FROM User WHERE Name LIKE :('%' + searchTerm + '%') LIMIT 10];
    }
        @AuraEnabled(cacheable=true)
    public static List<Contact> searchContacts(String searchTerm) {
        if (String.isEmpty(searchTerm)) {
            return new List<Contact>(); // Return empty if search term is empty
        }

        // Query contacts where name starts with the search term (case insensitive)
        return [SELECT Id, Name FROM Contact WHERE Name LIKE :searchTerm + '%' LIMIT 10];
    }
}