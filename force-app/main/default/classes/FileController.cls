public with sharing class FileController {
    @AuraEnabled(cacheable=true)
    public static List<ContentDocumentWrapper> getFiles(Id accountId) {
        List<ContentDocumentLink> links = [
            SELECT ContentDocument.Id, ContentDocument.Title, ContentDocument.ContentSize, ContentDocument.FileExtension
            FROM ContentDocumentLink
            WHERE LinkedEntityId = :accountId
        ];
        List<ContentDocumentWrapper> documents = new List<ContentDocumentWrapper>();
        
        for (ContentDocumentLink link : links) {
            ContentDocument doc = link.ContentDocument;
            documents.add(new ContentDocumentWrapper(
                doc.Id,
                doc.Title,
                doc.ContentSize / 1024, // Converting ContentSize to KB
                doc.FileExtension
            ));
        }

        return documents;
    }

    public class ContentDocumentWrapper {
        @AuraEnabled public String Id;
        @AuraEnabled public String Title;
        @AuraEnabled public Double ContentSize;
        @AuraEnabled public String FileExtension;

        public ContentDocumentWrapper(String Id, String Title, Double ContentSize, String FileExtension) {
            this.Id = Id;
            this.Title = Title;
            this.ContentSize = ContentSize;
            this.FileExtension = FileExtension;
        }
    }

   @AuraEnabled
    public static String saveFiles(String recordId, List<Object> filesUploaded) {
        try {
            List<ContentVersion> lstVersionsToInsert = new List<ContentVersion>();

            // Create ContentVersion records from the passed file data
            for (Object file : filesUploaded) {
                filesUploaded fileData = (filesUploaded) JSON.deserialize(JSON.serialize(file), filesUploaded.class);
                ContentVersion objCntVersion = new ContentVersion();
                objCntVersion.PathOnClient = fileData.Title;
                objCntVersion.Title = fileData.Title;
                objCntVersion.FirstPublishLocationId = recordId;
                objCntVersion.VersionData = fileData.VersionData;
                objCntVersion.IsMajorVersion = true;
                lstVersionsToInsert.add(objCntVersion);
            }

            if (!lstVersionsToInsert.isEmpty()) {
                System.debug('lstVersionsToInsert ' + lstVersionsToInsert);
                insert lstVersionsToInsert;
            }
            return 'success';
        } catch (Exception e) {
            throw new AuraHandledException('Error uploading file: ' + e.getMessage());
        }
    }

    public class filesUploaded{
            public String Title;
            public Blob VersionData;
    }
}