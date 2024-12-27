public with sharing class WealthManagementController {
    
    @AuraEnabled
   public static List<New_Account__c> getAccountByAccountNumber(String accountNumber) {
    return [SELECT Id, Name, PANCardNo__c, Total_Deposit_Amount__c, Annual_Income__c, 
            FirstName__c, Last_Name__c, Phone_number__c, Type_Of_Deposits__c, Interest_Rate__c, Amount__c
            FROM New_Account__c
            WHERE Name = :accountNumber]; // Assuming Name field is the account number
}

}