import { LightningElement, wire } from "lwc";
import getTopSellingMedicines from "@salesforce/apex/TopSellingMedicinesController.getTopSellingMedicines";
import medicine from '@salesforce/resourceUrl/medicine';

export default class TopSellingMedicines extends LightningElement {
    medicines;
    error;
medicineurl=medicine;
    // Default image placeholder for medicines
    // defaultImage = "https://via.placeholder.com/100";

    // Wire the Apex method
    @wire(getTopSellingMedicines)
    wiredMedicines({ data, error }) {
        if (data) {
            this.medicines = data;
            this.error = undefined;
        } else if (error) {
            this.medicines = undefined;
            this.error = error.body.message;
        }
    }
}