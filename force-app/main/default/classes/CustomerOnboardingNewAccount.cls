/**
* @File Name : CustomerOnboardingNewAccount.cls
* @Description :
* @Author :Tripura
* @Last Modified By :
* @Last Modified On : October 13, 2024
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | October 13, 2024 |   | Initial Version
**/

    public class CustomerOnboardingNewAccount {
        @AuraEnabled
        Public static Id Createnewaccount(New_Account__c   newaccount){
            System.debug('Customeronboardingnewaccounts>>>>>>>>>>>>');
            try {
                insert newaccount;
                System.debug('Inserted account ID: ' + newaccount.Id);
                return newaccount.Id;
                
            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
        }

    @AuraEnabled
    public static void uploadFile(String base64Data, String fileName, Id recordId) {
        try {
            ContentVersion contentVersion = new ContentVersion();
            contentVersion.Title = fileName;
            contentVersion.PathOnClient = '/' + fileName;
            contentVersion.VersionData = EncodingUtil.base64Decode(base64Data);
            contentVersion.FirstPublishLocationId = recordId; // Link to the newly created record

            insert contentVersion;

            System.debug('File uploaded successfully for record: ' + recordId);
        } catch (Exception e) {
            throw new AuraHandledException('File upload failed: ' + e.getMessage());
        }
    }
    //  @AuraEnabled(cacheable=true)
    // public static List<String> getAccountRecordTypes() {
    //     List<String> recordTypeNames = new List<String>();
    //     try {
    //         // Get the Account object record types
    //         List<RecordType> recordTypes = [SELECT Name FROM RecordType WHERE SObjectType = 'New_Account__c'];
    //         for (RecordType rt : recordTypes) {
    //             recordTypeNames.add(rt.Name);
    //         }
    //     } catch (Exception e) {
    //         throw new AuraHandledException('Error fetching record types: ' + e.getMessage());
    //     }
    //     return recordTypeNames;
    // }
    //  @AuraEnabled(cacheable=true)
    // public static Boolean checkIfAccountExists(String PhoneNumber, String recordTypeId) {
    //     List<New_Account__c> existingAccounts = [SELECT RecordTypeId,Phone_number__c FROM New_Account__c WHERE Phone_number__c=:PhoneNumber AND RecordTypeId = :recordTypeId LIMIT 1];
    //     return !existingAccounts.isEmpty(); // If list is not empty, account already exists
    // }
    @AuraEnabled
public static Boolean checkDuplicateAccount(String Pancardno, String recordTypeId) {
    try {
        // Query logic to find duplicate accounts
        List<New_Account__c> duplicates = [SELECT RecordTypeId,Phone_number__c,PANCardNo__c FROM New_Account__c WHERE  PANCardNo__c = :Pancardno AND RecordTypeId = :recordTypeId LIMIT 1];
        return !duplicates.isEmpty();
    } catch (Exception e) {
        throw new AuraHandledException('Error checking duplicate accounts: ' + e.getMessage());
    }
}

   @AuraEnabled(cacheable=true)
public static List<RecordType> getAccountRecordTypes() {
    return [SELECT Id, Name FROM RecordType WHERE SObjectType = 'New_Account__c' AND IsActive = TRUE];
}

    @AuraEnabled(cacheable=true)
    public static List<New_Account__c> searchAccounts(String searchTerm) {
        return [SELECT Id, Name FROM New_Account__c WHERE Name LIKE :('%' + searchTerm + '%') LIMIT 10];
    }

    

 @AuraEnabled
    public static void createJointApplicants(List<JointApplicantWrapper>jointApplicants , Id accountId) {
        System.debug('Joint Applicants Received: ' + jointApplicants);
        System.debug('Joint Applicants: ' + JSON.serialize(jointApplicants));
        List<Joint_Applicants__c> jointApplicantsToInsert = new List<Joint_Applicants__c>();

        // Loop through the joint applicants and create records
        for (JointApplicantWrapper applicant : jointApplicants) {
              Joint_Applicants__c jointApp = new Joint_Applicants__c(
                Account__c = accountId, // Associate with the newly created Account
                Name = applicant.name,  // Joint applicant name
                Phone_number__c = applicant.phone // Joint applicant phone number
            );
          
            jointApplicantsToInsert.add(jointApp);
        }

        try {
             
            insert jointApplicantsToInsert;
             system.debug(jointApplicantsToInsert);
        } catch (DmlException e) {
            System.debug('Error inserting Joint_Applicants__c records: ' + e.getMessage());
            throw new AuraHandledException('Error creating joint applicants: ' + e.getMessage());
        }
    }


    // public class JointApplicantWrapper {
    //     @AuraEnabled public String name;
    //     @AuraEnabled public String phone;
    // }
//     @AuraEnabled
// public static void createJointApplicants(String jointApplicantsJson, Id accountId) {
//     System.debug('Received JSON: ' + jointApplicantsJson);

//     // Deserialize JSON to a list of JointApplicantWrapper objects
//     List<JointApplicantWrapper> jointApplicants;
//     try {
//         jointApplicants = (List<JointApplicantWrapper>) JSON.deserialize(jointApplicantsJson, List<JointApplicantWrapper>.class);
//     } catch (Exception e) {
//         throw new AuraHandledException('Invalid JSON structure: ' + e.getMessage());
//     }

//     System.debug('Deserialized Joint Applicants: ' + jointApplicants);

//     List<Joint_Applicants__c> jointApplicantsToInsert = new List<Joint_Applicants__c>();

//     for (JointApplicantWrapper applicant : jointApplicants) {
//         Joint_Applicants__c jointApp = new Joint_Applicants__c(
//             Account__c = accountId,
//             Name = applicant.name,
//             Phone_number__c = applicant.phone
//         );
//         jointApplicantsToInsert.add(jointApp);
//     }

//     try {
//         insert jointApplicantsToInsert;
//         System.debug('Inserted Joint Applicants: ' + jointApplicantsToInsert);
//     } catch (DmlException e) {
//         throw new AuraHandledException('Error creating joint applicants: ' + e.getMessage());
//     }
// }


public class JointApplicantWrapper {
    @AuraEnabled public String name{get;set;}
    @AuraEnabled public String phone{get;set;}
}

}