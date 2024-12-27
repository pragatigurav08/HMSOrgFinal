import { LightningElement, track } from 'lwc';
import checkLoanEligibility from '@salesforce/apex/LoanEligibilityControllerNew.checkLoanEligibility';
import  searchAccounts from '@salesforce/apex/LoanApplicationController.searchAccounts';


export default class LoanEligibility extends LightningElement {

    @track showEligibility = false;
    @track errorMessage;
    @track accountId = '';
    @track loanAmount = 0;
    @track customerDetails = null;
    //@track handlePersonalLoan = false;
    @track handlePersonalLoanOpen = false;
    @track searchKey = '';
    @track borrowerName = '';
    @track emailaddress = '';
    @track phoneNumber = '';
    @track goldType = '';
    @track openHomeLoanFormOpen = false;

    @track goldTypeOptions = [
        { label: 'Bars', value: 'Bars' },
        { label: 'Coins', value: 'Coins' },
        { label: 'Jewelry', value: 'Jewelry' }
    ];
   
    @track goldType = ''; 

    @track maritalStatusOptions = [
        
        { label: 'Married', value: 'Married' },
        { label: 'Unmarried', value: 'Divorced' },
       
    ];

    @track maritail = ''; 

    @track idProofOptions = [
        { label: 'Aadhaar Number', value: 'Aadhaar' },
        { label: 'PAN Number', value: 'PAN' },
        { label: 'Voter ID', value: 'VoterID' },
        { label: 'Passport', value: 'Passport' },
        { label: 'Driving License', value: 'DrivingLicense' },
        { label: 'Utility Bill', value: 'UtilityBill' },
        { label: 'Ration Card', value: 'RationCard' }
    ];

    @track selectedIdProofs = [];

    @track maritalStatusOptions1 = [];
    maritalStatusOptions = [
        { label: 'UnMarried', value: 'UnMarried' },
        { label: 'Married', value: 'Married' }
    ];

   maritalStatusOptions1 = this.maritalStatusOptions;

    @track occupationOptions = [
        { label: 'Salaried', value: 'Salaried' },
        { label: 'Self-employed', value: 'Self-employed' },
        { label: 'Unemployed', value: 'Unemployed' },
        { label: 'Student', value: 'Student' },
        { label: 'Retired', value: 'Retired' },
        { label: 'Others', value: 'Others' }
    ];

    @track occupation = '';

    // @track showEligibility = true;

    // @wire(CurrentPageReference)
    // getPageReference(currentPageReference) {
    //     if (currentPageReference) {
    //         // Get the recordId from the URL query parameters
    //         this.recordId = currentPageReference.state.accountId;
    //         console.log('Record ID from URL: ' + this.recordId); // Debugging log
    //         if (this.recordId) {
    //             this.fetchAccountDetail();
    //         } else {
    //             console.log('No recordId found in URL');
    //         }
    //     }
    // }


    personalEligibility() {
        this.showEligibility = true;
    }
    



    handleIdProofChange(event) {
        this.selectedIdProofs = event.detail.value;
    }

    handleGenderChange(event) {
        this.gender = event.detail.value;  // Store selected gender
    }

     handleGoldTypeChange(event) {
        this.goldType = event.detail.value;  // Store selected gold type
    }

    handlemaritailChange(event) {
        this.maritail= event.detail.value;  // Store selected marital status
    }

        handleOccupationChange(event) {
        this.occupation = event.detail.value;  // Store selected occupation
    }

    handleGoldLoanSubmitButtonClick() {
    const newgoldloan = {
        New_Account__c: this.newAccount,
        Loan_Amount__c: this.loanamount,
        Loan_Term_Months__c: this.loantenure,
        Loan_Purpose__c: this.loanpurpose,
        Nationality__c: this.nationality,
        
        Occupation__c: this.occupation,
        Documents__c: this.selectedIdProofs.join(';'), // Multi-select values as semicolon-separated string
        Annual_Income__c: this.income,
        Borrower_s_Name__c: this.borrowerName,
        EmailAddress__c: this.emailaddress,
        Phone_number__c: this.phoneNumber,
        Date_Of_Birth__c: this.dob,
        Marital__c: this.maritail,
        Residential_Address__c: this.address,
        
        Weight_of_Gold__c: this.goldWeight,
        Type_of_Gold__c: this.goldType,
Purity__c:this.goldPurity,
        Reference_1_Name__c: this.referenceName1,
        Reference_2_Name__c: this.referenceName2,
        Reference_1_Contact__c: this.referenceContact1,
        Reference_2_Contact__c: this.referenceContact2
    };
    

   
        
Creategoldloans({ NewLoanRecords: newgoldloan })
            .then(result => {

                console.log('result>>>>>>'+result);
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
    this.borrowerName = '';

    this.dob = '';
    this.selectedIdProofs = '';
    this.maritail = '';
    this.nationality = '';
    this.address = '';
   
    this.phoneNumber = '';
    this.emailaddress = '';
    this.income = '';
    this.loanamount = '';
    this.loantenure = '';
    this.loanpurpose = '';
    this.goldWeight = '';
    this.goldType = '';
    this.referenceName1 = '';
    this.referenceContact1 = '';
    this.referenceName2 = '';
    this.referenceContact2 = '';
    
    this.selectedIdProofs = [];
}

handleSearchTermChange(event) {
    console.debug('Inside handle search term change :::');
        this.searchKey = event.target.value;
        console.log('Search key is :::',this.searchKey);
        if (this.searchKey.length > 0) {
            searchAccounts({ searchTerm: this.searchKey })
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
                    this.errorMessage = 'Error in eligibility check: ' + (error.body?.message || 'Unknown Error');
                    this.customerDetails = null;
                });
        } else {
            this.errorMessage = 'Please provide Account ID and Loan Amount.';
            this.customerDetails = null;
        }
    }

    @track showEligibility = false;

    handleApplyButtonClick() {
        this.showEligibility = false;
        this.handlePersonalLoanOpen = true;
    }

    handleInputChangees(event) {
        const field = event.target.dataset.id;
        this[field] = event.target.value;
    }

    handleBackClick() {
     //   this.showEligibilityChecker = true;
        this.showApplicationForm = false;
    }

    handlereviewinfo(){
        this.reviewinfo=true;
        this.handlePersonalLoanOpen=false;
        this.openHomeLoanFormOpen = false;
    }

    handleBackToForm(){
        this.handlePersonalLoanOpen=true;
        this.reviewinfo = false;
    }

    handleformBackClick(){
        this.showEligibility= true;
        this.handlePersonalLoanOpen = false;
    }



    handlePersonalLoan() {
    console.log('Inside personal loan button :::');
    this.showEligibility = false;
    this.handlePersonalLoanOpen = true;
    console.log('handlePersonalLoanOpen:', this.handlePersonalLoanOpen);
}

    openHomeLoanForm() {
        console.log('open home loan form open');
        this.openHomeLoanFormOpen = true;
        this.showEligibility = true;
        this.openHomeLoanFormOpen = false;
        //this.isPersonalLoanEligible = false;
        //this.customerDetails = false;
       
     }


}