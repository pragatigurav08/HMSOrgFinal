// import { LightningElement, track } from 'lwc';
// import checkLoanEligibility from '@salesforce/apex/LoanEligibilityController.checkLoanEligibility';

// export default class LoanEligibilityComponent extends LightningElement {
//     @track accountId = '';
//     @track loanAmount = 0;
//     @track customerDetails;
//     @track errorMessage;

//     handleAccountIdChange(event) {
//         this.accountId = event.target.value;
//     }

//     handleLoanAmountChange(event) {
//         this.loanAmount = event.target.value;
//     }

//     checkEligibility() {
//         this.errorMessage = null;
//         this.customerDetails = null;

//         checkLoanEligibility({ accountId: this.accountId, loanAmount: this.loanAmount })
//             .then(result => {
//                 if (result.errorMessage) {
//                     this.errorMessage = result.errorMessage;
//                 } else {
//                     this.customerDetails = result;
//                 }
//             })
//             .catch(error => {
//                 this.errorMessage = 'An unexpected error occurred: ' + JSON.stringify(error);
//             });
//     }
//     @track isModalOpen = false;

//     handleOpenModal() {
//         this.isModalOpen = true;
//     }

//     handleCloseModal() {
//         this.isModalOpen = false;
//     }
// }
import { LightningElement, track } from 'lwc';
import getAnnualIncome from '@salesforce/apex/LoanEligibilityController.getAnnualIncome';
import checkLoanEligibility from '@salesforce/apex/LoanEligibilityController.checkLoanEligibility';

export default class LoanEligibilityChecker extends LightningElement {
    @track accountId = '';
    @track loanAmount = 0;
    @track customerDetails;
    @track errorMessage;

    handleAccountIdChange(event) {
        this.accountId = event.target.value;
    }

    handleLoanAmountChange(event) {
        this.loanAmount = event.target.value;
    }

    checkEligibility() {
        if (this.accountId && this.loanAmount) {
            checkLoanEligibility({ accountId: this.accountId, loanAmount: this.loanAmount })
                .then(result => {
                    this.customerDetails = {
                        annualIncome: result.annualIncome,
                        interestRate: result.interestRate,
                        eligibilityMessage: result.eligible ? 'Eligible' : result.message
                    };
                    this.errorMessage = '';
                })
                .catch(error => {
                    this.errorMessage = 'Error in eligibility check: ' + error.body.message;
                    this.customerDetails = null;
                });
        } else {
            this.errorMessage = 'Please provide Account ID and Loan Amount.';
            this.customerDetails = null;
        }
    }
}