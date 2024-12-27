public with sharing class InsuranceDetailsController {

//       @AuraEnabled
// public static Id CreatenewLifeInsurance(Loan__c NewLifeRecords) {
//     System.debug('LoanRecordss: ' + NewLifeRecords);
//     try {
//         // Set the Record Type Id for 'Personal Loan'
//         String personalLoanRecordTypeId = '012dM000003QMSzQAO';
//         NewLifeRecords.RecordTypeId = personalLoanRecordTypeId;

//         // Insert the loan record
//         insert NewLifeRecords;

//         return NewLifeRecords.Id;
//     } catch (Exception e) {
//         throw new AuraHandledException('Error while creating Life Insurace record: ' + e.getMessage());
//     }
// }
    @AuraEnabled
    public static void saveInsuranceDetails(
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
        String PremiumPaymentMode,      // Added field
        Integer PolicyTerm,             // Added field
        Decimal SumAssured,             // Added field
        Date MaturityDate,              // Added field
        Boolean CriticalIllnessRider,   // Added field
        Boolean AccidentalDeathBenefit, // Added field
        Boolean HealthCheckRequired     // Added field
    ) {
        try {
            String personalLoanRecordTypeId = '012J400000008cVIAQ';
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
            
            // Additional fields
            policy.Premium_Payment_Mode__c = PremiumPaymentMode;
            policy.Policy_Term__c = PolicyTerm;
            policy.Sum_Assured__c = SumAssured;
            policy.Maturity_Date__c = MaturityDate;
            policy.Critical_Illness_Rider__c = CriticalIllnessRider;
            policy.Accidental_Death_Benefit__c = AccidentalDeathBenefit;
            policy.Health_Check_Required__c = HealthCheckRequired;
            policy.RecordTypeId=personalLoanRecordTypeId;//


            insert policy;
        } catch (Exception e) {
            // Handle exceptions
            throw new AuraHandledException('Error saving policy data: ' + e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getRecordTypes(String objectApiName) {
        List<Map<String, String>> recordTypeOptions = new List<Map<String, String>>();
        
        // Get the record types for the specified object
        for (RecordType rt : [SELECT Id, Name FROM RecordType WHERE SObjectType = :objectApiName AND IsActive = true]) {
            Map<String, String> recordTypeMap = new Map<String, String>();
            recordTypeMap.put('label', rt.Name);
            recordTypeMap.put('value', rt.Id);
            recordTypeOptions.add(recordTypeMap);
        }
        
        return recordTypeOptions;
    }
}