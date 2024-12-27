public class LoanDisplayController {
   @AuraEnabled
    public static Loan__c getLoanDetails(Id loanId) {
        try {
            // Query the Loan__c record with all required fields
            Loan__c loanRecord = [
                SELECT Id, Name, New_Account__r.Name, Borrower_s_Name__c, EmailAddress__c, Phone_number__c, 
                       Date_Of_Birth__c, Nationality__c, Residential_Address__c, Marital__c, Occupation__c, 
                       Loan_Amount__c, Loan_Purpose__c, Loan_Term_Months__c, Annual_Income__c, 
                       Uploaded_Documents__c, Loan_Type__c
                FROM Loan__c
                WHERE Id = :loanId
                LIMIT 1
            ];

            return loanRecord;
        } catch (Exception ex) {
            // Log the error for debugging purposes
            System.debug('Error retrieving loan details: ' + ex.getMessage());
            throw new AuraHandledException('Unable to fetch loan details.');
        }
    }
}