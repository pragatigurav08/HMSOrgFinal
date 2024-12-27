public with sharing class PropertyInsuranceFormComtroller {
//           @AuraEnabled
// public static Id CreatePropertyInsurance(Loan__c PropertyInsuranceRecords) {
//     System.debug('LoanRecordss: ' + PropertyInsuranceRecords);
//     try {
//         // Set the Record Type Id for 'Personal Loan'
//         String personalLoanRecordTypeId = '012dM000003QMZRQA4';
//         PropertyInsuranceRecords.RecordTypeId = personalLoanRecordTypeId;

//         // Insert the loan record
//         insert PropertyInsuranceRecords;

//         return PropertyInsuranceRecords.Id;
//     } catch (Exception e) {
//         throw new AuraHandledException('Error while creating Health Insurance record: ' + e.getMessage());
//     }
// }

    @AuraEnabled
    public static void savePolicyData(
        Id newAccountId,
        String firstName, 
        String lastName, 
        String customerEmail, 
        String phoneNo, 
        String gender, 
        String nominee, 
        String policyBeneficiary, 
        Decimal policyPremiumAmount, 
        Decimal coverageAmount, 
        String status, 
        String paymentFrequency, 
        String underwritingStatus, 
        Date policyStartDate, 
        Date policyEndDate, 
        Boolean claimable, 
        String propertyType,
        String propertyAddress, 
        Date yearOfConstruction, 
        Decimal reconstructionCost, 
        Decimal liabilityCoverage, 
        Boolean naturalDisasterCoverage, 
        Boolean fireCoverage, 
        Boolean floodCoverage
    ) {
        try {
            String personalLoanRecordTypeId = '012J400000008cGIAQ';
            // Create a new record for the Insurance Policy
            Insurance_Policy__c policy = new Insurance_Policy__c();
            policy.First_Name__c = firstName;
            policy.Last_Name__c = lastName;
            policy.Customer_Email__c = customerEmail;
            policy.Phone_No__c = phoneNo;
            policy.Gender__c = gender;
            policy.Nominee__c = nominee;
            policy.Policy_Beneficiary__c = policyBeneficiary;
            policy.Policy_Premium_Amount__c = policyPremiumAmount;
            policy.Coverage_Amount__c = coverageAmount;
            policy.Status__c = status;
            policy.Payment_Frequency__c = paymentFrequency;
            policy.Underwriting_Status__c = underwritingStatus;
            policy.Policy_Start_Date__c = policyStartDate;
            policy.Policy_End_Date__c = policyEndDate;
            policy.Claimable__c = claimable;
            policy.Property_Type__c = propertyType;
            policy.Property_Address__c = propertyAddress;
            policy.Year_of_Construction__c = yearOfConstruction;
            policy.Reconstruction_Cost__c = reconstructionCost;
            policy.Liability_Coverage__c = liabilityCoverage;
            policy.Natural_Disaster_Coverage__c = naturalDisasterCoverage;
            policy.Fire_Coverage__c = fireCoverage;
            policy.Flood_Coverage__c = floodCoverage;
            policy.Customer_Name__c = newAccountId;
            policy.RecordTypeId=personalLoanRecordTypeId;//

            // Insert the policy record into the database
            insert policy;
        } catch (Exception e) {
            // Handle exceptions
            throw new AuraHandledException('Error saving policy data: ' + e.getMessage());
        }
    }
}