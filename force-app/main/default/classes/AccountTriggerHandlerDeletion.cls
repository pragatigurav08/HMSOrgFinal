public class AccountTriggerHandlerDeletion {
 public static void handleAfterDelete(Set<Id> deletedAccountIds) {
        try {
            // Query all Joint Applicants related to deleted Accounts
            List<Joint_Applicants__c> jointApplicantsToDelete = [
                SELECT Id
                FROM Joint_Applicants__c
                WHERE Account__c IN :deletedAccountIds
            ];

            if (!jointApplicantsToDelete.isEmpty()) {
                delete jointApplicantsToDelete;
                System.debug('Deleted Joint Applicants: ' + jointApplicantsToDelete);
            } else {
                System.debug('No Joint Applicants to delete for deleted accounts.');
            }
        } catch (Exception e) {
            System.debug('Error deleting Joint Applicants: ' + e.getMessage());
        }
    }
}