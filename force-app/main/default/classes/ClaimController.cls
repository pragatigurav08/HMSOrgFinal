/**
* @File Name : ClaimController.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : December 12, 2024
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | December 12, 2024 |   | Initial Version
**/
public with sharing class ClaimController {
    @AuraEnabled
     public static Insurance_Policy__c getpolicydetails(Id recordId) {
        try {
            // Fetch the account details based on the record ID
            return [
                SELECT Id, First_Name__c, Last_Name__c, Gender__c,Phone_No__c,Customer_Name__c
                FROM Insurance_Policy__c 
                WHERE Id = :recordId 
                LIMIT 1
            ];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching account details: ' + e.getMessage());
        }
    }
    @AuraEnabled
     public static New_Account__c getaddress(Id AccId) {
        try {
            // Fetch the account details based on the record ID
            return [
                SELECT Id,DateOfBirth__c,PANCardNo__c,Home_Branch__c,Aadhar_Number__c,Country__c,State__c,City__c,PinCode__c,CommunicationResidentAddress__c
                FROM New_Account__c 
                WHERE Id = :AccId 
                LIMIT 1
            ];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching account details: ' + e.getMessage());
        }
    }
    
    @AuraEnabled
    public static List<Beneficiary__c> searchBeneficiaries(String recId) {
        try {
            // Fetch beneficiaries linked to a specific insurance policy
            return [SELECT Id, Name,Date_of_Birth__c, Aadhar_Number__c, Gender__c FROM Beneficiary__c WHERE Insurance_Policy__c = :recId LIMIT 10];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching beneficiaries: ' + e.getMessage());
        }
    }
    
   @AuraEnabled
public static Beneficiary__c getBeneficiaryDetails(String benId) {
    try {
        Beneficiary__c beneficiary = [
            SELECT Id, Name, Date_of_Birth__c, Aadhar_Number__c, Gender__c
            FROM Beneficiary__c 
            WHERE Id = :benId LIMIT 1
        ];
        System.debug('Fetched Beneficiary Details: ' + beneficiary);
        return beneficiary;
    } catch (Exception e) {
        throw new AuraHandledException('Error fetching beneficiary details: ' + e.getMessage());
    }
}

  @AuraEnabled
public static Id saveClaimRecord(String InsurancePolicy, Id RecordTypeId, String pName, String plastName, String pMobileno, 
                                 String pgender, String pPanno, Date pDobno, String pAdd, String pcity, String pstate, 
                                 String pcountry, String ppincode, Id policyBeneficiary, String bname, String bgender, 
                                 String baadharno, Date bdob, String claimDetails, String hospitalsName, DateTime admissionDate,
                                 DateTime dischargeDate, String selectedDocuments,
                                 String handleOtherInputChange,Decimal AmountToClaim) {
    try {
       

        // Create a new Claim record
        Claim__c newClaim = new Claim__c();
        
        newClaim.Insurance_Policy__c = InsurancePolicy;
        newClaim.RecordTypeId = RecordTypeId;
        newClaim.Name__c = pName;
        newClaim.Last_Name__c = plastName;
        newClaim.mobile_number__c = pMobileno;
        newClaim.Gender__c = pgender;
        newClaim.PanNumber__c = pPanno;
        newClaim.Date_of_Birth__c = pDobno;
        newClaim.Address__c = pAdd;
        newClaim.City__c = pcity;
        newClaim.State__c = pstate;
        newClaim.Country__c = pcountry;
        newClaim.Beneficiary__c = policyBeneficiary;
        newClaim.Name_B__c = bname;
        newClaim.LastName_B__c = bgender;
        newClaim.Aadhar_Number_B__c = baadharno;
        newClaim.Date_of_Birth_B__c = bdob;
        newClaim.Claim_Details__c = claimDetails;
        newClaim.Name_of_Hospital__c = hospitalsName;
        newClaim.Claim_Documents_Submitted__c = selectedDocuments;
        //newClaim.Hospitalization_due_to__c=selectedHospitalizationReason;
        newClaim.Date_of_Admission__c = admissionDate;
        newClaim.Date_of_Discharge__c =dischargeDate;
        newClaim.Amount_To_Claim__c=AmountToClaim;
        try {
         newClaim.pincode__c = (Integer) Integer.valueOf(ppincode);
        } catch (Exception e) {
           throw new AuraHandledException('Invalid pincode: ' + e.getMessage());
            }

        // Insert the claim record
        insert newClaim;
        
        // Return the ID of the newly created claim
        return newClaim.Id;

    } catch (Exception e) {
        throw new AuraHandledException('Error saving claim record: ' + e.getMessage());
    }
}


}