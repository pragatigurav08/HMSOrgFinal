/**
* @File Name : LoanDetailsController.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : December 12, 2024
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | December 12, 2024 |   | Initial Version
**/

public class LoanDetailsController {
	 @AuraEnabled(cacheable=true)
    public static List<Loan__c> fetchLoanDetails() {
        // Get the current user's full name
        String currentUserName = [SELECT Name FROM User WHERE Id = :UserInfo.getUserId()].Name;
        
        // Check if the current user is "Apoorv S D"
        if (currentUserName == 'Apoorv S D') {
            // Fetch Loan__c records with required fields
            return [SELECT Borrower_s_Name__c, Uploaded_Documents__c,EmailAddress__c, Loan_Amount__c FROM Loan__c];
        }
        
        // If the user is not authorized, return an empty list
        return new List<Loan__c>();
    }
      @InvocableMethod(label='Send Email on Loan Approval')
    public static void sendEmail(List<LoanEmailDetails> detailsList) {
        for (LoanEmailDetails detail : detailsList) {
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new String[] {detail.emailAddress});
            email.setSubject('Loan Approval Notification');
            email.setPlainTextBody('Dear ' + detail.borrowerName + ',\n\nYour loan request has been approved.\n\nRegards,\nLoan Team');
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] {email});
        }
    }

    public class LoanEmailDetails {
        @InvocableVariable
        public String emailAddress;
        @InvocableVariable
        public String borrowerName;
    }
}