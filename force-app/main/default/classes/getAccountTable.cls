public class getAccountTable {


    @AuraEnabled(cacheable=true)
    public static List<New_Account__c> searchAccounts(String searchText) {
        return [
            SELECT Name, Open_Date__c, Status__c, IFSC_Code__c, Total_Deposit_Amount__c, 
                   Annual_Income__c, Interest_Rate__c, Amount__c, Amount_In_Words__c, 
                   X1st_Joint_Application_Name__c, X2nd_Joint_Application_Name__c, 
                   X3rd_Joint_Application_Name__c, Mode_Of_Operation__c, 
                   Mode_Of_Payment__c, Document_Verification_Status__c, 
                   Credit_Card__c, Debit_Card__c, 
                   FirstName__c, Father_sName__c, Last_Name__c, 
                   Mother_sName__c, DateOfBirth__c, Mother_sMaidenName__c, 
                   Phone_number__c, Gender__c, Nationality__c, MaritalStatus__c,
                   Total_Balance__c, UploadedFile__c,Monthly_Income__c
            FROM New_Account__c
            WHERE Name LIKE :('%' + searchText + '%')
        ];
    }
     public class LoanSummary {
        @AuraEnabled public Decimal totalLoanAmount;
        @AuraEnabled public Decimal totalAmountToBeRepaid;
        @AuraEnabled public List<Loan__c> loans;
    }

    @AuraEnabled(cacheable=true)
    public static LoanSummary getLoanSummary(String accountId) {
        LoanSummary summary = new LoanSummary();

        // Validate input
        if (String.isEmpty(accountId)) {
            summary.loans = new List<Loan__c>();
            summary.totalLoanAmount = 0;
            summary.totalAmountToBeRepaid = 0;
            return summary;
        }

        // Fetch Loan records
        List<Loan__c> loanRecords = [
            SELECT Id, Name, Loan_Amount__c, New_Account__c, Borrower_s_Name__c, EMI_Amount__c, Interest_Rate__c,
                   Loan_Purpose__c, New_Account__r.Name, New_Account__r.FirstName__c, New_Account__r.Last_Name__c,
                   Types_Of_Loans__c, RecordType.Name
            FROM Loan__c 
            WHERE New_Account__c = :accountId
        ];

        // Initialize totals
        Decimal totalLoanAmount = 0;
        Decimal totalAmountToBeRepaid = 0;

        // Calculate totals using the provided logic
        for (Loan__c loan : loanRecords) {
            Decimal loanAmount = loan.Loan_Amount__c != null ? loan.Loan_Amount__c : 0;
            Decimal interestRate = loan.Interest_Rate__c != null ? loan.Interest_Rate__c : 0;

            totalLoanAmount += loanAmount;
            totalAmountToBeRepaid += loanAmount * (1 + (interestRate / 100));
        }

        // Assign calculated values to the summary object
        summary.loans = loanRecords;
        summary.totalLoanAmount = totalLoanAmount;
        summary.totalAmountToBeRepaid = totalAmountToBeRepaid;

        return summary;
    }

}