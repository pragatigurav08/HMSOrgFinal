public with sharing class InsuranceBannerComponent {
    @AuraEnabled(cacheable=true)
    public static List<New_Account__c> searchAccounts(String searchTerm) {
        return [SELECT Id, Name FROM New_Account__c WHERE Name LIKE :('%' + searchTerm + '%') LIMIT 10];
    }
    // @AuraEnabled(cacheable=true)
    // public static List<RecordType> getInsuranceRecordTypes() {
    //     List<RecordType> recordTypes = [SELECT Id, Name FROM RecordType WHERE SObjectType = 'Insurance_Policy__c'];
    //     return recordTypes;
    // }

    @AuraEnabled(cacheable=true)
     public static List<RecordType> getInsuranceRecordTypes() {
       return [SELECT Id, Name FROM RecordType WHERE SObjectType = 'Insurance_Policy__c' AND IsActive = TRUE];

}
// @AuraEnabled
// public static Id createRecord(Map<String, Object> fields) {
//     Insurance_Policy__c newRecord = new Insurance_Policy__c(); // Replace with your actual object API name

//     // Loop through the map and set fields dynamically
//     for (String fieldName : fields.keySet()) {
//         newRecord.put(fieldName, fields.get(fieldName)); // Use the put method
//     }

//     insert newRecord; // Insert the record
//     return newRecord.Id; // Return the created record ID
// }

@AuraEnabled
public static AccountDetailsWrapper getAccountDetails(Id accountId) {
    New_Account__c account = [SELECT Id, FirstName__c, Last_Name__c, DateOfBirth__c, Phone_number__c, Nationality__c, Home_Branch__r.Name, TotalAmountDepo__c, 
                Total_Balance__c, Father_sName__c, Mother_sName__c, Gender__c, MaritalStatus__c, Name, 
                PANCardNo__c,Aadhar_Number__c, Document_Verification_Status__c, Open_Date__c, Mode_Of_Operation__c, Mode_Of_Payment__c, Total_Deposit_Amount__c, 
                IFSC_Code__c, X1st_Joint_Application_Name__c, X2nd_Joint_Application_Name__c, 
                X3rd_Joint_Application_Name__c, Status__c, Annual_Income__c, Country__c, State__c, City__c, PinCode__c, Landmark__c, 
                CommunicationResidentAddress__c, Same_as_Resident_Address__c, Country_P__c, State_P__c, City_P__c, Landmark_P__c, PinCode_P__c, 
                Permanent_Address__c,UploadedFile__c FROM New_Account__c WHERE Id = :accountId];
    Integer insuranceCount = [SELECT COUNT() FROM Insurance_Policy__c WHERE Customer_Name__r.Id = :accountId];

    return new AccountDetailsWrapper(account, insuranceCount);
}

public class AccountDetailsWrapper {
    @AuraEnabled public New_Account__c account { get; set; }
    @AuraEnabled public Integer totalInsurances { get; set; }

    public AccountDetailsWrapper(New_Account__c acc, Integer count) {
        this.account = acc;
        this.totalInsurances = count;
    }
}


}