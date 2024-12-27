import { LightningElement, api, track } from 'lwc';
import getAccountDetails from '@salesforce/apex/LoanApplicationController.getAccountDetails';
//import getFilesForLoan from '@salesforce/apex/FileController.getFilesForLoan';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AccountDetails extends LightningElement {
    @api accountId; // Pass the account ID dynamically
    @track borrowerName = '';
    @track lastName = '';
    @track organizationName = '';
    @track phoneNumber = '';
    @track dob = '';
    @track address = '';
    @track nationality = '';
    @track email = '';
    @track username = '';
    @track location = '';
    @track fileData = [];

    fileColumns = [
        { label: 'File Name', fieldName: 'name', type: 'text' },
        { label: 'Type', fieldName: 'type', type: 'text' },
        {
            label: 'Actions',
            type: 'button',
            typeAttributes: {
                label: 'Preview',
                name: 'preview',
                variant: 'neutral'
            }
        },
        {
            type: 'button',
            typeAttributes: {
                label: 'Reject',
                name: 'reject',
                variant: 'destructive'
            }
        }
    ];

    connectedCallback() {
        this.fetchAccountDetails(this.accountId);
        //this.fetchLoanFiles(this.accountId);
    }

    fetchAccountDetails(accountId) {
        getAccountDetails({ accountId })
            .then((result) => {
                if (result && result.length > 0) {
                    const account = result[0];
                    this.borrowerName = account.FirstName__c;
                    this.lastName = account.LastName__c;
                    this.organizationName = account.OrganizationName__c;
                    this.phoneNumber = account.Phone__c;
                    this.dob = account.Birthday__c;
                    this.address = account.CommunicationResidentAddress__c;
                    this.nationality = account.Nationality__c;
                    this.email = account.Email__c;
                    this.username = account.Username__c;
                    this.location = account.Location__c;
                } else {
                    this.clearFields();
                }
            })
            .catch((error) => {
                console.error('Error fetching account details:', error);
                this.showToast('Error', 'Failed to fetch account details.', 'error');
            });
    }

    // fetchLoanFiles(accountId) {
    //     getFilesForLoan({ loanId: accountId })
    //         .then((result) => {
    //             this.fileData = result.map(file => ({
    //                 id: file.ContentDocumentId,
    //                 name: file.ContentDocument.Name,
    //                 type: file.ContentDocument.FileType
    //             }));
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching loan files:', error);
    //             this.showToast('Error', 'Failed to fetch loan files.', 'error');
    //         });
    // }
handlePreview(event) {
    const fileId = event.target.dataset.id;
    console.log('Previewing file with ID:', fileId);
    // Add your logic to preview the file here
}

handleReject(event) {
    const fileId = event.target.dataset.id;
    console.log('Rejecting file with ID:', fileId);
    // Add your logic to reject the file here
}


    clearFields() {
        this.borrowerName = '';
        this.lastName = '';
        this.organizationName = '';
        this.phoneNumber = '';
        this.dob = '';
        this.address = '';
        this.nationality = '';
        this.email = '';
        this.username = '';
        this.location = '';
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title,
            message,
            variant
        }));
    }
}