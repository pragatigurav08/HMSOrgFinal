import { LightningElement, api, wire,track } from 'lwc';
import getInsurancePoliciesByWealthManagement from '@salesforce/apex/InsuranceDetails.getInsurancePoliciesByWealthManagement';

export default class InsurancePolicy extends LightningElement {
    @api recordId; // Wealth_Management__c record ID passed from the parent
    insurancePolicies = []; // To hold the fetched insurance policies
    @track chevronIcon = 'utility:chevronright';  // Initially set the chevron to point down
    
    // Toggle function for the details section
    toggleDetails() {
        this.showDetails = !this.showDetails;  // Toggle the details section visibility
        this.chevronIcon = this.showDetails ? 'utility:chevronup' : 'utility:chevronright';  // Toggle chevron icon
    }

    @wire(getInsurancePoliciesByWealthManagement, { wealthManagementId: '$recordId' })
    wiredNewAccount({ error, data }) {
        if (data) {
            this.insurancePolicies = data;
            console.log('Fetched Insurance Policies:', JSON.stringify(this.insurancePolicies));
        } else if (error) {
            this.insurancePolicies = [];
            console.error('Error fetching data:', error);
        }
    }
}