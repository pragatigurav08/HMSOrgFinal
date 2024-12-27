/**
* @File Name : AdvisorController.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : October 23, 2024
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | October 23, 2024 |   | Initial Version
**/

public with sharing class AdvisorController {
    
    @AuraEnabled
    public static void saveAdvisor(Map<String, Object> advisor) {
        Advisor__c newAdvisor = new Advisor__c();
        
        newAdvisor.Advisor_Name__c = (String) advisor.get('advisorName');
        newAdvisor.Email_Address__c = (String) advisor.get('emailAddress');
        newAdvisor.Phone_Number__c = (String) advisor.get('phoneNumber');
       // newAdvisor.Assets_Under_Management_AUM__c = (Decimal) advisor.get('assetsUnderManagement');
        newAdvisor.Specialization__c = (String) advisor.get('specialization');

        // Associate the Advisor with a specific New_Account__c record
        newAdvisor.New_Account__c = (Id) advisor.get('newAccountId');  // Accept the New_Account__c ID

        insert newAdvisor;
    }
	@AuraEnabled
public static List<Advisor__c> getAdvisorsByAccountId(Id accountId) {
    List<Advisor__c> advisors = [SELECT Id, Advisor_Name__c, Email_Address__c, Phone_Number__c, 
                                 Assets_Under_Management_AUM__c, Specialization__c, Status__c 
                                 FROM Advisor__c WHERE New_Account__c = :accountId];
    System.debug('Advisors fetched: ' + advisors);
    return advisors;
}

}