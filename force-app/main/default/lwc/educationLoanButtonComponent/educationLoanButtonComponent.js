import { LightningElement, track } from 'lwc';
import checkLoanEligibility from '@salesforce/apex/LoanEligibilityController.checkLoanEligibility';
import { NavigationMixin } from 'lightning/navigation';
 
export default class LoanEligibilityChecker extends NavigationMixin(LightningElement) {
    @track accountId = '';
    @track loanAmount = 0;
    @track customerDetails;
    @track errorMessage;
 
    // Boolean properties for controlling visibility
    showEligibilityChecker = false;
    showEducationLoanButton = true;
 
    // Method to handle the Education Loan button click
    openEligibilityChecker() {
        console.log('Opening Eligibility Checker');
        this.showEligibilityChecker = true;
        this.showEducationLoanButton = false;  // Ensure button is hidden
    }
 
    handleAccountIdChange(event) {
        this.accountId = event.target.value;
    }
 
    handleLoanAmountChange(event) {
        this.loanAmount = event.target.value;
    }
 
    checkEligibility() {
        this.errorMessage = null;
        this.customerDetails = null;
 
        checkLoanEligibility({ accountId: this.accountId, loanAmount: this.loanAmount })
            .then(result => {
                if (result.errorMessage) {
                    this.errorMessage = result.errorMessage;
                } else {
                    this.customerDetails = { ...result, isEligible: this.checkEligibilityCriteria(result) };
                }
            })
            .catch(error => {
                this.errorMessage = 'An unexpected error occurred: ' + JSON.stringify(error);
            });
    }
 
    checkEligibilityCriteria(result) {
        return result.annualIncome >= 300000;  // Example condition
    }
 
     @track isFormVisible = true;
 
    handleButtonClick() {
        this.isFormVisible = !this.isFormVisible; // Toggle the form visibility
    }
}