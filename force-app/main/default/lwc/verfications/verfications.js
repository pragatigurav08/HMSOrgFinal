import { LightningElement, api, wire, track } from 'lwc';
import getNewAccountDetails from '@salesforce/apex/WealthControllers.getNewAccountDetails';
export default class Verfications extends LightningElement {
 @api recordId; // This will be passed by the page where the component is placed
    @track newAccount; // Track newAccount to trigger reactivity
    //@track financialSuggestion; // Track financialSuggestion to display it in the template
 @track chevronIcon = 'utility:chevronright';  // Initially set the chevron to point down
    
    // Toggle function for the details section
    toggleDetails() {
        this.showDetails = !this.showDetails;  // Toggle the details section visibility
        this.chevronIcon = this.showDetails ? 'utility:chevronup' : 'utility:chevronright';  // Toggle chevron icon
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