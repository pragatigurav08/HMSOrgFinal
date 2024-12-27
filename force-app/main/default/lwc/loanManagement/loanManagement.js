import { LightningElement, track, api, wire } from 'lwc';
import getLoansByAccountNumber from '@salesforce/apex/getAccountNumberFromLoan.getLoansByAccountNumber';
import Createnewloans from '@salesforce/apex/LoanApplicationController.Createnewloans';
import searchAccounts from '@salesforce/apex/LoanApplicationController.searchAccounts';
import getAccountDetails from '@salesforce/apex/DeposistsRecordCreation.getAccountDetails';
import getAccountId from '@salesforce/apex/AccountRelationshipController.getAccountDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';
import checkLoanEligibility from '@salesforce/apex/LoanEligibilityController.checkLoanEligibility';
import getCustomerData from '@salesforce/apex/LoanEligibilityController.getCustomerData';
//import getLoansByAccountId from '@salesforce/apex/WealthLoan.getLoansByAccountId';
import { NavigationMixin } from 'lightning/navigation';
const loanPurposeOptions = [
    { label: 'Home Renovation', value: 'Home_Renovation' },
    { label: 'Medical Expenses', value: 'Medical_Expenses' },
    { label: 'Education', value: 'Education' }
];

const maritalStatusOptions = [
    { label: 'UnMarried', value: 'UnMarried' },
    { label: 'Married', value: 'Married' }
];




export default class LoanManagement extends NavigationMixin(LightningElement) {
    @track isFormVisible = false; // To control the visibility of the form
    @track isPersonalLoanSelected = false; // Controls the personal loan page visibility
    @track newAccount = '';
    @track loanamount = '';
    @track loanpurpose = '';
    @track loantenure = '';
    @track nationality = '';
    @track address = '';
    @track borrowerName = '';
    @track income = '';
    @track emailaddress = '';
    @track phoneNumber = '';
    @track dob = '';
    @track maritail = '';
    @track occupation = '';
    @track documents = '';
    @track idProofOptions = [];
    @track selectedIdProofs = [];
    @track reviewinfo = false;
    @track PersonalLoanForm = false;
    @track openHomeLoan = false;
    
  
    @track customerDetails;
    @track errorMessage;
    @track openLoan;
    @track accountDetails;
    @track recordId;
    @track showModalKnow = false;
    @track showAadhar = false;


    @track isModalOpen = false;
    @track isLoanOptionsVisible = false;
    @track selectedLoanType = '';
    @track loanOptions = [
        { label: 'Personal Loan', value: 'personal' },
        { label: 'Home Loan', value: 'home' },
        { label: 'Gold Loan', value: 'gold' }
    ];

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
    

    // Open the modal
    openModal() {
        this.isModalOpen = true;
        this.isLoanOptionsVisible = false;
    }

    // Close the modal
    closeModal() {
        this.isModalOpen = false;
        this.isLoanOptionsVisible = false;
    }

    // Handle loan type change
    handleLoanTypeChange(event) {
        this.selectedLoanType = event.detail.value;
        //this.isLoanOptionsVisible = true;
    }

    // Handle loan selection
    handleLoanSelect() {
        if (this.selectedLoanType === 'personal') {
            console.log('personal loan selected:::');
            this.handlePersonalLoanClick();

        } else if (this.selectedLoanType === 'home') {
            console.log('home loan selected:::');
            this.handleHomeLoanClick();

        } else if (this.selectedLoanType === 'gold') {
            console.log('gold loan selected:::');
            this.handleGoldLoanClick();
        }
        this.closeModal();
    }

    



    handlePersonalLoanClick() {

        console.log('handle personal loan click ::');

        this.isFormVisible = false;

        this.isPersonalLoanSelected = true;
        this.openHomeLoan = false;
        this.isFormVisible = false;
        this.calculateEMI();
    }

    // Method to call Apex class and get account details

   handleHomeLoanClick() {

    console.log('Inside home loan click :::');
    
    // Hide the home loan form when the user clicks "Check Eligibility"
    this.isFormVisible = false; // This hides the eligibility form.
    
    // Set flags to manage the UI state (you can modify these flags based on your needs)
    this.isPersonalLoanSelected = false;  // Assuming you're switching from Personal Loan selection
    this.openHomeLoan = true;  // Home loan form is no longer visible
    this.isFocalculateEMIrmVisible = true;  // Optionally, make EMI calculation visible

    // Call the eligibility check method for Home Loan
    this.checkEligibilityHome();  // This triggers the eligibility calculation logic.

    // Call EMI calculation logic (if necessary)
    this.calculateEMI();
    
}



    // handlePersonalizednavigatehomeclick(){
    //      const accountsId = this.accountDetails?.Id;
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__webPage',
    //         attributes: {
    //             url: 'https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/homeloan?accountId='+accountsId
    //         }
    //     });
    // }

    handlenavigategoldclick(){
        const accountsId = this.accountDetails?.Id;
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/goldloan'
            }
        });
    }

    handlePersonalizednavigategoldclick(){
         const accountsId = this.accountDetails?.Id;
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/goldloan?accountId='+accountsId
            }
        });
    }
    openModal1() {
        this.showModalKnow = true;
    }

    // Method to close the modal
    closeModal1() {
        this.showModalKnow = false;
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
    console.log('after click check eligibility::::');

    // Ensure accountId and loanAmount are provided
    if (this.accountId && this.loanAmount) {
        console.log('Inside if condition ::: ');

        // Call the Apex method
        checkLoanEligibility({ accountId: this.accountId, loanAmount: this.loanAmount })
            .then(result => {
                // Log the entire result for debugging
                console.log('Full result object:', JSON.stringify(result, null, 2));

                // Check if the result is not undefined and has expected properties
                if (result && typeof result === 'object') {
                    console.log('Annual income inside customer details :::', result.annualIncome);
                    console.log('Interest rate inside customer details :::', result.interestRate);
                    console.log('Eligibility message inside customer details :::', result.message);
    
    // Now assigning the values to customerDetails object
    this.customerDetails = {
        annualIncome: result.annualIncome,
        interestRate: result.interestRate,
        eligibilityMessage: result.eligible ? 'Eligible' : result.message
    };

                    // Log the customer details
                    console.log('Customer Details:', JSON.stringify(this.customerDetails, null, 2));
                } else {
                    console.warn('Unexpected result format or empty response:', JSON.stringify(result));
                    this.errorMessage = 'No valid data received from server';
                    this.customerDetails = null;
                }
            })
            .catch(error => {
                // Enhanced error handling with Proxy workaround
                console.error('Error in eligibility check:', error);

                // Attempt to log the full error object if it's a Proxy
                try {
                    console.log('Full error details:', JSON.stringify(error, null, 2));
                } catch (proxyError) {
                    console.warn('Error object is a Proxy and could not be stringified:', proxyError);
                    console.dir(error); // Use console.dir for Proxy objects
                }

                // Check if the error has a body and message property
                if (error && error.body && error.body.message) {
                    this.errorMessage = 'Error in eligibility check: ' + error.body.message;
                } else {
                    this.errorMessage = 'An unknown error occurred while checking eligibility.';
                }
                this.customerDetails = null;
            });
    } else {
        console.warn('Missing Account ID or Loan Amount');
        //this.errorMessage = 'Please provide Account ID and Loan Amount.';
        this.customerDetails = null;
    }
}



    PersonalizedcheckEligibility() {
        this.errorMessage = null;
        this.customerDetails = null;
         console.log('PersonalizedcheckEligibility>>>>>>');
        checkLoanEligibility({ accountId: this.accountId, loanAmount: this.loanAmount })
            .then(result => {
                if (result.errorMessage) {
                    this.errorMessage = result.errorMessage;
                } else {
                    this.customerDetails = result;
                    console.log('this.customerDetails>>>'+JSON.stringify(this.customerDetails));
                }
            })
            .catch(error => {
                this.errorMessage = 'An unexpected error occurred: ' + JSON.stringify(error);
            });
    }



    fetchAccountDetail() {
        getAccountId({ accountId: this.recordId })
            .then(result => {
                console.log('Account Details:', result); // Debugging log
                this.accountDetails = result; // Corrected property assignment
                this.error = undefined;
                this.persnaldetails();
            })
            .catch(error => {
                console.log('Error fetchinaccount details:', error); // Debugging log
                this.error = error;
                this.accountDetails = undefined;
            });
    }
    persnaldetails() {
        this.accountId = this.accountDetails.Name;
        this.newAccount = this.accountDetails.Id;
        this.fetchAccountDetails(this.newAccount);
        // this.phoneNumber=this.accountDetails.Phone_number__c;
        // this.dob=this.accountDetails.DateOfBirth__c;
        // this.borrowerName=this.accountDetails.FirstName__c;
    }
    toggleAadharVisibility() {
        this.showAadhar = !this.showAadhar;

    }
    get displayAadharCardno() {
        return this.showAadhar ? this.accountDetails.Aadhar_Number__c : '********' + this.accountDetails.Aadhar_Number__c.slice(-4);
    }
    @track homeloanform = true;
    handleAccountIdChange(event) {
        this.accountId = event.target.value;
    }

    handleLoanAmountChange(event) {
        this.loanAmount = event.target.value;
    }

   
    @track isModalOpen = false;

    handleOpenModal() {
        this.isModalOpen = true;
    }

    handleCloseModal() {
        this.isModalOpen = false;
    }
    

    loanPurposeOptions = loanPurposeOptions;
    maritalStatusOptions = maritalStatusOptions;
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

    handleIdProofChange(event) {
        this.selectedIdProofs = event.detail.value;
    }

    handleBackToForm() {
        this.reviewinfo = false;
        this.PersonalLoanForm = true;
    }
    handleBackClick() {
        this.isPersonalLoanSelected = false;
    }
    handleformBackClick() {
        this.isFormVisible = false;
        this.PersonalLoanForm = false;
        //   this.isFormVisible = true
    }


    handlereviewinfo() {
        this.reviewinfo = true;
        this.PersonalLoanForm = false;
    }
    // EMI calculator variables
    @track loanAmount = 50000; // Initial value for loan amount
    @track tenure = 12;        // Initial value for tenure
    @track interestRate = 10.85; // Initial value for interest rate
    @track emi = 0;            // Calculated EMI
    @track totalInterestPayable = 0; // Calculated Total Interest Payable

    // Formula to calculate EMI
    calculateEMI() {
        const principal = this.loanAmount;
        const annualRate = this.interestRate / 100;
        const monthlyRate = annualRate / 12;
        const months = this.tenure;

        // EMI formula
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
        this.emi = Math.round(emi);

        // Total Interest Payable
        const totalAmountPayable = this.emi * months;
        this.totalInterestPayable = Math.round(totalAmountPayable - principal);
    }

    // Event handlers for sliders
    handleLoanAmountChange(event) {
        this.loanAmount = event.target.value;
        this.calculateEMI();
    }

    handleTenureChange(event) {
        this.tenure = event.target.value;
        this.calculateEMI();
    }

    handleInterestRateChange(event) {
        this.interestRate = event.target.value;
        this.calculateEMI();
    }

    connectedCallback() {
        this.calculateEMI(); // Calculate EMI on initial load
    }


    @track accountNumber = '';
    @track loansData;
    @track noResults = false;

    handleInputAccountChange(event) {
        this.accountNumber = event.target.value;
    }

    handleSearch() {
        if (this.accountNumber) {
            getLoansByAccountNumber({ accountNumber: this.accountNumber })
                .then(result => {
                    if (result.length > 0) {
                        this.loansData = result;
                        this.noResults = false;
                    } else {
                        this.loansData = null;
                        this.noResults = true;
                    }
                })
                .catch(error => {
                    console.error('Error fetching loan records:', error);
                    this.loansData = null;
                    this.noResults = true;
                });
        } else {
            this.loansData = null;
            this.noResults = true;
        }
    }

    handleApplyButtonClick() {
        this.isFormVisible = true;
        this.PersonalLoanForm = true;
    }
    homeloanform() {

    }


    @track searchKey = '';
    @track accounts = [];

    fetchAccountDetails(event) {
        this.searchKey = event.target.value;
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
    /////eligibility check

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
    clearFields() {
        this.borrowerName = '';
        this.phoneNumber = '';
        this.income = '';
        this.nationality = '';
        this.address = '';
        this.dob = '';
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

    // checkEligibility() {
    //     if (this.accountId && this.loanAmount) {
    //         checkLoanEligibility({ accountId: this.accountId, loanAmount: this.loanAmount })
    //             .then(result => {
    //                 this.customerDetails = {
    //                     annualIncome: result.annualIncome,
    //                     interestRate: result.interestRate,
    //                     eligibilityMessage: result.eligible ? 'Eligible' : result.message
    //                 };
    //                 this.errorMessage = '';
    //             })
    //             .catch(error => {
    //                 this.errorMessage = 'Error in eligibility check: ' + error.body.message;
    //                 this.customerDetails = null;
    //             });
    //     } else {
    //         this.errorMessage = 'Please provide Account ID and Loan Amount.';
    //         this.customerDetails = null;
    //     }
    // }
    


    handleInputChangees(event) {
        const field = event.target.dataset.id;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        this[field] = value;
    }

    handlePersonalLoanSubmitButtonClick() {
        const accid=this.newAccount;
        const newloan = {
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
        };

        Createnewloans({ NewLoanRecords: newloan })
            .then(result => {

                console.log('result>>>>>>' + result);
                this.showToast('Success', 'Loan Application successfully submitted!', 'success');
                this.clearForm();
           
        });
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
     accountId = '';
    loanAmount = 0;
    customerDetails = null;
    errorMessage = '';
    isFormVisible = true; // to control form visibility
    isPersonalLoanSelected = false;
    openHomeLoan = false; // flag to track whether home loan form is open
    isFocalculateEMIrmVisible = false; // flag for EMI calculation visibility

    // Handle input change for Account ID
    handleAccountIdChange(event) {
        this.accountId = event.target.value;
    }

    // Handle input change for Loan Amount
    handleLoanAmountChange(event) {
        this.loanAmount = event.target.value;
    }

    // Method that gets called when the user clicks on "Home Loan" button
    // handleHomeLoanClick() {
    //     console.log('Inside home loan :::');
        
    //     // Hide the home loan form and set flags as needed
    //     this.isFormVisible = false;
    //     this.isPersonalLoanSelected = true; // You can modify this based on your actual needs
    //     this.openHomeLoan = false; // Home loan form is no longer visible
    //     this.isFocalculateEMIrmVisible = false; // Hide EMI calculation form

    //     // Call the eligibility check for Home Loan
    //     this.checkEligibilityHome();
        
    //     // If you have any other actions (like calculating EMI), you can call them here
    //     this.calculateEMI();
    // }

    // Check eligibility for Home Loan
    checkEligibilityHome() {
        console.log('Inside check eligibility of home loan :::');
        this.errorMessage = ''; // Clear any previous error message
        this.customerDetails = null; // Clear previous details

        // Validate Account ID (it should not be empty)
        if (!this.accountId) {
            this.errorMessage = 'Account ID is required.';
            return;
        }

        // Validate Loan Amount (should be greater than zero)
        if (this.loanAmount <= 0) {
            this.errorMessage = 'Loan amount must be greater than zero.';
            return;
        }

        // Simulate getting the customer data from Salesforce or an API (you can replace this with real logic)
        let customerData = this.getCustomerData();

        console.log('account id inside customer data', this.accountId);
        console.log('Printing customer data'+ JSON.stringify(data, null, 2));
       


        if (!customerData) {
            this.errorMessage = 'No customer data found for the provided Account ID.';
            return;
        }

        // Calculate eligibility based on Home Loan rules
        let eligibilityData = this.calculateHomeLoanEligibility(customerData, this.loanAmount);

        // Update customer details with eligibility data
        this.customerDetails = eligibilityData;
    }

    // Simulate fetching customer data based on Account ID
             // Assuming accountId is already defined as a property in your component
getCustomerData() {
    console.log('get customer data called:::');

    // Assuming getCustomerData is an imperative Apex call returning a Promise
    getCustomerData({ accountIds: this.accountId })
        .then((data) => {
            // Arrow function to ensure 'this' refers to the component context
        console.log('Printing customer data inside get cusotmer data method'+ JSON.stringify(data, null, 2));

        console.log('Annual income inside get customer data ::: ', data.Annual_Income__c);
            if (data.error) {
                this.errorMessage = data.error;
            } else {
                this.customerDetails = {
                    accountId: data.accountId,
                    annualIncome: data.annualIncome,
                    interestRate: data.interestRate,
                    eligibilityMessage: data.eligible ? 'Eligible' : data.message

                };
                this.errorMessage = ''; // Clear any previous error
            }
        })
        .catch((error) => {
            // Arrow function to ensure 'this' refers to the component context
            this.errorMessage = 'An error occurred: ' + error.body.message;
            this.customerDetails = null;
        });
}
    

    // Logic to calculate Home Loan eligibility
    calculateHomeLoanEligibility(customer, loanAmount) {
        const annualIncome = customer.annualIncome;
        console.log('Inside calculate home loan :::'+annualIncome);
        let eligibility = { eligible: false, interestRate: 0, eligibilityMessage: '' };

        // Home Loan Eligibility Rules (Example):
        if (annualIncome < 600000) {
            if (loanAmount >= 100000 && loanAmount <= 500000) {
                eligibility.eligible = true;
                eligibility.interestRate = 7;
                eligibility.eligibilityMessage = 'Eligible for Home Loan between ₹1,00,000 to ₹5,00,000 at 7% interest rate.';
            } else {
                eligibility.eligibilityMessage = 'Eligible only for loans between ₹1,00,000 to ₹5,00,000.';
            }
        } else if (annualIncome >= 600000 && annualIncome <= 1500000) {
            if (loanAmount >= 100000 && loanAmount <= 1000000) {
                eligibility.eligible = true;
                eligibility.interestRate = 6;
                eligibility.eligibilityMessage = 'Eligible for Home Loan between ₹1,00,000 to ₹10,00,000 at 6% interest rate.';
            } else {
                eligibility.eligibilityMessage = 'Eligible only for loans between ₹1,00,000 to ₹10,00,000.';
            }
        } else if (annualIncome > 1500000) {
            if (loanAmount >= 100000 && loanAmount <= 2500000) {
                eligibility.eligible = true;
                eligibility.interestRate = 5;
                eligibility.eligibilityMessage = 'Eligible for Home Loan between ₹1,00,000 to ₹25,00,000 at 5% interest rate.';
            } else {
                eligibility.eligibilityMessage = 'Eligible only for loans between ₹1,00,000 to ₹25,00,000.';
            }
        } else {
            eligibility.eligibilityMessage = 'Loan amount below minimum eligibility or invalid income data.';
        }

        return eligibility;
    }

    // Method to calculate EMI (Example - You can replace this with your actual logic)
    calculateEMI() {
        console.log('EMI Calculation logic should be placed here');
        const principal = this.loanAmount;
        const annualRate = this.interestRate / 100;
        const monthlyRate = annualRate / 12;
        const months = this.tenure;

        // EMI formula
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
        this.emi = Math.round(emi);

        // Total Interest Payable
        const totalAmountPayable = this.emi * months;
        this.totalInterestPayable = Math.round(totalAmountPayable - principal);
        // Add EMI calculation logic here
    }

}