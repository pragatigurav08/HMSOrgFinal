import { LightningElement, track } from 'lwc';
import SearchAccounts from '@salesforce/apex/WithdrawalRecordCreation.searchAccounts';
import getAccountDetails from '@salesforce/apex/DeposistsRecordCreation.getAccountDetails';
import getBranchDetails from '@salesforce/apex/WithdrawalRecordCreation.searchBranches';
import insertwithdrawalrecord from '@salesforce/apex/WithdrawalRecordCreation.WithdrawalRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class WithdrawalComponent extends LightningElement {
    @track withdrawalName = '';
    @track searchKey = '';
    @track searchBranch = '';
    @track accounts = [];
    @track branches = [];
    @track accountType = '';
    @track withdrawalPerson = '';
    @track withdrawalDate = '';
    @track amount = '';
    @track firstName = '';
    @track lastName = '';
    @track phoneNumber = '';
    @track selectedAccountId;
    @track searchK = '';
    @track newAccount = '';
    @track HomeBranch = ''; // Ensure this is tracked
    @track notpopulate=false;

    // Combobox options for withdrawal person
    get withdrawalPersonOptions() {
        return [
            { label: 'Account Holder', value: 'Account Holder' },
            { label: 'Guardian', value: 'Guardian' }
        ];
    }

    handleInputChange(event) {
        const field = event.target.dataset.id;
        this[field] = event.target.value;

        if (field === 'withdrawalPerson' && this.withdrawalPerson === 'Guardian' &&  this.notpopulate == true) {
            this.firstName = '';
            this.lastName = '';
            this.phoneNumber = '';
            console.log('handleInputChange>>>>guardian');
        }else if (this.withdrawalPerson == 'Account Holder' && this.newAccount) {
            this.populateAccountDetails(this.newAccount);
            console.log('handleInputChange>>>>account holder');
        }
    }
    //   populateAccountDetails(accountId) {
    //     getAccountDetails({ accountId: accountId })
    //         .then((result) => {
    //             if (result.length > 0) {
    //                 let account = result[0];
    //                 this.firstName = account.FirstName__c;
    //                 this.lastName = account.Last_Name__c;
    //                 this.phoneNumber = account.Phone_number__c;
    //             }
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching account details:', error);
    //         });
    // }

    handleSearchTermChange(event) {
        this.searchKey = event.target.value;
        if (this.searchKey.length > 2) {
            SearchAccounts({ searchTerm: this.searchKey })
                .then(result => {
                    this.accounts = result;
                })
                .catch(error => {
                    console.error('Error searching accounts:', error);
                });
        } else {
            this.accounts = null;
            
        }
    }

    handleBranchChange(event) {
        this.searchK = event.target.value;
        if (this.searchK.length > 2) {
            getBranchDetails({ searchT: this.searchK })
                .then(result => {
                    this.branches = result;
                })
                .catch(error => {
                    console.error('Error searching branches:', error);
                });
        } else {
            this.branches = null;
        }
    }

    handleAccountSelect(event) {
        const selectedAccountId = event.currentTarget.dataset.id;
        const selectedAccountName = event.currentTarget.innerText;
        this.accounts = null;
        this.searchKey = selectedAccountName;
        this.newAccount = selectedAccountId;
      // this.populateAccountDetails(this.newAccount);
        if (this.withdrawalPerson == 'Account Holder' && this.newAccount) {
            this.populateAccountDetails(this.newAccount);
            console.log('handleAccountSelect>>>>if block');
        }
    }

    populateAccountDetails(accountId) {
        console.log('populateAccountDetails>>>>');
        getAccountDetails({ accountId: accountId })
            .then((result) => {
                if (result.length > 0) {
                    let account = result[0];
                    this.firstName = account.FirstName__c;
                    this.lastName = account.Last_Name__c;
                    this.phoneNumber = account.Phone_number__c;
                    this.notpopulate=true;
                }
            })
            
            .catch((error) => {
                console.error('Error fetching account details:', error);
            });
    }

    handleBranchSelect(event) {
        const selectedBranchId = event.currentTarget.dataset.id;
        const selectedBranchName = event.currentTarget.innerText;
        this.branches = null;
        this.searchK = selectedBranchName;
        this.HomeBranch = selectedBranchId;
    }


    handleSave() {
        const withdraw = {
            First_Name__c: this.firstName,
            Last_Name__c: this.lastName,
            Phone_number__c: this.phoneNumber,
            New_Account__c: this.newAccount,
            Withdrawal_Person__c: this.withdrawalPerson,
            Name: this.withdrawalName,
            Amount__c: this.amount,
            Home_Branch__c: this.HomeBranch,
            Date_Of_Withdrawal__c: this.withdrawalDate
        };

        insertwithdrawalrecord({ withdrawmoney: withdraw })
            .then(result => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Money Withdraw successfull',
                        variant: 'success'
                    })
                );
                this.handleClear();
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
    
    handleClear() {
        this.withdrawalName = '';
        this.searchKey = '';
        this.searchBranch = '';
        this.accounts = [];
        this.branches = [];
        this.accountType = '';
        this.withdrawalPerson = '';
        this.withdrawalDate = '';
        this.amount = '';
        this.firstName = '';
        this.lastName = '';
        this.phoneNumber = '';
        this.searchK='';
    }
}