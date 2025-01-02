public class UpdatingClaimStage {
    public static void UpdateStage(List<Claim__c> newClaims, Map<Id, Claim__c> oldClaims) {
        List<Claim__c> claimsList = new List<Claim__c>();
        
        for (Claim__c cc : newClaims) {
            Claim__c oldClaim = oldClaims.get(cc.Id);
            if (oldClaim != null && oldClaim.Stage__c == 'Claim Investigation' && cc.Stage__c == 'Claim Processing') {
                claimsList.add(cc);
            }
        }
        
        if (!claimsList.isEmpty()) {
            methodLogic(claimsList, oldClaims);
        }
    }
    
    public static void methodLogic(List<Claim__c> allClaims, Map<Id, Claim__c> oldClaims) {
        Set<String> validHospitals = new Set<String>{'kumar dental clinic', 'sri sai', 'sri priya'};
        
        if (allClaims == null || allClaims.isEmpty()) {
            return;
        }

        Set<Id> policyIds = new Set<Id>();
        Map<Id, Decimal> policyMap = new Map<Id, Decimal>();
        Map<Id, Integer> attachedFilesCountMap = new Map<Id, Integer>();
        
        // Collect Insurance Policy IDs
        for (Claim__c claim : allClaims) {
            if (claim.Insurance_Policy__c != null) {
                policyIds.add(claim.Insurance_Policy__c);
            }
        }
        
        // Query policies
        List<Insurance_Policy__c> policies = [SELECT Id, Coverage_Amount__c FROM Insurance_Policy__c WHERE Id IN :policyIds];
        for (Insurance_Policy__c policy : policies) {
            policyMap.put(policy.Id, policy.Coverage_Amount__c);
        }
        
        // Collect claim IDs for attachment counts
        Set<Id> claimIds = new Set<Id>();
        for (Claim__c claim : allClaims) {
            claimIds.add(claim.Id);
        }
        
        // Query attached files count for claims
        List<AggregateResult> attachmentCounts = [
            SELECT LinkedEntityId, COUNT(Id) 
            FROM ContentDocumentLink
            WHERE LinkedEntityId IN :claimIds
            GROUP BY LinkedEntityId
        ];
        for (AggregateResult result : attachmentCounts) {
            attachedFilesCountMap.put(
                (Id) result.get('LinkedEntityId'), 
                (Integer) result.get('expr0')
            );
        }

        
        // Validate each claim
        for (Claim__c claim : allClaims) {
            Claim__c oldClaim = oldClaims.get(claim.Id);
            if (oldClaim == null) {
                continue;
            }
            
            Boolean isValid = true;
            String errorMessage = '';
            
            // 1. Validate the difference between Date of Admission and Date of Discharge
            if (claim.Date_of_Admission__c != null && claim.Date_of_Discharge__c != null) {
                Long millisecondsDifference = claim.Date_of_Discharge__c.getTime() - claim.Date_of_Admission__c.getTime();
                if (millisecondsDifference < 24 * 60 * 60 * 1000) {
                    errorMessage += 'Date of Admission and Date of Discharge should have a difference of at least 24 hours.\n';
                    isValid = false;
                }
            } else {
                errorMessage += 'Date of Admission or Date of Discharge is missing.\n';
                isValid = false;
            }
            
            // 2. Validate Name of Hospital is in the list of valid hospitals
            if (claim.Name_of_Hospital__c != null && !validHospitals.contains(claim.Name_of_Hospital__c)) {
                errorMessage += 'The Name of Hospital is not in the approved list.\n';
                isValid = false;
            }
            
            // 3. Validate Amount To Claim is less than or equal to Coverage Amount
            Decimal coverageAmount = policyMap.get(claim.Insurance_Policy__c);
            if (claim.Amount_To_Claim__c != null) {
                if (coverageAmount != null && claim.Amount_To_Claim__c > coverageAmount) {
                    errorMessage += 'Amount To Claim exceeds the Coverage Amount.\n';
                    isValid = false;
                }
            } else {
                errorMessage += 'Insurance Policy or Amount To Claim is missing.\n';
                isValid = false;
            }
            
            // 4. Validate Claim Documents Submitted equals the number of attached files
            Integer attachedFilesCount = attachedFilesCountMap.get(claim.Id) != null ? attachedFilesCountMap.get(claim.Id) : 0;
            if (claim.Claim_Documents_Submitted__c != null) {
                Integer submittedCount = claim.Claim_Documents_Submitted__c.split(';').size();
                if (submittedCount != attachedFilesCount) {
                    errorMessage += 'The number of Claim Documents Submitted does not match the number of attached files.\n';
                    isValid = false;
                    System.debug('isValid>>>'+isValid);
                }
            }
            
            // If any validation fails, revert the Stage and add an error
            if (!isValid) {
                system.debug('claim.Stage__c>>'+claim.Stage__c);
                claim.Stage__c = oldClaim.Stage__c;
                claim.Description__c= errorMessage;
                claim.addError(errorMessage);
            }
        }
    }
}