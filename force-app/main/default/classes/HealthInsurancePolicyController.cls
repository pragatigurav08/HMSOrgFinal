public with sharing class HealthInsurancePolicyController {
   @AuraEnabled
public static Id savePolicyData(
    Id newAccountId,
    String firstName, 
    String lastName, 
    String customerEmail, 
    String phoneNo, 
    String gender, 
    String nominee, 
    String policyBeneficiary, 
    Decimal policyPremiumAmount, 
    Decimal covetrageamt, 
    String status, 
    String paymentFrequency, 
    String underwritingStatus, 
    Date policyStartDate, 
    Date policyEndDate, 
    Boolean claimable, 
    Decimal coPayPercentage,
    String criticalIllnessCovered, 
    Boolean preExistingConditionsCoverage, 
    Boolean opdCoverage
) {
    try {
        String personalLoanRecordTypeId = '012J400000008cuIAA';
        
        // Create a new record for the Health Insurance Policy
        Insurance_Policy__c policy = new Insurance_Policy__c();
        policy.First_Name__c = firstName;
        policy.Last_Name__c = lastName;
        policy.Customer_Email__c = customerEmail;
        policy.Phone_No__c = phoneNo;
        policy.Gender__c = gender;
        policy.Nominee__c = nominee;
        policy.Policy_Beneficiary__c = policyBeneficiary;
        policy.Policy_Premium_Amount__c = policyPremiumAmount;
        policy.Coverage_Amount__c = covetrageamt;
        policy.Status__c = status;
        policy.Payment_Frequency__c = paymentFrequency;
        policy.Underwriting_Status__c = underwritingStatus;
        policy.Policy_Start_Date__c = policyStartDate;
        policy.Policy_End_Date__c = policyEndDate;
        policy.Claimable__c = claimable;
        policy.Critical_Illness_Covered__c = criticalIllnessCovered;
        policy.Pre_Existing_Conditions_Coverage__c = preExistingConditionsCoverage;
        policy.OPD_Coverage__c = opdCoverage;
        policy.Co_Pay_Percentage__c = coPayPercentage;
        policy.Customer_Name__c = newAccountId;
        policy.RecordTypeId = personalLoanRecordTypeId;

        // Insert the policy record into the database
        insert policy;

        // Return the inserted record's Id
        return policy.Id;
    } catch (Exception e) {
        // Handle exceptions
        throw new AuraHandledException('Error saving policy data: ' + e.getMessage());
    }
}

 @AuraEnabled
public static Id SaveBeneficiary(
    Id newAccountId,
    String firstName,
    String Dob,
    Id policyId,
    String AadharNo
) {
    try {
        Beneficiary__c beneficiary = new Beneficiary__c();
        beneficiary.Name= firstName;
        beneficiary.Account__c = newAccountId;
        beneficiary.Insurance_Policy__c = policyId;
        beneficiary.Aadhar_Number__c=AadharNo;
       // beneficiary.Gender__c=
        beneficiary.Date_of_Birth__c=Date.valueOf(Dob);
        // Insert the policy record into the database
        insert beneficiary;

        // Return the inserted record's Id
        return beneficiary.Id;
    } catch (Exception e) {
        // Handle exceptions
        throw new AuraHandledException('Error saving beneficiary data: ' + e.getMessage());
    }
}


}