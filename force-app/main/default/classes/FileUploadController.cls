public with sharing class FileUploadController {
    @AuraEnabled
    public static Id saveFile(String fileName, String base64Data) {
        System.debug('File name: ' + fileName);
        System.debug('Base64 data length: ' + base64Data.length());

        // Decode the base64 string into Blob
        Blob fileBlob = Blob.valueOf(base64Data);
        
        // Create a ContentVersion object for the file
        ContentVersion contentVersion = new ContentVersion();
        contentVersion.Title = fileName;
        contentVersion.PathOnClient = fileName;
        contentVersion.VersionData = fileBlob;

        insert contentVersion;
        
        // Retrieve the ContentDocumentId of the inserted ContentVersion
        ContentVersion insertedVersion = [SELECT ContentDocumentId FROM ContentVersion WHERE Id = :contentVersion.Id];
        System.debug('ContentDocumentId: ' + insertedVersion.ContentDocumentId);
        
        return insertedVersion.ContentDocumentId;
    }

    @AuraEnabled
    public static Id createRecord(String contentDocumentId) {
        System.debug('Creating record with ContentDocumentId: ' + contentDocumentId);

        // Create a new File_upload_obj__c record
        File_upload_obj__c newRecord = new File_upload_obj__c();
        newRecord.Aadhaar_Card_Image__c = contentDocumentId;

        insert newRecord;
        System.debug('New record Id: ' + newRecord.Id);
        
        return newRecord.Id;
    }
}