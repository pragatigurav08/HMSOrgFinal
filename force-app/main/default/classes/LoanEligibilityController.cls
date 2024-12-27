public with sharing class LoanEligibilityController {
    
    @AuraEnabled(cacheable=true)
    public static Decimal getAnnualIncome(String accountId) {
         New_Account__c acc = [SELECT Name, FirstName__c, Annual_Income__c FROM New_Account__c WHERE Name = :accountId LIMIT 1];
        return acc.Annual_Income__c;
    }
    
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getCustomerData(String accountIds) {
        //System.debug('Print account id inside get customer data :::'+ accountIds);
        // Initialize the result map to hold the customer data
        Map<String, Object> result = new Map<String, Object>();

        try {
            // Query Account based on Account ID (you can add more fields as needed)
            New_Account__c accountRecord = [SELECT Id, Name, Annual_Income__c FROM New_Account__c WHERE Name = :accountIds LIMIT 1];
			System.debug('Print account id inside get customer data :::'+ accountRecord.Name);
            System.debug('Print annual income inside get customer data :::'+ accountRecord.Annual_Income__c);

            // Check if account exists and populate the result map
            if (accountRecord != null) {
                result.put('accountId', accountRecord.Id);
                System.debug('Print account id inside get customer data :::'+ accountRecord.Id);
			    result.put('annualIncome', accountRecord.Annual_Income__c); // Custom field for annual income
                System.debug('Print annual income inside get customer data :::'+ accountRecord.Annual_Income__c);

            }
        } catch (Exception e) {
            // Handle any errors (e.g., no records found)
            result.put('error', 'No customer data found or an error occurred: ' + e.getMessage());
        }

        return result;  // Return the result map with customer details
    }
    
    @AuraEnabled
    public static Map<String, Object> checkLoanEligibility(String accountId, Decimal loanAmount) {
        System.debug('Getting accound id and loan amout successfully ::: ');
        system.debug('Account id is ::: '+ accountId);
        system.debug('Loan amount is ::: '+ loanAmount);

           List<New_Account__c> accList = [SELECT Name,Annual_Income__c FROM New_Account__c WHERE Name = :accountId LIMIT 1];

 if (accList.isEmpty()) {
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


    //     // New_Account__c acc = [SELECT Annual_Income__c FROM  New_Account__c WHERE Name = :accountId LIMIT 1];
    //         List<New_Account__c> accList = [SELECT Annual_Income__c FROM New_Account__c WHERE Name = :accountId LIMIT 1];

    //           New_Account__c acc = accList;
    // System.debug('Annual income is ::: ' + accList.Annual_Income__c);
    // Decimal annualIncome = accList.Annual_Income__c;

    //     //  System.debug('annaul income is ::: '+ acc.Annual_Income__c);
    //     // Decimal annualIncome = acc.Annual_Income__c;

   
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
}