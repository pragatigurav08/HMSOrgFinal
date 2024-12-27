public with sharing class LoanAssignmentController {
    @AuraEnabled
    public static void assignLoan(String loanId) {
        // Query the Loan record
        Loan__c loan = [SELECT Id, Approval_Status__c FROM Loan__c WHERE Id = :loanId LIMIT 1];

        // Query an available approver from the Loan Approver role
        User approver = [SELECT Id FROM User WHERE Name LIKE '%Apoorv' AND IsActive = true LIMIT 1];

        if (approver != null) {
            // Assign the approver and update the loan status
            loan.Assigned_Approver__c = approver.Id;
            loan.Approval_Status__c = 'In Review';
            update loan;

            // Optional: Notify the approver
            sendNotification(approver.Id, loan.Id);
        } else {
            throw new AuraHandledException('No approver is available.');
        }
    }

    private static void sendNotification(Id approverId, Id loanId) {
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setTargetObjectId(approverId);
        email.setSubject('New Loan Assigned for Review');
        email.setPlainTextBody('A new loan application has been assigned to you for review. Loan ID: ' + loanId);
        email.setSaveAsActivity(false);
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
    }
}