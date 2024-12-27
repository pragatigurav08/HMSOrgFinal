public class LoanDetails {
     @AuraEnabled(cacheable=true)
    public static List<Loan__c> getLoanDetailsByWealthManagement(Id wealthManagementId) {
        System.debug('Fetching Wealth Management record with ID: ' + wealthManagementId);

        // Step 1: Fetch the related New_Account__c ID from Wealth_Management__c
        Wealth_Management__c wmRecord = [
            SELECT New_Account__c 
            FROM Wealth_Management__c 
            WHERE Id = :wealthManagementId 
            LIMIT 1
        ];

        System.debug('Fetched Wealth Management record: ' + wmRecord);

        // Check if the Wealth Management record exists and New_Account__c is populated
        if (wmRecord != null && wmRecord.New_Account__c != null) {
            System.debug('New Account ID associated with Wealth Management: ' + wmRecord.New_Account__c);

            // Step 2: Fetch Loan records related to the New_Account__c
            List<Loan__c> loanDetails = [
                SELECT Id, Name, Loan_Amount__c, New_Account__c, Borrower_s_Name__c, EMI_Amount__c, Interest_Rate__c, 
                       Loan_Purpose__c, New_Account__r.Name, New_Account__r.FirstName__c, New_Account__r.Last_Name__c, 
                       Types_Of_Loans__c, RecordType.Name
                FROM Loan__c 
                WHERE New_Account__c = :wmRecord.New_Account__c
            ];

            System.debug('Fetched Loan Details: ' + loanDetails);

            // Return the loan records
            return loanDetails;
        } else {
            // If no New_Account__c is found
            System.debug('No New Account associated with Wealth Management ID: ' + wealthManagementId);
            return new List<Loan__c>(); // Return empty list if no New_Account__c is found
        }
    }

}