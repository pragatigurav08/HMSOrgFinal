/**
* @File Name : LoanDocumentController.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : October 18, 2024
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | October 18, 2024 |   | Initial Version
**/

public class LoanDocumentController {
	@AuraEnabled
    public static void updateLoanDocument(Id loanId, String documentId) {
        try {
            // Query the Loan__c record
            Loan__c loanRecord = [SELECT Id, Documents__c FROM Loan__c WHERE Id = :loanId LIMIT 1];

            // Update the Document__c field with ContentDocumentId
            loanRecord.Documents__c = documentId;
            update loanRecord;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}