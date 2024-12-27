import { LightningElement, track, wire } from 'lwc';
import checkLoanEligibility from '@salesforce/apex/LoanEligibilityController.checkLoanEligibility';
import CreateHomeloans from '@salesforce/apex/LoanApplicationController.CreateHomeloans';
import getAccounts from '@salesforce/apex/LoanApplicationController.getAccounts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAccountDetails from '@salesforce/apex/DeposistsRecordCreation.getAccountDetails';
import { CurrentPageReference } from 'lightning/navigation';
import getAccountId from '@salesforce/apex/AccountRelationshipController.getAccountDetails';
export default class HomeLoanForm extends LightningElement {


   
    @track accountDetails;
    @track recordId;
    @track showEligibilityChecker = true;
    @track showLoanForm = false;

    // Wire the CurrentPageReference to get URL parameters
    @wire(CurrentPageReference)
    getPageReference(currentPageReference) {
        if (currentPageReference) {
            // Get the recordId from the URL query parameters
            this.recordId = currentPageReference.state.accountId;
            console.log('Record ID from URL: ' + this.recordId); // Debugging log
            if (this.recordId) {
                this.fetchAccountDetail();
            } else {
                console.log('No recordId found in URL');
            }
        }
    }
    fetchAccountDetail() {
        getAccountId({ accountId: this.recordId })
            .then(result => {
                console.log('Account Details:', result); // Debugging log
                this.accountDetails = result; // Corrected property assignment
                this.error = undefined;
                this.personaldetails();
            })
            .catch(error => {
                console.log('Error fetchinaccount details:', error); // Debugging log
                //console.log('Error fetching account details:::', error);
                this.error = error;
                this.accountDetails = undefined;
            });
    }
    personaldetails() {
        this.accountId = this.accountDetails.Name;
        this.newAccount = this.accountDetails.Id;
        this.fetchAccountDetails(this.newAccount);
        
    }

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
    

    // Method for back button to return to eligibility checker
    handleBackClick() {
        this.isPersonalLoanSelected = false;  // Show eligibility checker
    }
    ////handle form here 
    @track showEligibilityChecker = true; // Initially show the loan eligibility checker
    @track showApplicationForm = false;  // Initially hide the application form
    // @track customerDetails;
    @track errorMessage;
    @track accountId = '';
    @track loanAmount = '';
    @track searchKey = '';
    @track borrowerName = '';
    @track emailaddress = '';
    @track phoneNumber = '';
    @track dob = '';
    @track nationality = '';
    @track address = '';
    @track maritail = '';
    @track occupation = '';
    @track selectedIdProofs = [];
    @track loanamount = '';
    @track loanpurpose = '';
    @track loantenure = '';
    @track income = '';
    @track gender = '';
    @track propertyAddress = '';
    @track propertyType = '';
    @track propertyValue = '';
    @track builderName = '';
    @track propertyStage = '';
    @track propertyOwnership = '';

    // Toggle between views
    handleApplyButtonClick() {
        this.showEligibilityChecker = false;
        this.showApplicationForm = true;
    }

    handleBackClick() {
        this.showEligibilityChecker = true;
        this.showApplicationForm = false;
    }

    

    handleSearchTermChange(event) {
        this.searchKey = event.target.value;
    }

    handleInputChangees(event) {
        const field = event.target.dataset.id;
        this[field] = event.target.value;
    }

    handleIdProofChange(event) {
        this.selectedIdProofs = event.detail.value;
    }


    occupationOptions = [
        { label: 'Salaried', value: 'Salaried' },
        { label: 'Self-employed', value: 'Self-employed' },
        { label: 'Unemployed', value: 'Unemployed' },
        { label: 'Student', value: 'Student' },
        { label: 'Retired', value: 'Retired' },
        { label: 'Others', value: 'Others' }
    ];

    documentsOptions = [
        { label: 'PAN Card', value: 'PAN_Card' },
        { label: 'Aadhar Card', value: 'Aadhar_Card' },
        { label: 'Driver’s License', value: 'Drivers_License' },
        { label: 'Passport', value: 'Passport' }
    ];
    @track idProofOptions = [
        { label: 'Aadhaar Number', value: 'Aadhaar' },
        { label: 'PAN Number', value: 'PAN' },
        { label: 'Voter ID', value: 'VoterID' },
        { label: 'Passport', value: 'Passport' },
        { label: 'Driving License', value: 'DrivingLicense' },
        { label: 'Utility Bill', value: 'UtilityBill' },
        { label: 'Ration Card', value: 'RationCard' }
    ];
    propertyTypeOptions = [
        { label: 'Flat', value: 'Flat' },
        { label: 'Independent House', value: 'Independent House' },
        { label: 'Plot', value: 'Plot' }
    ];

    propertyStageOptions = [
        { label: 'Under Construction', value: 'Under Construction' },
        { label: 'Ready to Move', value: 'Ready to Move' }
    ];

    ownershipOptions = [
        { label: 'Sole', value: 'Sole' },
        { label: 'Joint', value: 'Joint' }
    ];
    @track searchKey = '';
    @track accounts = [];

    handleSearchTermChange(event) {
        this.searchKey = event.target.value;
        if (this.searchKey.length > 0) {
            getAccounts({ searchTerm: this.searchKey })
                .then(result => {
                    this.accounts = result;
                })
                .catch(error => {
                    console.error('Error searching accounts:', error);
                });
        } else {
            this.accounts = [];
        }
    }

    handleAccountSelect(event) {
        const selectedAccountId = event.currentTarget.dataset.id;
        const selectedAccountName = event.currentTarget.innerText;

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
                if (result && result.length > 0) {
                    const account = result[0]; // Get the first account from the list                   
                    this.borrowerName = account.FirstName__c; // Access fields           
                    this.phoneNumber = account.Phone_number__c;
                    this.dob = account.DateOfBirth__c;
                    this.address = account.CommunicationResidentAddress__c;
                    this.nationality = account.Nationality__c;
                    this.income = account.Annual_Income__c;
                    console.log('fetchAccountDetails>>>>result' + account);
                } else {

                    console.warn('No account found for the selected ID.');
                    this.clearFields(); // Optional: Clear fields if no account found      
                }
            })
            .catch((error) => {
                console.error('Error fetching account details:', error);
            });
    }
    handleHomeLoanSubmitButtonClick() {
        const newloans = {
            New_Account__c: this.newAccount,
            Loan_Amount__c: this.loanamount,
            Loan_Term_Months__c: this.loantenure,
            Loan_Purpose__c: this.loanpurpose,
            Nationality__c: this.nationality,
            Occupation__c: this.occupation,
            Documents__c: this.documents,
            Annual_Income__c: this.income,
            Documents__c: this.selectedIdProofs.join(';'),
            Borrower_s_Name__c: this.borrowerName,
            EmailAddress__c: this.emailaddress,
            Phone_number__c: this.phoneNumber,
            Date_Of_Birth__c: this.dob,
            Marital__c: this.maritail,
            Residential_Address__c: this.address,
            Property_Address__c: this.propertyAddress,
            Property_Ownership__c: this.propertyOwnership,
            Stage_of_Property__c: this.propertyStage,
            Type_of_Property__c: this.propertyType,
            Estimated_Property_Value__c: this.Estimated_Property_Value__c,
            Builder_Developer_Name__c: this.builderName


        };

        CreateHomeloans({ NewHomeLoanRecords: newloans })
            .then(result => {

                console.log('result>>>>>>' + result);
                this.showToast('Success', 'Loan Application successfully submitted!', 'success');
                this.clearForm();
            })
            this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/accountdetails?recordId=`+accid
            }
            })
            .catch(error => {
                console.error('Error saving loan record:', error);
                this.showToast('Error', 'Failed to save the loan record. Please try again.', 'error');
            });
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    clearForm() {
        this.newAccount = '';
        this.loanamount = '';
        this.loantenure = '';
        this.loanpurpose = '';
        this.nationality = '';
        this.occupation = '';
        this.documents = '';
        this.income = '';
        this.borrowerName = '';
        this.dob = '';
        this.emailaddress = '';
        this.phoneNumber = '';
        this.maritail = '';
        this.address = '';
        this.searchKey = '';
        this.selectedIdProofs = [];
        this.isSubmitted = false;
    }
    handlereviewinfo() {
        this.reviewinfo = true;
        this.showApplicationForm = false;
    }
    handleBackToForm() {
        this.showApplicationForm = false;
    }

}