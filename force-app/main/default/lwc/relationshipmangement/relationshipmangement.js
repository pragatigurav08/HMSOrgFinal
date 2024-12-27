import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getNewAccounts from '@salesforce/apex/AccountRelationshipController.getNewAccounts';
import getRelatedLoans from '@salesforce/apex/AccountRelationshipController.getRelatedLoans';
import getRelatedCreditcards from '@salesforce/apex/AccountRelationshipController.getRelatedCreditcards';
import getRelationshipAssets from '@salesforce/apex/AccountRelationshipController.getRelationshipAssets';
import getRelationshipInsurence from '@salesforce/apex/AccountRelationshipController.getRelationshipInsurence';
import filterrecords from '@salesforce/apex/AccountRelationshipController.getApplyFilter';
import getAccountRecordTypes from '@salesforce/apex/AccountRelationshipController.getAccountRecordTypes';
import getsearchaccount from '@salesforce/apex/AccountRelationshipController.getsearchaccounts';

export default class NewAccountList extends NavigationMixin(LightningElement) {
    @track newAccounts;
    @track error;
    @track selectedAccountId;
    @track selectedAccountName;
    @track isModalOpen = false;
    @track isPopoverOpen = false;

    @track relatedLoans = [];
    @track relatedCreditCards = [];
    @track relatedAssets = [];
    @track relatedInsurances = [];
    @track AccNumber = '';
    @track accountType = '';
    @track PhoneNumber='';
    @track accountTypeOptions = [];
    @track PanCardnumber='';
    @track AadharNumber='';

 handleNavigate() {
        // Example of navigating to an Experience Cloud page by specifying the page reference
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/wealthmanagement'
            }
        });
    }

    handleNavigate1(){
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/loan-management'
            }
        });
    }

    handleNavigate2(){
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/insurance-management'
            }
        });
    }

    // Wired function to get new accounts
    @wire(getNewAccounts)
    wiredNewAccounts({ data, error }) {
        if (data) {
            this.newAccounts = data;
            this.error = undefined;
            this.processRecords(data); // Ensure the method is called with the data
        } else if (error) {
            this.error = error;
            this.newAccounts = undefined;
        }
    }

    @wire(getAccountRecordTypes)
    wiredRecordTypes({ error, data }) {
        if (data) {
            this.accountTypeOptions = data.map(recordType => {
                return { label: recordType.Name, value: recordType.Id }; // Assuming recordType has 'Id' and 'Name'
            });
        } else if (error) {
            console.error('Error fetching account record types:', error);
        }
    }

    // Method to process records
    // processRecords(records) {
    //     this.newAccounts = records.map(record => ({
    //         ...record,
    //         Name: record.Name.toUpperCase() 
    //     }));
    // }
    processRecords(records) {
    this.newAccounts = records.map(record => ({
        ...record,
        Name: record.Name ? record.Name.toUpperCase() : 'N/A',
        recordTypeName: record.RecordType ? record.RecordType.Name : 'N/A'
    }));
    }

    // Handles account row button click
    handleAccountClick(event) {
        this.selectedAccountId = event.target.dataset.id;
        this.selectedAccountName = event.target.dataset.name;
        this.isModalOpen = true;
        this.loadRelatedRecords();
    }
    //  handleAccountDetails(event) {
    //     const accountId = event.currentTarget.dataset.id;

    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__navItemPage',
    //         attributes: {
    //             apiName: 'AccountDetails'
    //         },
    //         state: {
    //             recordId: accountId // Pass the account ID as a state parameter
    //         }
    //     });
    // }
   handleAccountDetails(event) {
        const accountId = event.currentTarget.dataset.id;

        // Navigate to the web page and include the account ID as a query parameter
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/accountdetails?recordId=${accountId}`
            }
        });
    }



    // Load related records for the selected account
    loadRelatedRecords() {
        getRelatedLoans({ accountId: this.selectedAccountId })
            .then(result => this.relatedLoans = result)
            .catch(error => this.error = error);

        getRelatedCreditcards({ accountId: this.selectedAccountId })
            .then(result => this.relatedCreditCards = result)
            .catch(error => this.error = error);

        getRelationshipAssets({ accountId: this.selectedAccountId })
            .then(result => this.relatedAssets = result)
            .catch(error => this.error = error);

        getRelationshipInsurence({ accountId: this.selectedAccountId })
            .then(result => this.relatedInsurances = result)
            .catch(error => this.error = error);
    }

    closeModal() {
        this.isModalOpen = false;
        this.relatedLoans = [];
        this.relatedCreditCards = [];
        this.relatedAssets = [];
        this.relatedInsurances = [];
    }

    // handleOpenRightPanel() {
    //       this.isPopoverOpen = true;
    //     setTimeout(() => {
    //         const popoverCard = this.template.querySelector('[data-id="popoverCards"]');
    //         if (popoverCard) {
    //             popoverCard.style.transform = "translateY(0%)";
    //             popoverCard.style.height = "54%";
    //         }
    //     }, 500);
    // }
    handleOpenRightPanel() {
    console.log("Popover opening"); // Debugging line
    this.isPopoverOpen = true;
    setTimeout(() => {
        const popoverCard = this.template.querySelector('[data-id="popoverCards"]');
        if (popoverCard) {
            console.log("Popover card found"); // Debugging line
            popoverCard.style.transform = "translateY(0%)";
            popoverCard.style.height = "64%";
        }
    }, 500);
}

handleSearchAccount(event){
        this.isLoading=false;
        this.AccNumber = event.target.value;
        if (this.AccNumber.length >0) {
            this.searchMetadata();
        }
        else{

        }
    }
     searchMetadata() {
         this.isLoading=false;
         
        getsearchaccount({ searchAccountNumber: this.AccNumber })
            .then(result => {
                this.processRecords(result);
                this.error = undefined;
                this.AccNumber = '';
            })
            .catch(error => {
                this.error = error.body.message;
                this.newAccounts = undefined;
                this.AccNumber = '';
            });
    }

    handleClosePopover() {
          this.isPopoverOpen = false;
        const popoverCard = this.template.querySelector('[data-id="popoverCards"]');
        if (popoverCard) {
            popoverCard.style.transform = "translateY(-100%)";
            popoverCard.style.height = "0%";
        }
    }

    handleFilterChange(event) {
        const fieldName = event.currentTarget.dataset.fieldName;
        const value = event.target.value;
         if (fieldName === 'RecordType') {
            this.accountType = value || '';
        } else if(fieldName === 'PhoneNumber'){
            this.PhoneNumber=value||'';
        } else if(fieldName === 'PanCardno'){
           this.PanCardnumber=value||'';
        } else if(fieldName === 'AadharNo'){
            this.AadharNumber=value||'';
        }
    }

    handleFilterApply() {
        this.filterRecFunc();
        this.handleClosePopover();
    }
filterRecFunc() {
        filterrecords({
            recordTypeId: this.accountType , Phoneno:this.PhoneNumber, PanCardno: this.PanCardnumber, AadharNo:this.AadharNumber
        })
            .then(result => {
                this.processRecords(result);
                this.error = undefined;
                this.AccNumber = '';
                this.accountType = '';
            })
            .catch(error => {
                this.error = error.body.message;
                this.newAccounts = undefined;
                this.AccNumber = '';
                this.accountType = '';
            });
    }

clearFilterFields() {
    this.AccNumber = '';
    this.accountType = '';
    this.PhoneNumber='';
    this.PanCardnumber='';
    this.AadharNumber='';
}
   

}