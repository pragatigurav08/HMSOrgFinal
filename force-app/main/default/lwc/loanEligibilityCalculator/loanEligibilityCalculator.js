import { LightningElement, track } from 'lwc';
import getAccountById from '@salesforce/apex/AccountController.getAccountById';

export default class LoanEligibilityCalculator extends LightningElement {
    @track accountId = '';      // Track Account ID input
    @track annualIncome = 0;     // Track Annual Income value
    @track loanAmount = 0;       // Track Loan Eligibility amount
    @track error = '';           // Track error messages

    // Handle Account ID Search
    handleAccountSearch(event) {
        this.accountId = event.target.value;

        console.log('Inside handleAccountSearch ::: '+ this.accountId);
        if (this.accountId) {
            this.fetchAccountDetails();
        }
    }

    // Call Apex to fetch account details
    fetchAccountDetails() {
        console.log('inside fetchaccount details:: '+ this.accountId);
        getAccountById({ accountId: this.accountId })
            .then((result) => {
                console.log('Result ::: '+ JSON.stringify(result));
                this.annualIncome = result.Annual_Income__c || 0;
                console.log('annualincome ::: '+  this.annualIncome);
                this.calculateLoanEligibility();
                console.log('calculateloaneligibility');
                this.error = ''; // Clear any previous errors
            })
            .catch((error) => {
                this.error = 'Account not found. Please check the ID.';
                this.annualIncome = 0;
                this.loanAmount = 0;
            });
    }

    // Calculate loan eligibility based on the annual income
    handleIncomeChange() {
        this.calculateLoanEligibility();
    }

    // Calculation logic for loan eligibility
    calculateLoanEligibility() {
        console.log('calculateloaneligibity::: '+ this.annualIncome);
        const income = parseFloat(this.annualIncome);
        if (income <= 200000) {
            this.loanAmount = 20000;
        } else if (income <= 400000) {
            this.loanAmount = 40000;
        } else {
            this.loanAmount = income * 0.10; // 10% for higher income brackets
        }
    }
}