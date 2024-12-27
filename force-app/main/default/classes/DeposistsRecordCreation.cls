/**
* @File Name : DeposistsRecordCreation.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : October 16, 2024
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | October 16, 2024 |   | Initial Version
**/

public class DeposistsRecordCreation {
	@AuraEnabled
	Public static Id Createnewdeposits(Deposites__c   NewDepositeRecords){
		System.debug('DepositeRecordss>>>>>>>>>>>>');
		try {
            insert NewDepositeRecords;
            return NewDepositeRecords.Id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
	}

	  @AuraEnabled(cacheable=true)
public static List<RecordType> getAccountRecordTypes() {
    return [SELECT Id, Name FROM RecordType WHERE SObjectType = 'Deposites__c' AND IsActive = TRUE];
}
 @AuraEnabled(cacheable=true)
    public static List<New_Account__c> searchAccounts(String searchTerm) {
        return [SELECT Id, Name FROM New_Account__c WHERE Name LIKE :('%' + searchTerm + '%') LIMIT 10];
    }
    @AuraEnabled(cacheable=true)
    public static List<Home_Branch__c> searchBranches(String searchT) {
        return [SELECT Id, Name FROM Home_Branch__c WHERE Name LIKE :('%' + searchT + '%') LIMIT 10];
    }
    @AuraEnabled(cacheable=true)
    public static List<New_Account__c> getAccountDetails(Id accountId) {
        // Fetch the account and return required fields
        return [SELECT FirstName__c, Last_Name__c,	DateOfBirth__c,Annual_Income__c,CommunicationResidentAddress__c,Nationality__c,Permanent_Address__c, PANCardNo__c, Phone_number__c FROM New_Account__c WHERE Id = :accountId LIMIT 1];
    }
}