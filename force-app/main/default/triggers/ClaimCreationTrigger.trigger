trigger ClaimCreationTrigger on Claim__c (before insert,before update) {
    
    if (Trigger.isBefore && Trigger.isInsert) {
       ClaimCreationTriggerHandler.validateClaimCreation(Trigger.new);
    }
     if (Trigger.isBefore && Trigger.isUpdate) {
       UpdatingClaimStage.UpdateStage(Trigger.new, Trigger.oldMap);
    }
}