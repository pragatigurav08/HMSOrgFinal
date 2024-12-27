public class getAccountNumberFromLoan {
@AuraEnabled(cacheable=true)
    public static List<Loan__c> getLoansByAccountNumber(String accountNumber) {
        // Query loan records where the account number matches
        return [SELECT Id, Name, 	Loan_Amount__c,New_Account__c,Types_Of_Loans__c, Borrower_s_Name__c, EMI_Amount__c,Interest_Rate__c,Loan_Purpose__c,
                       New_Account__r.Name, New_Account__r.FirstName__c, New_Account__r.Last_Name__c
                FROM Loan__c 
                WHERE New_Account__r.Name = :accountNumber];
    }
}