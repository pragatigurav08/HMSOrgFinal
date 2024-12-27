import { LightningElement } from 'lwc';

export default class EducationLoanEmiCalculator extends LightningElement {
    loanAmount = 100000;
    tenure = 60; // Default 5 years (60 months)
    interestRate = 9.0; // Default interest rate
    emi = 0;
    totalInterestPayable = 0;

    // Method to calculate EMI
    calculateEMI(loanAmount, tenure, interestRate) {
        let monthlyInterestRate = interestRate / 12 / 100;
        let emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenure)) /
                  (Math.pow(1 + monthlyInterestRate, tenure) - 1);
        return emi;
    }

    // Update Loan Amount
    handleLoanAmountChange(event) {
        this.loanAmount = event.target.value;
        this.updateResults();
    }

    // Update Tenure
    handleTenureChange(event) {
        this.tenure = event.target.value;
        this.updateResults();
    }

    // Update Interest Rate
    handleInterestRateChange(event) {
        this.interestRate = event.target.value;
        this.updateResults();
    }

    // Update results (EMI and Total Interest Payable)
    updateResults() {
        this.emi = this.calculateEMI(this.loanAmount, this.tenure, this.interestRate).toFixed(2);
        this.totalInterestPayable = ((this.emi * this.tenure) - this.loanAmount).toFixed(2);
    }

    // Call updateResults once when component loads to initialize values
    connectedCallback() {
        this.updateResults();
    }
}