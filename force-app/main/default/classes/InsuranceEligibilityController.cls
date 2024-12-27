public with sharing class InsuranceEligibilityController {

    // Fetch details from New_Account__c object based on Account ID
    @AuraEnabled(cacheable=true)
    public static New_Account__c getAccountDetails(Id accountId) {
        return [SELECT Annual_Income__c, FirstName__c,Gender__c,DateOfBirth__c FROM New_Account__c WHERE Id = :accountId];
    }
	@AuraEnabled(cacheable=true)
public static List<New_Account__c> searchAccounts(String searchTerm) {
    String searchQuery = '%' + searchTerm + '%';
    return [SELECT Id, Name, Annual_Income__c,Gender__c,DateOfBirth__c FROM New_Account__c WHERE Name LIKE :searchQuery LIMIT 10];
}
@AuraEnabled(cacheable=true)
public static List<Beneficiary__c> searchBeneficiaries(String searchTerm) {
    return [SELECT Id, Name FROM Beneficiary__c WHERE Insurance_Policy__c =:searchTerm LIMIT 10];
}
  @AuraEnabled(cacheable=true)
    public static Map<String, Integer> getPolicyCountsByRecordType(Id accountId) {
        Map<String, Integer> policyCounts = new Map<String, Integer>();
        for (AggregateResult ar : [
            SELECT RecordType.Name recordTypeName, COUNT(Id) recordCount
            FROM Insurance_Policy__c
            WHERE Customer_Name__c = :accountId
            GROUP BY RecordType.Name
        ]) {
            policyCounts.put((String) ar.get('recordTypeName'), (Integer) ar.get('recordCount'));
        }
        return policyCounts;
    }
}