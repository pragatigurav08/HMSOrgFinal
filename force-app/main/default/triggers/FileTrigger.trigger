trigger FileTrigger on ContentDocumentLink (after insert) {
    UpdateInsuranceStageHandler.handleFileUpload(Trigger.new);
}