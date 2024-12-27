import { LightningElement } from 'lwc';

export default class HomeLoanEligibility extends LightningElement {
    accountId = '';
    loanAmount = 0;
    customerDetails = null;
    errorMessage = '';
    isFormVisible = true; // to control form visibility
    isPersonalLoanSelected = false;
    openHomeLoan = true; // flag to track whether home loan form is open
    isFocalculateEMIrmVisible = false; // flag for EMI calculation visibility

    // Handle input change for Account ID
    handleAccountIdChange(event) {
        this.accountId = event.target.value;
    }

    // Handle input change for Loan Amount
    handleLoanAmountChange(event) {
        this.loanAmount = event.target.value;
    }

    // Method that gets called when the user clicks on "Home Loan" button
    // handleHomeLoanClick() {
    //     console.log('Inside home loan :::');
        
    //     // Hide the home loan form and set flags as needed
    //     this.isFormVisible = false;
    //     this.isPersonalLoanSelected = true; // You can modify this based on your actual needs
    //     this.openHomeLoan = false; // Home loan form is no longer visible
    //     this.isFocalculateEMIrmVisible = false; // Hide EMI calculation form

    //     // Call the eligibility check for Home Loan
    //     this.checkEligibilityHome();
        
    //     // If you have any other actions (like calculating EMI), you can call them here
    //     this.calculateEMI();
    // }

    // Check eligibility for Home Loan
    checkEligibilityHome() {
        console.log('Inside check eligibility of home loan :::');
        this.errorMessage = ''; // Clear any previous error message
        this.customerDetails = null; // Clear previous details

        // Validate Account ID (it should not be empty)
        if (!this.accountId) {
            this.errorMessage = 'Account ID is required.';
            return;
        }

        // Validate Loan Amount (should be greater than zero)
        if (this.loanAmount <= 0) {
            this.errorMessage = 'Loan amount must be greater than zero.';
            return;
        }

        // Simulate getting the customer data from Salesforce or an API (you can replace this with real logic)
        let customerData = this.getCustomerData(this.accountId);

        if (!customerData) {
            this.errorMessage = 'No customer data found for the provided Account ID.';
            return;
        }

        // Calculate eligibility based on Home Loan rules
        let eligibilityData = this.calculateHomeLoanEligibility(customerData, this.loanAmount);

        // Update customer details with eligibility data
        this.customerDetails = eligibilityData;
    }

    // Simulate fetching customer data based on Account ID
    getCustomerData(accountId) {
        // In a real scenario, you'd fetch customer data via an Apex controller or other API.
        const mockData = {
            '123': { annualIncome: 750000, accountId: '123' }, // Example customer
            '456': { annualIncome: 1200000, accountId: '456' }, // Another customer
        };

        return mockData[accountId] || null;
    }

    // Logic to calculate Home Loan eligibility
    calculateHomeLoanEligibility(customer, loanAmount) {
        const annualIncome = customer.annualIncome;
        let eligibility = { eligible: false, interestRate: 0, eligibilityMessage: '' };

        // Home Loan Eligibility Rules (Example):
        if (annualIncome < 600000) {
            if (loanAmount >= 100000 && loanAmount <= 500000) {
                eligibility.eligible = true;
                eligibility.interestRate = 7;
                eligibility.eligibilityMessage = 'Eligible for Home Loan between ₹1,00,000 to ₹5,00,000 at 7% interest rate.';
            } else {
                eligibility.eligibilityMessage = 'Eligible only for loans between ₹1,00,000 to ₹5,00,000.';
            }
        } else if (annualIncome >= 600000 && annualIncome <= 1500000) {
            if (loanAmount >= 100000 && loanAmount <= 1000000) {
                eligibility.eligible = true;
                eligibility.interestRate = 6;
                eligibility.eligibilityMessage = 'Eligible for Home Loan between ₹1,00,000 to ₹10,00,000 at 6% interest rate.';
            } else {
                eligibility.eligibilityMessage = 'Eligible only for loans between ₹1,00,000 to ₹10,00,000.';
            }
        } else if (annualIncome > 1500000) {
            if (loanAmount >= 100000 && loanAmount <= 2500000) {
                eligibility.eligible = true;
                eligibility.interestRate = 5;
                eligibility.eligibilityMessage = 'Eligible for Home Loan between ₹1,00,000 to ₹25,00,000 at 5% interest rate.';
            } else {
                eligibility.eligibilityMessage = 'Eligible only for loans between ₹1,00,000 to ₹25,00,000.';
            }
        } else {
            eligibility.eligibilityMessage = 'Loan amount below minimum eligibility or invalid income data.';
        }

        return eligibility;
    }

    // Method to calculate EMI (Example - You can replace this with your actual logic)
    calculateEMI() {
        console.log('EMI Calculation logic should be placed here');
        // Add EMI calculation logic here
    }
}