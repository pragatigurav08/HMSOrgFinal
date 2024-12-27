/**
* @File Name : WithdrawalRecordCreation.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : October 17, 2024
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | October 17, 2024 |   | Initial Version
**/

public class WithdrawalRecordCreation {
	@AuraEnabled
	Public static Id WithdrawalRecords(Withdrawal__c   withdrawmoney){
		System.debug('DepositeRecordss>>>>>>>>>>>>');
		try {
            insert withdrawmoney;
            return withdrawmoney.Id;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
	}

	@AuraEnabled(cacheable=true)
    public static List<New_Account__c> searchAccounts(String searchTerm) {
        return [SELECT Id, Name FROM New_Account__c WHERE Name LIKE :('%' + searchTerm + '%') LIMIT 10];
    }
	 @AuraEnabled(cacheable=true)
    public static List<Home_Branch__c> searchBranches(String searchT) {
        return [SELECT Id, Name FROM Home_Branch__c WHERE Name LIKE :('%' + searchT + '%') LIMIT 10];
    }
}