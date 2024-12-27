import { LightningElement, api, wire } from 'lwc';
import getTodayPrescriptions from '@salesforce/apex/PreviewPrescriptionInvoiceController.getTodayPrescriptions';
import getFormattedNextVisitDate from '@salesforce/apex/PreviewPrescriptionInvoiceController.getFormattedNextVisitDate';
import getFormattedCreatedDate from '@salesforce/apex/PreviewPrescriptionInvoiceController.getFormattedCreatedDate';

export default class PreviewPrescriptionInvoice extends LightningElement {
    @api recordId; // Patient record ID
    prescriptions = [];
    nextVisitDate = '';
    createdDate = '';
    todayPrescriptionDetails = null; // To hold processed data for the first prescription

    // Fetch today's prescriptions
    @wire(getTodayPrescriptions, { patientId: '$recordId' })
    wiredPrescriptions({ error, data }) {
        if (data && data.length > 0) {
            this.prescriptions = data;

            // Preprocess the first prescription details
            const firstPrescription = data[0];
            this.todayPrescriptionDetails = {
                patientName: firstPrescription.Patient_Registration__r?.Name || 'N/A',
                gender: firstPrescription.Patient_Registration__r?.Gender__c || 'N/A',
                age: firstPrescription.Patient_Registration__r?.Age__c || 'N/A',
                address: firstPrescription.Patient_Registration__r?.Address__c || 'N/A',
                drugName: firstPrescription.Drug__r?.Name || 'N/A',
                dosage: firstPrescription.Dosage__c || 'N/A',
                frequency: firstPrescription.Frequency__c || 'N/A',
                intake: firstPrescription.Intake__c || 'N/A',
            };
        } else if (error) {
            console.error('Error fetching prescriptions: ', error);
        }
    }

    // Fetch next visit date
    @wire(getFormattedNextVisitDate, { patientId: '$recordId' })
    wiredNextVisitDate({ error, data }) {
        if (data) {
            this.nextVisitDate = data;
        } else if (error) {
            console.error('Error fetching next visit date: ', error);
        }
    }

    // Fetch created date
    @wire(getFormattedCreatedDate, { patientId: '$recordId' })
    wiredCreatedDate({ error, data }) {
        if (data) {
            this.createdDate = data;
        } else if (error) {
            console.error('Error fetching created date: ', error);
        }
    }

    // Handle printing prescription
    handlePrintPrescription() {
        const vfPageUrl = `/apex/PrintPrescription?patientId=${this.recordId}`;
        window.open(vfPageUrl, '_blank');
    }

    // Handle printing invoice
    handlePrintInvoice() {
        const vfPageUrl = `/apex/printinvoice?patientId=${this.recordId}`;
        window.open(vfPageUrl, '_blank');
    }
}