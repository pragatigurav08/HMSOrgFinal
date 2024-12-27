import { LightningElement, api } from 'lwc';

export default class PdfPreviewComponent extends LightningElement {
    @api patientId; // API property to accept patientId from the parent
    @api savedRecordIds; // API property to accept savedRecordIds from the parent

    showPreview = false; // To toggle iframe visibility
    combinedPdfUrl; // URL of the combined Visualforce page

    handlePreview() {
        // Construct the Visualforce page URL dynamically with parameters
        this.combinedPdfUrl = `/apex/CombinedPDFPage?patientId=${this.patientId}&savedRecordIds=${this.savedRecordIds}`;
        this.showPreview = true;
    }
}