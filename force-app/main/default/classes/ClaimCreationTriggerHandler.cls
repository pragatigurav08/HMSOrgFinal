public class ClaimCreationTriggerHandler {
    public static void validateClaimCreation(List<Claim__c> claims) {
        
        Set<Id> insurancePolicyIds = new Set<Id>();
        for (Claim__c claim : claims) {
            if (claim.Insurance_Policy__c != null) {
                insurancePolicyIds.add(claim.Insurance_Policy__c);
            }
        }
        
        if (insurancePolicyIds.isEmpty()) {
            return; 
        }
        
        Map<Id, Insurance_Policy__c> insurancePolicyMap = new Map<Id, Insurance_Policy__c>(
            [SELECT Id, Stage__c
             FROM Insurance_Policy__c
             WHERE Id IN :insurancePolicyIds]
        );
        
        Map<Id, List<Claim__c>> policyToClaimsMap = new Map<Id, List<Claim__c>>();
        for (Claim__c existingClaim : [SELECT Id, Stage__c, Insurance_Policy__c 
                                       FROM Claim__c 
                                       WHERE Insurance_Policy__c IN :insurancePolicyIds]) {
            if (!policyToClaimsMap.containsKey(existingClaim.Insurance_Policy__c)) {
                policyToClaimsMap.put(existingClaim.Insurance_Policy__c, new List<Claim__c>());
            }
            policyToClaimsMap.get(existingClaim.Insurance_Policy__c).add(existingClaim);
        }
        
        for (Claim__c claim : claims) {
            Insurance_Policy__c policy = insurancePolicyMap.get(claim.Insurance_Policy__c);
            
            // Get related claims
            List<Claim__c> relatedClaims = policyToClaimsMap.get(claim.Insurance_Policy__c);
            
            if (relatedClaims != null && !relatedClaims.isEmpty()) {
                // Validate policy stage only if related claims exist
                if (policy.Stage__c != 'Claim Approved') {
                    claim.addError('The related Insurance Policy must be in "Policy Claimed" stage.');
                    continue; 
                }

                // Check if all existing claims linked to the policy are in "Claim Approved" stage
                for (Claim__c relatedClaim : relatedClaims) {
                    if (relatedClaim.Stage__c != 'Claim Approved') {
                        claim.addError('All existing claims linked to the Insurance Policy must be in "Claim Approved" stage.');
                        break;
                    }
                }
            }
        }
    }
}