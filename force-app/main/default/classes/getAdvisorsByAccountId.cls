/**
* @File Name : getAdvisorsByAccountId.cls
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

public class getAdvisorsByAccountId {
	@AuraEnabled
public static List<Advisor__c> getAdvisorsByAccountId(Id accountId) {
    return [SELECT Id, 
       Advisor_Name__c, 
       Phone_Number__c, 
       Email_Address__c, 
       Experience_Level__c, 
       License_Number__c, 
       Status__c, 
	   	Specialization__c,
       Assets_Under_Management_AUM__c, 
       New_Account__r.FirstName__c 
FROM Advisor__c 
WHERE New_Account__c = :accountId
];
}

}