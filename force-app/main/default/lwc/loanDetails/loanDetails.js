import { LightningElement, api, wire,track } from 'lwc';
import getLoanDetailsByWealthManagement from '@salesforce/apex/LoanDetails.getLoanDetailsByWealthManagement';

export default class LoanDetails extends LightningElement {
    @api recordId; // Wealth Management record ID
    loanDetails = []; // Initialize loanDetails as an empty array
     @track chevronIcon = 'utility:chevronright';  // Initially set the chevron to point down
    
    // Toggle function for the details section
    toggleDetails() {
        this.showDetails = !this.showDetails;  // Toggle the details section visibility
        this.chevronIcon = this.showDetails ? 'utility:chevronup' : 'utility:chevronright';  // Toggle chevron icon
    }

    @wire(getLoanDetailsByWealthManagement, { wealthManagementId: '$recordId' })
    wiredLoanDetails({ error, data }) {
        if (data) {
            this.loanDetails = data;
            console.log('Fetched Loan Details:', JSON.stringify(this.loanDetails));
        } else if (error) {
            this.loanDetails = [];
            console.error('Error fetching loan details:', error);
        }
    }
}