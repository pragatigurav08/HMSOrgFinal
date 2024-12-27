trigger JointAccountDeletionTrigger on New_Account__c (After delete) {
 if (Trigger.isAfter && Trigger.isDelete) {
        AccountTriggerHandlerDeletion.handleAfterDelete(Trigger.oldMap.keySet());
    }
}