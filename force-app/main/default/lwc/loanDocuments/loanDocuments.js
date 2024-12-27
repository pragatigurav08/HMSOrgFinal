import { LightningElement, wire, api } from 'lwc';
import getLoanDocuments from '@salesforce/apex/LoanUploadController.getLoanDocuments';

export default class LoanDocuments extends LightningElement {
    @api recordId;
    documents;

    @wire(getLoanDocuments, { loanId: '$recordId' })
    wiredDocuments({ error, data }) {
        if (data) {
            this.documents = data.map(doc => ({
                documentId: doc.documentId,
                documentName: doc.documentName,
                documentUrl: `/sfc/servlet.shepherd/document/download/${doc.documentId}`
            }));
        } else if (error) {
            console.error(error);
        }
    }
}