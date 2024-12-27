public class calculateLoan {
    @AuraEnabled(cacheable=true)
    public static List<Loan__c> getLoanDetailsByWealthManagement(Id wealthManagementId) {
        List<Wealth_Management__c> wmRecords = [
            SELECT New_Account__c 
            FROM Wealth_Management__c 
            WHERE Id = :wealthManagementId 
            LIMIT 1
        ];

        if (!wmRecords.isEmpty() && wmRecords[0].New_Account__c != null) {
            Wealth_Management__c wmRecord = wmRecords[0];

            // Fetch related Loan__c records
            List<Loan__c> loanDetails = [
                SELECT Id, Name, Loan_Amount__c, Interest_Rate__c, 
                       Borrower_s_Name__c, Loan_Purpose__c, New_Account__r.Name, 
                       Types_Of_Loans__c, RecordType.Name
                FROM Loan__c 
                WHERE New_Account__c = :wmRecord.New_Account__c
            ];

            return loanDetails;
        } else {
            return new List<Loan__c>();
        }
    }
}