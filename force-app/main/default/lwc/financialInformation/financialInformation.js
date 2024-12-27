import { LightningElement, api, wire, track } from 'lwc';
import getNewAccountDetails from '@salesforce/apex/WealthControllers.getNewAccountDetails';
import getAllAdvisors from '@salesforce/apex/getAdvisor.getAllAdvisors';
import assignAdvisorToAccount from '@salesforce/apex/getAdvisor.assignAdvisorToAccount';
import getAssignedAdvisors from '@salesforce/apex/getAdvisor.getAssignedAdvisors';
import getFinancialSuggestions from '@salesforce/apex/WealthController.getFinancialSuggestions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Import the ShowToastEvent

export default class FinancialInformation extends LightningElement {
    @api recordId; // This will be passed by the page where the component is placed
    @track newAccount; // Track newAccount to trigger reactivity
    @track financialSuggestion; // Track financialSuggestion to display it in the template
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
            
            // Call the getFinancialAdvice method with required parameters if data is available
            const annualIncome = this.newAccount.Annual_Income__c;
            const totalBalance = this.newAccount.Total_Balance__c;
            this.getFinancialAdvice(annualIncome, totalBalance);
        } else if (error) {
            this.newAccount = null;
            console.error("Error fetching data", error);
        }
    }

    getFinancialAdvice(annualIncome, totalBalance) {
        console.log('Annual Income:', annualIncome);  // Log the annual income
        console.log('Total Balance:', totalBalance);  // Log the total balance
        
        // Call the server-side method with both annualIncome and totalBalance
        getFinancialSuggestions({ annualIncome, totalBalance })
            .then((suggestion) => {
                console.log('Financial Suggestion:', suggestion);  // Log the financial suggestion
                this.financialSuggestion = suggestion;  // Store the financial suggestion
            })
            .catch((error) => {
                console.error('Error fetching financial suggestion: ', error);
            });
    }

    openAdvisorModal() {
        this.fetchAdvisors(); // Fetch advisors not assigned to the selected account
        this.isAdvisorModalOpen = true; // Open the advisor modal
    }

    @track isAdvisorModalOpen = false; // Modal open state


    // Close the modal
    closeAdvisorModal() {
        this.isAdvisorModalOpen = false;
    }

    showToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(toastEvent);
    }

   // @track advisors = []; // Track the list of advisors
    @track advisorDetailsVisible = false; // Track visibility of advisor details

    //@api recordId; // Wealth Management record ID
    @track advisors = []; // All available advisors
    @track assignedAdvisors = []; // Advisors already assigned to the current New Account
    @track noAdvisorResults = false; // Flag to check if advisors are available

    // Fetch all available advisors when the component loads
    connectedCallback() {
        this.fetchAdvisors();
        this.fetchAssignedAdvisors();
    }

    // Fetch all available advisors (those not yet assigned to any account)
    fetchAdvisors() {
    getAllAdvisors({ wealthManagementId: this.recordId })
        .then((result) => {
            this.advisors = result;
            console.log('Fetched Advisors:', JSON.stringify(result));
            this.noAdvisorResults = this.advisors.length === 0;
        })
        .catch((error) => {
            console.error('Error fetching advisors:', error);
            this.noAdvisorResults = true;
        });
}


    // Fetch advisors assigned to the current New Account (through Wealth Management)
    fetchAssignedAdvisors() {
        getAssignedAdvisors({ newAccountId: this.recordId })
            .then((result) => {
                this.assignedAdvisors = result;
                console.log('Assigned Advisors:', JSON.stringify(result));
            })
            .catch((error) => {
                console.error('Error fetching assigned advisors:', error);
            });
    }

    // Handle assigning an advisor to the account
    assignAdvisor(event) {
    const advisorId = event.target.dataset.id;
    console.log('Assigning Advisor:', advisorId, 'to Wealth Management ID:', this.recordId);

    if (advisorId && this.recordId) {
        assignAdvisorToAccount({ advisorId, wealthManagementId: this.recordId })
            .then(() => {
                this.advisors = this.advisors.filter(advisor => advisor.id !== advisorId);
                this.fetchAssignedAdvisors();
                this.showToast('Success', 'Advisor assigned successfully!', 'success');
            })
            .catch((error) => {
                console.error('Error assigning advisor:', error);
                this.showToast('Error', 'Error assigning advisor', 'error');
            });
    }
    this.isAdvisorModalOpen = false;
}


    // Show toast messages
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

}