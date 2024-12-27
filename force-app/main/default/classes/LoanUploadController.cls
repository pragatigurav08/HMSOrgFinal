public class LoanUploadController {
@AuraEnabled(cacheable=true)
    public static List<DocumentWrapper> getLoanDocuments(Id loanId) {
        List<DocumentWrapper> documentList = new List<DocumentWrapper>();
        List<ContentDocumentLink> links = [
            SELECT ContentDocumentId, 
                   ContentDocument.Title, 
                   ContentDocument.FileType, 
                   ContentDocument.FileExtension
            FROM ContentDocumentLink
            WHERE LinkedEntityId = :loanId
        ];
        for (ContentDocumentLink link : links) {
            documentList.add(new DocumentWrapper(
                link.ContentDocumentId, 
                link.ContentDocument.Title, 
                link.ContentDocument.FileType, 
                link.ContentDocument.FileExtension
            ));
        }
        return documentList;
    }

    public class DocumentWrapper {
        @AuraEnabled public String documentId { get; set; }
        @AuraEnabled public String documentName { get; set; }
        @AuraEnabled public String fileType { get; set; }
        @AuraEnabled public String fileExtension { get; set; }

        public DocumentWrapper(String documentId, String documentName, String fileType, String fileExtension) {
            this.documentId = documentId;
            this.documentName = documentName;
            this.fileType = fileType;
            this.fileExtension = fileExtension;
        }
    }
}