import { LightningElement, api, track } from 'lwc';
import getAssignedAdvisors from '@salesforce/apex/getAdvisor.getAssignedAdvisors';

export default class AssignedAdvisors extends LightningElement {
    @api recordId; // Wealth Management record ID, passed as an API property
    @track assignedAdvisors = []; // To store the list of assigned advisors
    @track noAdvisorResults = false; // Flag to track if no advisors are assigned
    @track chevronIcon = 'utility:chevronright';  // Initially set the chevron to point down
    
    // Toggle function for the details section
    toggleDetails() {
        this.showDetails = !this.showDetails;  // Toggle the details section visibility
        this.chevronIcon = this.showDetails ? 'utility:chevronup' : 'utility:chevronright';  // Toggle chevron icon
    }
    // Fetch advisors when the component is connected
    connectedCallback() {
        this.fetchAssignedAdvisors();
    }

    // Fetch the assigned advisors
    fetchAssignedAdvisors() {
        getAssignedAdvisors({ wealthManagementId: this.recordId })
            .then((result) => {
                this.assignedAdvisors = result;
                this.noAdvisorResults = result.length === 0; // Set flag based on result
                console.log('Assigned Advisors:', JSON.stringify(result));
            })
            .catch((error) => {
                console.error('Error fetching assigned advisors:', error);
                this.assignedAdvisors = [];
                this.noAdvisorResults = true;
            });
    }
}