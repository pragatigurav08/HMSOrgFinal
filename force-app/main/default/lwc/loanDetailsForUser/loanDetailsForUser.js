import { LightningElement,wire } from 'lwc';
import fetchLoanDetails from '@salesforce/apex/LoanDetailsController.fetchLoanDetails';
//import sendApprovalEmail from '@salesforce/apex/LoanDetailsController.sendApprovalEmail';

export default class LoanDetailsForUser extends LightningElement {
 loanRecords;

    @wire(fetchLoanDetails)
    wiredLoans({ error, data }) {
        if (data) {
            this.loanRecords = data;
        } else if (error) {
            this.loanRecords = null;
            console.error('Error fetching loan details:', error);
        }
    }
     handleApprove(event) {
        const loanId = event.target.dataset.id;
        const loan = this.loanRecords.find(record => record.Id === loanId);

        if (loan) {
            sendApprovalNotification({
                emailAddress: loan.EmailAddress__c,
                borrowerName: loan.Borrower_s_Name__c,
                loanAmount: loan.Loan_Amount__c
            })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Approval email sent successfully!',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                console.error('Error sending email:', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Failed to send email. Please try again later.',
                        variant: 'error'
                    })
                );
            });
        }
    }

    // Handle Reject Button Click
    handleReject(event) {
        const loanId = event.target.dataset.id;
        console.log(`Loan Rejected: ${loanId}`);
        // Add logic for rejecting the loan, e.g., call Apex or update UI
    }
}