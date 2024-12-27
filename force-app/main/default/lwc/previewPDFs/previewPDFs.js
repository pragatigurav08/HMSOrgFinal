import { LightningElement, api } from 'lwc';

export default class PreviewPDFs extends LightningElement {
    @api recordId; // Automatically set when placed on a record page
    iframeUrl;

    // Helper to generate a Visualforce URL with parameters
    generateVisualforceUrl(basePage, params) {
        const urlParams = new URLSearchParams(params).toString();
        return `${basePage}?${urlParams}`;
    }

    // Generate the URL for the Invoice Visualforce page
    loadInvoice() {
        const baseUrl = '/apex/printinvoice'; // Visualforce page
        const params = {
            patientId: this.recordId, // Pass the current record ID as patientId
            savedRecordIds: 'invoice123' // Example additional parameter
        };
        this.iframeUrl = this.generateVisualforceUrl(baseUrl, params);
    }

    // Generate the URL for the Prescription Visualforce page
    loadPrescription() {
        const baseUrl = '/apex/PrintPrescription'; // Visualforce page
        const params = {
            patientId: this.recordId, // Pass the current record ID as patientId
            savedRecordIds: 'prescription456' // Example additional parameter
        };
        this.iframeUrl = this.generateVisualforceUrl(baseUrl, params);
    }
}