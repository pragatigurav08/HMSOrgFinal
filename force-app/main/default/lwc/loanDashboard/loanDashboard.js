import { LightningElement, api, track, wire } from 'lwc';
import getLoanDetailsByWealthManagement from '@salesforce/apex/LoanDetails.getLoanDetailsByWealthManagement';

export default class LoanDashboard extends LightningElement {
    @api recordId; // Wealth Management record ID
    @track loanDetails = []; // Array to store fetched loan details
    @track totalLoanAmount = 0;
    @track totalAmountToBeRepaid = 0;
    error;

    // Fetch loan details using wire service
    @wire(getLoanDetailsByWealthManagement, { wealthManagementId: '$recordId' })
    wiredLoanDetails({ error, data }) {
        if (data) {
            this.loanDetails = data;
            console.log('Fetched Loan Details:', JSON.stringify(this.loanDetails));
            this.calculateTotals();
            this.error = undefined;
        } else if (error) {
            this.error = error;
            console.error('Error fetching loan details:', error);
            this.loanDetails = [];
            this.totalLoanAmount = 0;
            this.totalAmountToBeRepaid = 0;
        }
    }

    // Calculate totals for loan amount and amount to be repaid
    calculateTotals() {
        this.totalLoanAmount = this.loanDetails.reduce((acc, loan) => acc + (loan.Loan_Amount__c || 0), 0);
        this.totalAmountToBeRepaid = this.loanDetails.reduce((acc, loan) => {
            const loanAmount = loan.Loan_Amount__c || 0;
            const interestRate = loan.Interest_Rate__c || 0;
            return acc + loanAmount * (1 + interestRate / 100);
        }, 0);
    }
}