public class UpdateInsuranceStageHandler {

    public static void handleFileUpload(List<ContentDocumentLink> newLinks) {
        Set<Id> claimIds = new Set<Id>();

        // Collect Claim__c record IDs from the inserted ContentDocumentLink records
        for (ContentDocumentLink link : newLinks) {
            if (link.LinkedEntityId != null && link.LinkedEntityId.getSObjectType() == Claim__c.SObjectType) {
                claimIds.add(link.LinkedEntityId);
            }
        }

        if (!claimIds.isEmpty()) {
            // Query to check if files already exist for these Claim__c records
            Map<Id, Integer> claimFileCount = new Map<Id, Integer>();
            List<AggregateResult> fileCounts = [
                SELECT LinkedEntityId, COUNT(Id) fileCount
                FROM ContentDocumentLink
                WHERE LinkedEntityId IN :claimIds
                GROUP BY LinkedEntityId
            ];

            for (AggregateResult ar : fileCounts) {
                claimFileCount.put((Id) ar.get('LinkedEntityId'), (Integer) ar.get('fileCount'));
            }

            List<Insurance_Policy__c> insuranceUpdates = new List<Insurance_Policy__c>();
            List<Claim__c> cliamupdates=new List<Claim__c>();

            // Process Claims and update related Insurance__c record if it's the first file
            for (Id claimId : claimIds) {
                if (claimFileCount.get(claimId) == 1) { // Only process if this is the first file
                    Claim__c claim = [SELECT Id,Insurance_Policy__c FROM Claim__c WHERE Id = :claimId LIMIT 1];
                    if(claim.Id!=null){
                        cliamupdates.add(new Claim__c(
                        Id=claim.Id,
                        Stage__c='Claim Investigation'));
                    }
                    if (claim.Insurance_Policy__c != null) {
                        insuranceUpdates.add(new Insurance_Policy__c(
                            Id = claim.Insurance_Policy__c,
                            Stage__c = 'Claim Investigation'
                        ));
                    }
                }
            }
            
            if(!cliamupdates.isEmpty()){
                try{
                    update cliamupdates;
                }
                catch (DmlException e) {
                    System.debug('Error updating Claim records: ' + e.getMessage());
                }
            }

            // Update Insurance__c records
            if (!insuranceUpdates.isEmpty()) {
                try {
                    update insuranceUpdates;
                } catch (DmlException e) {
                    System.debug('Error updating Insurance records: ' + e.getMessage());
                }
            }
        }
    }
}