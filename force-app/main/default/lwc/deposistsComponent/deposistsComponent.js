import { LightningElement, track, wire } from 'lwc';
import insertnewdeposists from '@salesforce/apex/DeposistsRecordCreation.Createnewdeposits';
import getAccountRecordTypes from '@salesforce/apex/DeposistsRecordCreation.getAccountRecordTypes';
import searchAccounts from '@salesforce/apex/DeposistsRecordCreation.searchAccounts';
import getAccountDetails from '@salesforce/apex/DeposistsRecordCreation.getAccountDetails';
import searchBranches from '@salesforce/apex/DeposistsRecordCreation.searchBranches';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // To show toast messages

export default class DepositsComponent extends LightningElement {
    @track existingAccount = false;
    @track newAccount = '';
    @track interestRate = '';
    @track firstName = '';
    @track lastName = '';
    @track amount = '';
    @track tenure = '';
    @track panCardNo='';
    @track phoneNumber = '';
    @track accountType = '';  
    @track accountTypeOptions = [];
    @track typeOfDeposit = '';  
    @track searchKey = '';
    @track searchK = '';
    @track accounts = [];  // Search result data
    @track branches=[];
    @track openDate = '';
    @track HomeBranch='';
    @track selectedAccountId;
    // Fetching Account Record Types from Apex
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

    // Handling account  change
    handleAccountTypeChange(event) {
        this.accountType = event.target.value;
    }

    // Handling search term for account search
    handleSearchTermChange(event) {
        this.searchKey = event.target.value;
        console.log('handleSearchTermChange>>');
        if (this.searchKey.length > 2) {
            // Call Apex method to search for accounts if the input is 3 characters or more
            searchAccounts({ searchTerm: this.searchKey })
                .then(result => {
                    this.accounts = result;
                })
                .catch(error => {
                    console.error('Error searching accounts:', error);
                });
        } else {
            this.accounts = null;  // Clear results when input is less than 3 characters
             this.clearFields();
        }
        
    }
    handleBranchChange(event) {
        this.searchK = event.target.value;
        console.log('handleBranchChange>>');
        if (this.searchK.length > 2) {
            // Call Apex method to search for branches if the input is 3 characters or more
            searchBranches({ searchT : this.searchK })
                .then(result => {
                    this.branches = result;
                })
                .catch(error => {
                    console.error('Error searching branches:', error);
                });
        } else {
            this.branches = null;  // Clear results when input is less than 3 characters
        }
    }


    handleAccountSelect(event) {

        console.log('handleAccountSelect>>');
        const selectedAccountId = event.currentTarget.dataset.id;
        const selectedAccountName = event.currentTarget.innerText;

        // Fire an event with the selected account details
        const selectedEvent = new CustomEvent('accountselect', {
            detail: { accountId: selectedAccountId, accountName: selectedAccountName }
        });

        this.dispatchEvent(selectedEvent);

        this.accounts = null;
        this.searchKey = selectedAccountName;  
        this.newAccount = selectedAccountId;
         this.fetchAccountDetails(this.newAccount);
    }
   

    fetchAccountDetails(accountId) {
        getAccountDetails({ accountId })
            .then((result) => {
                // Check if any account is returned
                if (result && result.length > 0) {
                    const account = result[0]; // Get the first account from the list
                    this.firstName = account.FirstName__c; // Access fields
                    this.lastName = account.Last_Name__c;
                    this.panCardNo = account.PANCardNo__c;//PANCardNo__c
                    this.phoneNumber = account.Phone_number__c;
                } else {
                    // Handle case where no account is found
                    console.warn('No account found for the selected ID.');
                    this.clearFields(); // Optional: Clear fields if no account found
                }
            })
            .catch((error) => {
                console.error('Error fetching account details:', error);
            });
    }

    clearFields() {
        this.firstName = '';
        this.lastName = '';
        this.panCard = '';
        this.phoneNumber = '';
    }

   


     handleBranchSelect(event) {
        const selectedBranchId = event.currentTarget.dataset.id;
        const selectedBranchName = event.currentTarget.innerText;

      
        const selectedEvent = new CustomEvent('branchselect', {
            detail: { branchId: selectedBranchId, branchName: selectedBranchName }
        });

        this.dispatchEvent(selectedEvent);

        this.branches = null;
        this.searchK = selectedBranchName;  
        this.HomeBranch = selectedBranchId; 
    }

    // Handle input change for various fields
    handleInputChange(event) {
        const field = event.target.dataset.id;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this[field] = value;

    
    }

    // Save new deposit record
    handleSave() {

         const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputCmp) => validSoFar && inputCmp.reportValidity(), true);

            if (!allValid) {
            this.showToast('Error', 'Please complete all required fields.', 'error');
            return;
        }
    const today = new Date().toISOString().split('T')[0]; // Format date to yyyy-mm-dd

    console.log('Today:', today);
    console.log('Open Date:', this.openDate);

    // Check if the openDate is today
    if (this.openDate !== today) {
        console.log('openDate validation>>>');
        this.showToast('Error', 'Open date should be today.', 'error');
        console.warn('Open date is not today:', this.openDate); // Debugging output
        return;
    }

    

        const newdeposit = {
            First_Name__c: this.firstName,  
            Last_Name__c: this.lastName,  
            Phone_number__c: this.phoneNumber,
            Existing_Account__c: this.existingAccount,
            New_Account__c: this.newAccount,
            Tenure_In_Months__c: this.tenure,
            Interest_Rate__c: this.interestRate,
            Type_Of_Deposits__c: this.typeOfDeposit,
            Amount__c: this.amount,
            RecordTypeId: this.accountType,
            Home_Branch__c:this.HomeBranch,
            PANCardNo__c:this.panCardNo,
            Open_Date__c:this.openDate
        };
  console.log('New Deposit Record:', JSON.stringify(newdeposit));
        insertnewdeposists({ NewDepositeRecords : newdeposit })
            .then(result => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Deposited successfully',
                        variant: 'success'
                    })
                );

                // Clear the form after successful insertion
                this.clearForm();
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

    showToast(title, message, variant) {
    const event = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant,
    });
    this.dispatchEvent(event);
}

    // Utility method to clear the form fields after save
    clearForm() {
        this.firstName = '';
        this.lastName = '';
        this.phoneNumber = '';
        this.existingAccount = false;
        this.newAccount = '';
        this.tenure = '';
        this.interestRate = '';
        this.typeOfDeposit = '';
        this.amount = '';
        this.accountType = '';
        this.searchKey = '';
        this.searchK='';
        this.panCardNo='';
        this.openDate = '';
    }
    handleClear(){
         this.firstName = '';
        this.lastName = '';
        this.phoneNumber = '';
        this.existingAccount = false;
        this.newAccount = '';
        this.tenure = '';
        this.interestRate = '';
        this.typeOfDeposit = '';
        this.amount = '';
        this.accountType = '';
        this.searchKey = '';
        this.searchK='';
        this.panCardNo='';
        this.openDate = '';
    }
}