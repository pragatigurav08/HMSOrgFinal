public class VehicleInsuranceForm {

//           @AuraEnabled
// public static Id CreatVehicleInsurance(Loan__c VehicleInsuranceRecords) {
//     System.debug('LoanRecordss: ' + VehicleInsuranceRecords);
//     try {
//         // Set the Record Type Id for 'Personal Loan'
//         String personalLoanRecordTypeId = '012dM000003QMWDQA4';
//         VehicleInsuranceRecords.RecordTypeId = personalLoanRecordTypeId;

//         // Insert the loan record
//         insert VehicleInsuranceRecords;

//         return VehicleInsuranceRecords.Id;
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

    String vin,                         // New Field
    Decimal liabilityCoverage,          // New Field
    String vehicleMakeModel,            // New Field
    Integer yearOfManufacture,          // New Field
    Boolean personalInjuryProtection,   // New Field
    Boolean roadsideAssistance,         // New Field
    Decimal vehicleValue,               // New Field
    Boolean noClaimBonus,               // New Field
    String coverageType                 // New Field
    ) {
    try {
        String personalLoanRecordTypeId = '012J400000008bwIAA';
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
        policy.Coverage_Amount__c = coverageAmount;
        policy.Status__c = status;
        policy.Payment_Frequency__c = paymentFrequency;
        policy.Underwriting_Status__c = underwritingStatus;
        policy.Policy_Start_Date__c = policyStartDate;
        policy.Policy_End_Date__c = policyEndDate;
        policy.Claimable__c = claimable;
        policy.Customer_Name__c = newAccountId;

        // New fields for vehicle-related coverage
        policy.Vehicle_Identification_Number_VIN__c = vin; // Assuming field API name is VIN__c
        policy.Liability_Coverage__c = liabilityCoverage;
        policy.Vehicle_Make_and_Model__c = vehicleMakeModel;
        policy.Year_of_Manufacture__c = Date.newInstance(yearOfManufacture, 1, 1);
        policy.Personal_Injury_Protection__c = personalInjuryProtection;
        policy.Roadside_Assistance__c = roadsideAssistance;
        policy.Vehicle_Value__c = vehicleValue;
        policy.No_Claim_Bonus__c = noClaimBonus;
        policy.Coverage_Types__c = coverageType;
        policy.RecordTypeId=personalLoanRecordTypeId;//


        // Insert the policy record into the database
        insert policy;
    } catch (Exception e) {
        // Handle exceptions
        throw new AuraHandledException('Error saving policy data: ' + e.getMessage());
    }
}

}