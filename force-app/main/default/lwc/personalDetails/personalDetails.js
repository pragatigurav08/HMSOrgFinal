import { LightningElement, api, wire,track } from 'lwc';
import getNewAccountDetails from '@salesforce/apex/WealthControllers.getNewAccountDetails';

export default class WealthManagementDetails extends LightningElement {
    @api recordId; // This will be passed by the page where the component is placed
    newAccount;
    @track detailsVisible = false; // Track visibility of details

    // Toggle details visibility
    toggleDetails() {
        this.detailsVisible = !this.detailsVisible;
    }

    // Dynamically set the icon based on visibility
    get chevronIcon() {
        return this.detailsVisible ? 'utility:chevrondown' : 'utility:chevronright';
    }
    // Use wire service to fetch the New_Account__c details based on Wealth_Management__c record
    @wire(getNewAccountDetails, { wealthManagementId: '$recordId' })
    wiredNewAccount({ error, data }) {
        if (data) {
            this.newAccount = data;
            console.log('New Account Details:', JSON.stringify(this.newAccount));
        } else if (error) {
            this.newAccount = null;
            console.error("Error fetching data", error);
        }
    }
}