import { LightningElement, track } from 'lwc';
import searchAccounts from '@salesforce/apex/WealthController.searchAccounts';
import getInsurancePolicies from '@salesforce/apex/WealthManagementInsuranceController.getInsurancePolicies';
import getLoansByAccountId from '@salesforce/apex/WealthLoan.getLoansByAccountId';
import calculateTotalRepayment from '@salesforce/apex/WealthLoan.calculateTotalRepayment';
import saveAsset from '@salesforce/apex/WealthController.saveAsset';
import getAssetsByAccountId from '@salesforce/apex/WealthController.getAssetsByAccountId';
//import getAdvisorsByAccountId from '@salesforce/apex/getAdvisorsByAccountId.getAdvisorsByAccountId';
import getFinancialSuggestions from '@salesforce/apex/WealthController.getFinancialSuggestions';
import getAdvisorsByAccountId from '@salesforce/apex/AdvisorController.getAdvisorsByAccountId';
import saveAdvisor from '@salesforce/apex/AdvisorController.saveAdvisor';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class WealthManagementSearch extends NavigationMixin(LightningElement) {
    @track accountRecords = [];  
    @track selectedAccount = {}; 
    @track noResults = false;
    @track isSearchVisible = false; 
    @track showWealth = true;
    @track insurancePolicies = []; 
    @track noInsuranceResults = false; 
    @track loans = []; 
    @track noLoanResults = false; 
    @track totalRepayment; 
    
     @track advisors = []; 
    @track noAdvisorResults = false; 
    @track advisors = []; 
    @track noResults = false; 
    @track advisorDetailsVisible = false;

    
    @track detailsVisible = false;
    @track insuranceDetailsVisible = false; 
    @track loanDetailsVisible = false; 
    @track assetDetailsVisible = false; 
    @track detailsAccountVisible=false;
    @track detailsDocVisible=false;


    handleSearch(event) {
    const searchText = event.target.value.trim(); 
    const accountNumberPattern = /^A-\d{10}$/;

    
    if (accountNumberPattern.test(searchText)) {
       
        searchAccounts({ searchText })
            .then((result) => {
                if (result.length > 0) {
                    this.accountRecords = result;
                    this.selectedAccount = result[0];  
                    this.noResults = false;
                    this.fetchAssets();  
                    this.fetchInsurancePolicies(); 
                    this.fetchLoans();
                    this.fetchAdvisors();
                   
                } 
              if (this.selectedAccount) {
    const annualIncome = this.selectedAccount.Annual_Income__c || 0;  
    const totalBalance = this.selectedAccount.Total_Balance__c || 0; 

   
    this.getFinancialAdvice(annualIncome, totalBalance);
}


                else {
                    this.noResults = true;
                    this.accountRecords = [];
                    this.selectedAccount = {}; 
                    this.insurancePolicies = [];
                    this.noInsuranceResults = false; 
                    this.loans = []; 
                    this.noLoanResults = true;
                    this.assets = [];
                    this.noAssetResults = true; 
                }
            })
            .catch((error) => {
                console.error('Error fetching accounts: ', error);
                this.noResults = true;
                this.accountRecords = [];
                this.selectedAccount = {};
                this.insurancePolicies = [];
                this.noInsuranceResults = false; 
                this.loans = []; 
                this.noLoanResults = true; 
                this.assets = []; 
                this.noAssetResults = true; 
            });
    } else {
        // If the format is incorrect, clear results
        this.accountRecords = [];
        this.selectedAccount = {};
        this.noResults = true;
        this.insurancePolicies = [];
        this.noInsuranceResults = false; 
        this.loans = []; 
        this.noLoanResults = true; 
        this.assets = []; 
        this.noAssetResults = true; 
    }
}


fetchAssets() {
    if (this.selectedAccount.Id) {
        getAssetsByAccountId({ accountId: this.selectedAccount.Id })
            .then((result) => {
                console.log('Fetched Assets:', result); // Log fetched assets
                if (result.length > 0) {
                    this.assets = result;
                    this.noAssetResults = false;
                } else {
                    this.assets = [];
                    this.noAssetResults = true;
                }
            })
            .catch((error) => {
                console.error('Error fetching assets:', error);
                this.assets = [];
                this.noAssetResults = true;
            });
    }
}


getFinancialAdvice(annualIncome, totalBalance) {
    console.log('Annual Income:', annualIncome);  // Log the annual income
    console.log('Total Balance:', totalBalance);  // Log the total balance
    
    // Call the server-side method with both annualIncome and totalBalance
    getFinancialSuggestions({ annualIncome, totalBalance })
        .then((suggestion) => {
            console.log('Financial Suggestion:', suggestion);  // Log the financial suggestion
            this.financialSuggestion = suggestion;  // Store the financial suggestion
        })
        .catch((error) => {
            console.error('Error fetching financial suggestion: ', error);
        });
}


    toggleDetails() {
        this.detailsVisible = !this.detailsVisible;
    }
    toggleDocDetails(){
        this.detailsDocVisible =!this.detailsDocVisible;
    }

    showHome() {
        this.isSearchVisible = true;
        this.showWealth = false;
    }


    fetchInsurancePolicies() {
        if (this.selectedAccount.Id) { // Ensure there's a selected account
            getInsurancePolicies({ accountId: this.selectedAccount.Id })
                .then((result) => {
                    if (result.length > 0) {
                        this.insurancePolicies = result;
                        this.noInsuranceResults = false; // Set flag to false if policies found
                    } else {
                        this.insurancePolicies = []; // Clear if no policies found
                        this.noInsuranceResults = true; // Set flag if no policies
                    }
                })
                .catch((error) => {
                    console.error('Error fetching insurance policies: ', error);
                    this.insurancePolicies = []; // Clear on error
                    this.noInsuranceResults = true; // Set flag if error occurs
                });
        }
    }

     @track totalRepayment = 0; // Track total repayment amount

    // Fetch loan information for the selected account
    fetchLoans() {
        if (this.selectedAccount.Id) {  // Use Id instead of Name for querying
            getLoansByAccountId({ accountId: this.selectedAccount.Id })  // Pass Id to Apex method
                .then((result) => {
                    if (result.length > 0) {
                        this.loans = result;
                         this.noLoanResults = this.loans.length === 0; // Set flag based on loans found
                    return this.calculateTotalRepayment(); // Call to calculate total repayment
                    } else {
                        this.loans = []; // Clear if no loans found
                        this.noLoanResults = true; // Set flag if no loans
                    }
                })
                .catch((error) => {
                    console.error('Error fetching loans: ', error);
                    this.loans = []; // Clear on error
                    this.noLoanResults = true; // Set flag if error occurs
                });
        }
    }
   calculateTotalRepayment() {
    calculateTotalRepayment({ accountId: this.selectedAccount.Id })
        .then((result) => {
            console.log('Total repayment from server: ', result);  // Log the result from Apex
            this.totalRepayment = result; // Store total repayment amount
        })
        .catch((error) => {
            console.error('Error calculating total repayment: ', error);
            this.totalRepayment = 0; // Reset if error occurs
        });
}



    


    toggleInsuranceDetails() {
        this.insuranceDetailsVisible = !this.insuranceDetailsVisible;
    }

    toggleLoanDetails() {
        this.loanDetailsVisible = !this.loanDetailsVisible;
    }


    toggleAccountDetails(){
        this.detailsAccountVisible = !this.detailsAccountVisible;
    }

    @track detailsFinVisible=false;
    toggleFinDetails(){
        this.detailsFinVisible = !this.detailsFinVisible;
    }

    @track detailsVerVisible=false;

    toggleVerDetails(){
        this.detailsVerVisible = !this.detailsVerVisible;
    }

    @track detailsJointVisible=false;
    toggleJointDetails(){
        this.detailsJointVisible=!this.detailsJointVisible;
    }

    @track advisorDetailsVisible = false;

toggleAdvisorDetails() {
    this.advisorDetailsVisible = !this.advisorDetailsVisible; // Toggle visibility
}


 
    

// Example of showToast method
showToast(title, message, variant) {
    const event = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant,
    });
    this.dispatchEvent(event);
}

// Example of closeModal method
closeModal() {
    this.isModalOpen = false;
}


   @track isModalOpen = false;
    @track assetName = '';
    @track description = '';
    @track amount = '';

    // Open the modal
    openAssetModal() {
        this.isModalOpen = true;
    }

    // Close the modal and clear the form
    closeAssetModal() {
        this.isModalOpen = false;
        this.clearForm();
    }

   

    // Clear form fields
    clearForm() {
         this.isModalOpen = false;
        this.assetName = '';
        this.description = '';
        this.amount = '';
    }


    // Show toast message
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
    // Reset input fields after saving
    resetFields() {
       
        this.isModalOpen = false;
         
    }

     @track assets = [];           
    @track noAssetResults = false; 
    assetDetailsVisible = false;  

   
    toggleAssetDetails() {
        this.assetDetailsVisible = !this.assetDetailsVisible;
    }

 // Method to save assets using async/await
handleSaveAssets() {
    console.log("Save button clicked");

    const assetData = {
        assetName: this.assetName,
        description: this.description,
        amount: this.amount,
        accountId: this.selectedAccount.Id
    };

    saveAsset({ asset: assetData })
        .then(() => {
            console.log("Asset saved successfully");
            this.showToast('Success', 'Assets saved successfully', 'success');
            this.clearForm();
            // Call fetchAssets directly to refresh data
            return this.fetchAssets(); 
        })
        .catch(error => {
            console.error('Error saving asset:', error);
            this.showToast('Error', 'Failed to save asset: ' + error.body.message, 'error');
        });
}


fetchAssets() {
    if (this.selectedAccount && this.selectedAccount.Id) {
        getAssetsByAccountId({ accountId: this.selectedAccount.Id })
            .then((result) => {
                this.assets = result; 
                this.noAssetResults = result.length === 0; 
            })
            .catch((error) => {
                console.error('Error fetching assets: ', error);
                this.assets = [];
                this.noAssetResults = true;
            });
    }
}

   @track advisorName;
    @track emailAddress;
    @track phoneNumber;
   // @track assetsUnderManagement;
    @track specialization;
    @track newAccountId; // To store selected New_Account__c Id
    @track specializationOptions = [
        { label: 'Retirement Planning', value: 'Retirement Planning' },
        { label: 'Investment Management', value: 'Investment Management' },
        { label: 'Loan Management', value: 'Loan Management' },
        { label: 'Assets Management', value: 'Assets Management' },
        { label: 'Tax Planning', value: 'Tax Planning' },
        { label: 'Insurance', value: 'Insurance' }
    ];
    @track accountOptions = [];
    @track isAdvisorModalOpen = false; // Modal visibility flag

   

    // Open the modal
    openAdvisorModal() {
        this.isAdvisorModalOpen = true;
    }

    // Close the modal
    closeAdvisorModal() {
        this.advisorName='';
        this.emailAddress='';
        this.specialization='';
        this.isAdvisorModalOpen = false;
    }

   handleInputChange(event) {
    const field = event.target.dataset.field;  // Get the field name from data-field

    // Handle fields dynamically with specific logic for each field
    if (field === 'advisorName') {
        this.advisorName = event.target.value;
    } else if (field === 'emailAddress') {
        this.emailAddress = event.target.value;
    } else if (field === 'specialization') {
        this.specialization = event.target.value;
    } else if (field === 'newAccountId') {
        this.newAccountId = event.target.value;
    } else if (field === 'assetName') {
        this.assetName = event.target.value;
    } else if (field === 'description') {
        this.description = event.target.value;
    } else if (field === 'amount') {
        this.amount = event.target.value;
    }
}


        fetchAdvisors() {
        if (this.selectedAccount && this.selectedAccount.Id) {
            getAdvisorsByAccountId({ accountId: this.selectedAccount.Id })
                .then((result) => {
                    this.advisors = result; // Store fetched advisors
                    this.noAdvisorResults = this.advisors.length === 0; // Check if no advisors found
                })
                .catch((error) => {
                    console.error('Error fetching advisors:', error);
                    this.advisors = []; // Clear advisors on error
                    this.noAdvisorResults = true; // Set flag indicating no advisors due to error
                });
        }
    }

    handleSaveAdvisor() {
    const advisorData = {
        advisorName: this.advisorName, // Ensure these properties exist
        emailAddress: this.emailAddress,
        //phoneNumber: this.phoneNumber,
       // assetsUnderManagement: this.assetsUnderManagement,
        specialization: this.specialization,
        newAccountId: this.selectedAccount.Id // Ensure selectedAccount is set
    };

    saveAdvisor({ advisor: advisorData })
        .then(() => {
            this.showToast('Success', 'Advisor saved successfully', 'success');
            this.closeAdvisorModal();
            this.fetchAdvisors(); // Refresh the advisor list
        })
        .catch(error => {
            this.showToast('Error', 'Failed to save advisor: ' + error.body.message, 'error');
        });
}

navigateToNewPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/loan-management' // Replace with your target URL
            }
        });
    }

navigateToInsurancePage(){
     this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/insurance-management' // Replace with your target URL
            }
        });

}


    
   

}