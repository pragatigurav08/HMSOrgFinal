public with sharing class DisabilityInsurancePolicyController {

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
        String disabilityType, 
        String benefitPeriod, 
        Decimal incomeReplacementPercentage, 
        Boolean residualBenefits, 
        Decimal waitingPeriod, 
        String occupationClass, 
        Decimal maxMonthlyBenefit, 
        Boolean ownOccupationCoverage
    ) {
        try {
            String personalLoanRecordTypeId = '012J400000008d4IAA';
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
            policy.Customer_Name__c = newAccountId;

            // New fields related to disability policy
            policy.Disability_Type__c = disabilityType;
            policy.Benefit_Period__c = benefitPeriod;
            policy.Income_Replacement_Percentage__c = incomeReplacementPercentage;
            policy.Residual_Benefits__c = residualBenefits;
            policy.Waiting_Period__c = waitingPeriod;
            policy.Occupation_Class__c = occupationClass;
            policy.Maximum_Monthly_Benefit__c = maxMonthlyBenefit;
            policy.Own_Occupation_Coverage__c = ownOccupationCoverage;
            policy.RecordTypeId=personalLoanRecordTypeId;//


            // Insert the policy record into the database
            insert policy;
        } catch (Exception e) {
            // Handle exceptions
            throw new AuraHandledException('Error saving policy data: ' + e.getMessage());
        }
    }
}