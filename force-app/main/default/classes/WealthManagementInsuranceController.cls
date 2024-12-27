public with sharing class WealthManagementInsuranceController {
    @AuraEnabled(cacheable=true)
    public static List<Insurance_Policy__c> getInsurancePolicies(Id accountId) {
        System.debug('Fetching Insurance Policies for Account Id: ' + accountId);
        
        List<Insurance_Policy__c> policies = [SELECT Id, Name, Coverage_Amount__c, Policy_Premium_Amount__c, 
                                                Status__c, RecordType.Name,Customer_Name__r.Name, Customer_Name__r.FirstName__c,Customer_Name__r.Last_Name__c
                                              FROM Insurance_Policy__c 
                                              WHERE Customer_Name__c = :accountId];
        
        System.debug('Insurance Policies Found: ' + policies);
        return policies;
    }
      
}