import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { CurrentPageReference } from 'lightning/navigation';
import getInsuranceDetails from '@salesforce/apex/AccountRelationshipController.getInsuranceDetails';
import getAccountDetails from '@salesforce/apex/AccountRelationshipController.getAccountDetails';
import filterrecords from '@salesforce/apex/AccountRelationshipController.getApplyFilter';
import getsearchInsurance from '@salesforce/apex/AccountRelationshipController.searchInsurance';

export default class AllLoans extends NavigationMixin(LightningElement) {
    @track InsuranceDetails = [];
    @track accountDetails;
    @track error;
    @track selectedAccountId;
    @track selectedAccountName;
    @track isModalOpen = false;
    @track isPopoverOpen = false;
    @track AccNumber = '';
    @track accountType = '';
    @track accountTypeOptions = [];
    @track recordId='';
    @track accouId='';

    // Get the recordId from the page reference
    @wire(CurrentPageReference)
    getPageReference(currentPageReference) {
        if (currentPageReference) {
            this.recordId = currentPageReference.state.recordId;
            this.accouId=currentPageReference.state.accountId;
            console.log('accid ID from URL:', this.accouId);
            console.log('Record ID from URL:', this.recordId); // Debugging log
            if (this.recordId) {
                this.fetchLoanDetails();
                this.fetchAccountDetails();
            } else {
                console.log('No recordId found in URL');
            }
        }
    }

    // Fetch loan details for the specified recordId
    fetchLoanDetails() {
        getInsuranceDetails({ accountId: this.recordId })
            .then(result => {
                console.log('Loan Details:', result); // Debugging log
                this.InsuranceDetails = result;
                this.error = undefined;
            })
            .catch(error => {
                console.error('Error fetching loan details:', error); // Debugging log
                this.error = error;
                this.InsuranceDetails = [];
            });
    }
    fetchAccountDetails() {
        getAccountDetails({ accountId: this.recordId })
            .then(result => {
                console.log('Account Details:', result); // Debugging log
                this.accountDetails = result; // Corrected property assignment
                this.error = undefined;
            })
            .catch(error => {
                console.log('Error fetchinaccount details:', error); // Debugging log
                this.error = error;
                this.accountDetails = undefined;
            });
    }

    // Other methods remain unchanged

    // Process and display account data with uppercase names and record types
 

    closeModal() {
        this.isModalOpen = false;
        this.InsuranceDetails = [];  
    }

    handleOpenRightPanel() {
        console.log("Popover opening"); // Debugging line
        this.isPopoverOpen = true;
        setTimeout(() => {
            const popoverCard = this.template.querySelector('[data-id="popoverCards"]');
            if (popoverCard) {
                console.log("Popover card found"); // Debugging line
                popoverCard.style.transform = "translateY(0%)";
                popoverCard.style.height = "54%";
            }
        }, 500);
    }

handleAccountClick(event) {
        const InsuranceRecordId = event.target.dataset.id;

        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/insurance-policy/${InsuranceRecordId}`
            }
        });
    }
handleSearchInsurance(event) {
    this.AccNumber = event.target.value;
    console.log("loannum>>" + this.AccNumber); // Corrected reference to this.AccNumber
    if (this.AccNumber && this.AccNumber.length > 1) {
        this.searchMetadata();
        console.log('inside if of search>>>');
    }
}

searchMetadata() {
    console.log("loannum>>" + this.AccNumber); 
    console.log("recordId>>" + this.recordId); 
   
    getsearchInsurance({ searchAccountNumber: this.AccNumber, accountId: this.recordId })
        .then(result => {
            console.log('Search result:', result); // Debugging log to see the search results
            this.processRecords(result);
            this.error = undefined;
        })
        .catch(error => {
            console.error('Error searching loans:', error); // Detailed error logging
            this.error = error.body ? error.body.message : error.message;
            this.InsuranceDetails = [];
        });
}
   processRecords(records) {
        this.InsuranceDetails = records.map(record => ({
            ...record,
            Name: record.Name ? record.Name.toUpperCase() : 'N/A',
            recordTypeName: record.RecordType ? record.RecordType.Name : 'N/A'
        }));
    }

    // handleSearchloan(event) {
    //     this.AccNumber = event.target.value;
    //     console.log("loannum>>"+AccNumber); 
    //     if (this.AccNumber.length > 1) {
    //         this.searchMetadata();
    //     }
    // }

    // searchMetadata() {
    //     getsearchloans({ searchAccountNumber: this.AccNumber,accountid:this.recordId })
    //         .then(result => {
    //             this.processRecords(result);
    //             this.error = undefined;
    //             this.AccNumber = '';
    //         })
    //         .catch(error => {
    //             this.error = error.body.message;
    //             this.InsuranceDetails = undefined;
    //             this.AccNumber = '';
    //         });
    // }

    handleClosePopover() {
        this.isPopoverOpen = false;
        const popoverCard = this.template.querySelector('[data-id="popoverCards"]');
        if (popoverCard) {
            popoverCard.style.transform = "translateY(-100%)";
            popoverCard.style.height = "0%";
        }
    }

    clearFilterFields() {
        this.AccNumber = '';
        this.accountType = '';
    }
}