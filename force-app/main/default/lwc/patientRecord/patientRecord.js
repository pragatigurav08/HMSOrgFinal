import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getRelatedAppointments from '@salesforce/apex/ReceptionistDashboard.getRelatedAppointments';

export default class PatientRecord extends LightningElement {
    patientId; // Stores the Patient Id
    appointments=[];
    error;

    // Retrieve the Id from the URL
    @wire(CurrentPageReference)
    getPageReference(pageRef) {
        if (pageRef && pageRef.attributes) {
            // Extract the Patient Id from the URL path
            this.patientId = pageRef.attributes.recordId;
            console.log('Extracted Patient Id:', this.patientId);
        }
    }

    // Fetch related appointments using the extracted Patient Id
    @wire(getRelatedAppointments, { patientId: '$patientId' })
    wiredAppointments({ data, error }) {
        if (data) {
            this.appointments = data;
            this.error = undefined;
            console.log('Appointmnet setails on record::::'+ JSON.stringify(this.appointments));
        } else if (error) {
            this.error = error;
            this.appointments = undefined;
        }
    }

    get noAppointments() {
        return this.appointments.length === 0;
    }
}