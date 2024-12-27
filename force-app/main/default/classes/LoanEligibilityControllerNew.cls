public with sharing class LoanEligibilityControllerNew {
    
   
    @AuraEnabled
    public static Map<String, Object> checkLoanEligibility(String accountId, Decimal loanAmount) {
        System.debug('Getting accound id and loan amout successfully ::: ');
        system.debug('Account id is ::: '+ accountId);
        system.debug('Loan amount is ::: '+ loanAmount);

           List<New_Account__c> accList = [SELECT Name,Annual_Income__c FROM New_Account__c WHERE Name = :accountId LIMIT 1];
        System.debug('Query result: ' + accList);

 if (accList == null || accList.isEmpty()) {
    System.debug('No account found with the given ID');
    // Return a message indicating no record was found
    return new Map<String, Object>{
        'success' => false,
        'message' => 'No account found with the given ID'
    };
} 

    // Get the first record from the list
    New_Account__c acc = accList[0];
    System.debug('Annual income is ::: ' + acc.Annual_Income__c);
    Decimal annualIncome = acc.Annual_Income__c;

    if (annualIncome != null) {
        System.debug('Annual income after fetching ::: ' + annualIncome);
    } else {
        System.debug('Annual income is null');
    }
     Map<String, Object> result = new Map<String, Object>();
        System.debug('result mein annual income :::'+annualIncome);
        result.put('annualIncome', annualIncome);

        if (annualIncome == null || annualIncome < 600000) {
    System.debug('Annual income is less than 6 Lakhs');
    if (loanAmount >= 100000 && loanAmount <= 300000) {
        System.debug('Annual income is less than 6 Lakhs and loan between 1 and 3 Lakhs');
        result.put('eligible', true);
        result.put('interestRate', 5);
    } else {
        System.debug('Customer with less than ₹6,00,000 income is eligible only for loans between ₹1,00,000 to ₹3,00,000.');
        result.put('Not eligible', false);
        result.put('message', 'Customer with less than ₹6,00,000 income is eligible only for loans between ₹1,00,000 to ₹3,00,000.');
    }
} else {
    System.debug('Annual income is greater than 6 Lakhs');
    if (loanAmount > 100000 && loanAmount <= 400000) {
        result.put('eligible', true);
        result.put('interestRate', 5);
    } else if (loanAmount > 400000 && loanAmount <= 800000) {
        result.put('eligible', true);
        result.put('interestRate', 8);
    } else if (loanAmount > 800000 && loanAmount <= 1400000) {
        result.put('eligible', true);
        result.put('interestRate', 12);
    } else if (loanAmount > 1400000) {
        result.put('eligible', true);
        result.put('interestRate', 15);
    } else {
        result.put('eligible', false);
        result.put('message', 'Loan amount is below the minimum ₹1,00,000.');
    }
    }

        return result;
    }
     @AuraEnabled
            public static String savePersonalLoan(PersonalLoanFormWrapper wrapper) {

                     try {
            // Create a new Loan object record
            Loan__c loan = new Loan__c();

            // Map data from the wrapper to the Loan fields
            loan.Borrower_s_Name__c = wrapper.borrowerName;
            loan.EmailAddress__c = wrapper.emailaddress;
            loan.Phone_number__c = wrapper.phoneNumber;
            loan.Date_Of_Birth__c = wrapper.dob;
            loan.Nationality__c = wrapper.nationality;
            loan.Residential_Address__c = wrapper.address;
            loan.Marital__c = wrapper.maritail;
            loan.Occupation__c = wrapper.occupation;
            loan.Loan_Amount__c = wrapper.loanamount;
            loan.Loan_Purpose__c = wrapper.loanpurpose;
            loan.Loan_Term_Months__c = wrapper.loantenure;
            loan.Annual_Income__c = wrapper.income;

            // Save the record to the database
            insert loan;

            // Return the ID of the newly created Loan record
            return loan.Id;
        } catch (Exception e) {
            throw new AuraHandledException('Error saving loan application: ' + e.getMessage());
        }
    }
    public class PersonalLoanFormWrapper {
    @AuraEnabled public String searchKey;
    @AuraEnabled public String borrowerName;
    @AuraEnabled public String emailaddress;
    @AuraEnabled public String phoneNumber;
    @AuraEnabled public Date dob;
    @AuraEnabled public String nationality;
    @AuraEnabled public String address;
    @AuraEnabled public String maritail; // Marital status
    @AuraEnabled public String occupation;
    @AuraEnabled public List<String> selectedIdProofs; // Identity and address proof
    @AuraEnabled public Decimal loanamount;
    @AuraEnabled public String loanpurpose;
    @AuraEnabled public Integer loantenure;
    @AuraEnabled public Decimal income;

    // Constructor
    public PersonalLoanFormWrapper() {}
}

}