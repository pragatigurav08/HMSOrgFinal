import { LightningElement, track, api } from 'lwc';
import checkLoanEligibility from '@salesforce/apex/LoanEligibilityControllerNew.checkLoanEligibility';
import searchAccounts from '@salesforce/apex/LoanApplicationController.searchAccounts';
import saveLoanApplication from '@salesforce/apex/LoanApplicationController.saveLoanApplication';
import saveHomeLoanApplication from '@salesforce/apex/LoanApplicationController.saveHomeLoanApplication';
import saveGoldLoanApplication from '@salesforce/apex/LoanApplicationController.saveGoldLoanApplication';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAccountDetails from '@salesforce/apex/LoanApplicationController.getAccountDetails';
import uploadFile from '@salesforce/apex/Uploadfile.uploadFile';
import getLoans from '@salesforce/apex/HomepageController.getRecentlyViewedLoans';
import getLoanDetails from '@salesforce/apex/LoanDisplayController.getLoanDetails';

import femaleprofileloan from '@salesforce/resourceUrl/femaleprofileloan';
import maleprofileloan from '@salesforce/resourceUrl/maleprofileloan';
import LoanPic from '@salesforce/resourceUrl/LoanPic';


export default class LoanEligibility extends LightningElement {

    @track disableApplyButton = true; // Initially disable the "Apply for Loan" button
    //  @track toastMessage = '';
    loanPicUrl=LoanPic;
    femaleprofile =femaleprofileloan;
    maleprofile =maleprofileloan;
     @track showLoans = false;
    @track showEligibility = false;
    @track Loans = [];
    @track errorMessage;
    @track accountId = '';
    @track loanAmount = 0;
    @track customerDetails = null;
    @track handlePersonalLoanOpen = false;
    @track openGoldLoanFormOpen = false;
    @track searchKey = '';
    @track borrowerName = '';
    @track dob = '';
    @track selectedIdProofs = '';
    @track maritail = '';
    @track nationality = '';
    @track address = '';
    @track currentAddress = '';
    @track income = '';
    @track loantenure = '';
    @track loanpurpose = '';
    @track goldWeight = '';
    @track goldPurity = '';
    @track occupation = '';
    @track newAccount = '';
    @track accounts = [];
    @track referenceName1;
    @track referenceContact1;
    @track referenceName2;
    @track referenceContact2;
    @track showEligibilityHomeLoan = false;
    @track checkForEligibilityPage = true;
    @track emailaddress = '';
    @track phoneNumber = '';
    @track goldType = '';
    @track openHomeLoanFormOpen = false;
    @track showEligibility1PersonalLoan = false;
    @track showEligibility2 = false;
    @track isDocumentInfoVisible = false;
    @track goldTypeOptions = [
        { label: 'Bars', value: 'Bars' },
        { label: 'Coins', value: 'Coins' },
        { label: 'Jewelry', value: 'Jewelry' }
    ];
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

    propertyTypeOptions = [
        // console.log('Inside property type option :::'),
        { label: 'Flat', value: 'Flat' },
        { label: 'Independent House', value: 'Independent House' },
        { label: 'Plot', value: 'Plot' }
    ];

    propertyStageOptions = [
        // console.log('Inside property stage option :::'),
        { label: 'Under Construction', value: 'Under Construction' },
        { label: 'Ready to Move', value: 'Ready to Move' }
    ];

    ownershipOptions = [
        // console.log('Inside ownership option :::'),
        { label: 'Sole', value: 'Sole' },
        { label: 'Joint', value: 'Joint' }
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

    goldPurityOptions = [
        { label: '18K', value: '18K' },
        { label: '22K', value: '22K' },
        { label: '24K', value: '24K' }
    ];


    handleBackClickMain() {
        this.showEligibility1PersonalLoan = false;
        this.checkForEligibilityPage = true;
        this.searchKey = ''; // Clear Account ID search field
        this.loanAmount = ''; // Clear Loan Amount
        this.accounts = []; // Clear search results
        this.errorMessage = ''; // Clear any error messages
        this.customerDetails = null; // Clear customer details
    }

    handleBackClickMainHome() {
        this.showEligibilityHomeLoan = false;
        this.checkForEligibilityPage = true;
        this.searchKey = ''; // Clear Account ID search field
        this.loanAmount = ''; // Clear Loan Amount
        this.accounts = []; // Clear search results
        this.errorMessage = ''; // Clear any error messages
        this.customerDetails = null; // Clear customer details
    }

    handleBackClickMainGold() {
        this.showEligibilityGoldLoan = false;
        this.checkForEligibilityPage = true;
        this.searchKey = ''; // Clear Account ID search field
        this.loanAmount = ''; // Clear Loan Amount
        this.accounts = []; // Clear search results
        this.errorMessage = ''; // Clear any error messages
        this.customerDetails = null; // Clear customer details
    }

    personalEligibility() {
        console.log('inside personal eligibility :::');
        this.showEligibility1PersonalLoan = true;
        this.checkForEligibilityPage = false;
       this.isNewLoanPage = false; // Hide the "Apply For a Loan" page
    
    }

    homeEligibility() {
        console.log('inside home eligibility');
        this.showEligibilityHomeLoan = true;
        this.checkForEligibilityPage = false;
         this.isNewLoanPage = false; 
    }

    goldEligibility() {

        this.showEligibilityGoldLoan = true;
         this.isNewLoanPage = false;                                        
        this.checkForEligibilityPage = false;
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
        this.maritail = event.detail.value;  // Store selected marital status
    }

    handleOccupationChange(event) {
        this.occupation = event.detail.value;  // Store selected occupation
    }

    // handleGoldLoanSubmitButtonClick() {
    //     const newgoldloan = {
    //         New_Account__c: this.newAccount,
    //         Loan_Amount__c: this.loanamount,
    //         Loan_Term_Months__c: this.loantenure,
    //         Loan_Purpose__c: this.loanpurpose,
    //         Nationality__c: this.nationality,

    //         Occupation__c: this.occupation,
    //         //  Documents__c: this.selectedIdProofs.join(';'), // Multi-select values as semicolon-separated string
    //         Annual_Income__c: this.income,
    //         Borrower_s_Name__c: this.borrowerName,
    //         EmailAddress__c: this.emailaddress,
    //         Phone_number__c: this.phoneNumber,
    //         Date_Of_Birth__c: this.dob,
    //         Marital__c: this.maritail,
    //         Residential_Address__c: this.address,

    //         Weight_of_Gold__c: this.goldWeight,
    //         Type_of_Gold__c: this.goldType,
    //         Purity__c: this.goldPurity,
    //         Reference_1_Name__c: this.referenceName1,
    //         Reference_2_Name__c: this.referenceName2,
    //         Reference_1_Contact__c: this.referenceContact1,
    //         Reference_2_Contact__c: this.referenceContact2
    //     };
    //     Creategoldloans({ NewLoanRecords: newgoldloan })
    //         .then(result => {

    //             console.log('result>>>>>>' + result);
    //             this.showToast('Success', 'Loan Application successfully submitted!', 'success');
    //             this.clearForm();
    //         })

    //         .catch(error => {
    //             console.error('Error saving loan record:', error);
    //             this.showToast('Error', 'Failed to save the loan record. Please try again.', 'error');
    //         });
    // }

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
        this.accountId = event.target.value;
        console.log('Search key is :::', this.accountId);
        if (this.accountId.length > 0) {
            searchAccounts({ searchTerm: this.accountId })
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
        const accountId = event.currentTarget.dataset.id;
        const selectedAccountName = event.currentTarget.innerText;
        console.log('selected account id is:::', accountId);

        const selectedEvent = new CustomEvent('accountselect', {
            detail: { accountId: accountId, accountName: selectedAccountName }
        });

        this.dispatchEvent(selectedEvent);

        this.accounts = null;
        this.searchKey = selectedAccountName;
        console.log(' this.searchKey>>>' + JSON.stringify(this.searchKey));
        this.newAccount = accountId;
        this.fetchAccountDetails(this.newAccount);

    }
    @track accountIdPassing = '';
    fetchAccountDetails(accountId) {
        console.log('inside fetch acc details:::', accountId);
        getAccountDetails({ accountId })
            .then((result) => {
                console.log('Fetched account result is:::', JSON.stringify(result));
                if (result && result.length > 0) {
                    const account = result[0]; // Get the first account from the list                   
                    this.borrowerName = account.FirstName__c; // Access fields   
                    this.accountIdPassing = account.Id;
                    this.phoneNumber = account.Phone_number__c;
                    this.dob = account.DateOfBirth__c;
                    this.address = account.CommunicationResidentAddress__c;
                    this.nationality = account.Nationality__c;
                    this.income = account.Annual_Income__c;
                    console.log('Account id ::', this.accountIdPassing);
                    //console.log('account ids:', account.id);
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
        console.log('Printing search key id :::', this.searchKey);
        console.log('Printing loan amount:::', this.loanAmount);
        if (this.accountId && this.loanAmount) {
            // checkLoanEligibility({ accountId: this.searchKey, loanAmount: this.loanAmount })
            //     .then(result => {
            //         console.log('inside check eligibility result found');
            //         console.log('Printing the result of customers:::', JSON.stringify(result));
            //         this.customerDetails = {
            //             annualIncome: result.annualIncome,
            //             interestRate: result.interestRate,
            //             eligibilityMessage: result.eligible ? 'Eligible' : result.message
            //         };
            //          //console.log('Annual income is:::', annualIncome),
            //         this.errorMessage = '';
            //     })
            checkLoanEligibility({ accountId: this.searchKey, loanAmount: parseFloat(this.loanAmount) })
    .then((result) => {
        console.log('Check eligibility result:', JSON.stringify(result));

        if (result.eligible) {
            this.customerDetails = {
                annualIncome: result.annualIncome,
                interestRate: result.interestRate,
                eligibilityMessage: 'Eligible for a loan',
            };
            this.disableApplyButton = false;
            this.showToast('Eligibility Check', 'You are eligible for the loan.', 'success');
        } else {
            this.customerDetails = {
                annualIncome: result.annualIncome || 'Not available',
                interestRate: 'N/A',
                eligibilityMessage: result.message || 'Not eligible for the loan',
            };
            this.disableApplyButton = true;
            this.showToast('Eligibility Check', result.message || 'You are not eligible for the loan.', 'error');
        }
    })
    .catch((error) => {
        this.errorMessage = 'Error in eligibility check: ' + (error.body?.message || 'Unknown Error');
        this.customerDetails = null;
        this.showToast('Eligibility Check', this.errorMessage, 'error');
    });

        }}

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
    handledocumentinfo() {
        this.handlePersonalLoan = false;
        this.isDocumentInfoVisible = true;
    }


  handlereviewinfo() {
    const allValid = this.validateFields();

    if (allValid) {
        console.log('All fields are valid. Proceeding...');
        this.showEligibility2 = true;
        this.showEligibility1PersonalLoan = false;
        this.showEligibilityHomeLoan = false;
        this.reviewinfo = true;
        this.handlePersonalLoanOpen = false;
        this.openHomeLoanFormOpen = false;
        this.isDocumentInfoVisible = false;

        this.navigateToNextPage();
        this.showToast('Review Information', 'Fields are valid. Proceeding to the next step.', 'success');
    } else {
        console.log('Validation failed. Required fields are missing.');
        this.showToast('Review Information', 'Required fields are missing. Please fill them.', 'error');
    }
}


    validateFields() {
        const requiredFields = this.template.querySelectorAll('lightning-input, lightning-combobox');
        let allValid = true; // Initialize the validity flag

        requiredFields.forEach((field) => {
            console.log(`Validating field: ${field.label || field.name}`);

            // Check if the field is required and value is missing
            if (field.required && (!field.value || field.value.trim() === '')) {
                field.setCustomValidity('This field is required.'); // Set custom error
                allValid = false; // Mark overall validity as false
            } else {
                field.setCustomValidity(''); // Clear any custom error
            }
            field.reportValidity(); // Report validity to show errors on the UI
        });

        return allValid; // Return the overall validity status
    }



    @track reviewinfohome = false;
    @track reviewinfogold = false;

    handlereviewinfohome() {
        const allValid = this.validateFields();
        console.log('Inside review home:::');

        if (allValid) {
            console.log('All fields are valid. Proceeding...');

            this.reviewinfohome = true;
            this.checkForEligibilityPage = false;
            this.openHomeLoanFormOpen = false;
            this.navigateToNextPage();
        } else {
            console.log('Validation failed. Required fields are missing.');
            // Show a toast for validation failure
            this.showToast('Error', 'Required fields are missing. Please fill them.', 'error');
            // Stop any further execution
            return;
        }



    }

    handlereviewinfogold() {

        const allValid = this.validateFields();
        console.log('Inside review home:::');

        if (allValid) {
            console.log('All fields are valid. Proceeding...');
            this.reviewinfogold = true;
            this.checkForEligibilityPage = false;
            this.openGoldLoanFormOpen = false;

        } else {
            console.log('Validation failed. Required fields are missing.');
            // Show a toast for validation failure
            this.showToast('Error', 'Required fields are missing. Please fill them.', 'error');
            // Stop any further execution
            return;
        }
    }


    handleBackToForm() {
        this.handlePersonalLoanOpen = true;
        this.reviewinfo = false;
    }

    handleBackToFormHome() {
        this.reviewinfohome = false;
        this.openHomeLoanFormOpen = true;
    }

    handleBackToFormGold() {
        this.reviewinfogold = false;
        this.openGoldLoanFormOpen = true;

    }


    handleformBackClick() {
        this.showEligibility1PersonalLoan = true;
        this.handlePersonalLoanOpen = false;
        this.showEligibilityHomeLoan = false;
        this.openHomeLoanFormOpen = false;

    }

    handleformBackClickGold() {
        this.showEligibilityGoldLoan = true;
        this.handlePersonalLoanOpen = false;
        this.openHomeLoanFormOpen = false;
        this.openGoldLoanFormOpen = false;
    }


    handlePersonalLoan() {
        console.log('Inside personal loan button :::');
        this.showEligibility1PersonalLoan = false;
        this.handlePersonalLoanOpen = true;
         this.isNewLoanPage = false; 
        console.log('handlePersonalLoanOpen:', this.handlePersonalLoanOpen);
        
    }

    openHomeloan() {
        console.log('open home loan form open');
        this.showEligibilityHomeLoan = false;
        this.openHomeLoanFormOpen = true;
         this.isNewLoanPage = false; 
        console.log('openHomeLoanFormOpen:', this.openHomeLoanFormOpen);


    }

    openGoldLoanForm() {
        this.showEligibilityGoldLoan = false;
        this.openGoldLoanFormOpen = true;
    }


   @track uploadedDocumentIds = [];
    @track uploadedDocuments = [];
    @track aadhaarFileName = '';
    @track panFileName = '';
    @track drivingLicenseFileName = '';
    @track salarySlipFileName = '';
    @track bankStatementFileName = '';

    handleFileUpload(event) {
        const uploadedFiles = event.detail.files; // Get the uploaded files
        const fileType = event.target.dataset.type; // Get the document type

        // Add files to the uploadedDocuments array
        uploadedFiles.forEach(file => {
        const documentDetails = {
            id: file.documentId,
            fileName: file.name,
            previewUrl: `/sfc/servlet.shepherd/document/download/${file.documentId}`, // Preview URL for Salesforce
        };
             if (fileType === 'aadhaar') {
            this.aadhaarFileName = file.name;
            this.aadhaarFileDetails = documentDetails;
        } else if (fileType === 'pan') {
            this.panFileName = file.name;
            this.panFileDetails = documentDetails;
        } else if (fileType === 'drivingLicense') {
            this.drivingLicenseFileName = file.name;
            this.drivingLicenseFileDetails = documentDetails;
        } else if (fileType === 'salarySlip') {
            this.salarySlipFileName = file.name;
            this.salarySlipFileDetails = documentDetails;
        } else if (fileType === 'bankStatement') {
            this.bankStatementFileName = file.name;
            this.bankStatementFileDetails = documentDetails;
        }

        // Push the file details into the uploadedDocuments array
        this.uploadedDocuments.push({
            label: this.getDocumentLabel(fileType),
            ...documentDetails,
        });
    });

        this.showToast('File Upload', 'File uploaded successfully!', 'success');
    }
    getDocumentLabel(fileType) {
        const labels = {
            aadhaar: 'Aadhaar Card',
            pan: 'PAN Card',
            drivingLicense: 'Driving License',
            salarySlip: 'Salary Slip',
            bankStatement: 'Bank Statement',
        };
        return labels[fileType] || 'Unknown Document';
    }
//child 
   // @track opendetailPage = false;

   @track loanType = '';

   handlePersonalLoanSubmitButtonClick() {
    console.log('Account ID inside save loan button is:', this.accountIdPassing);
    const LoanType = 'Personal Loan';
    saveLoanApplication({
        borrowerName: this.borrowerName,
        accountId: this.accountIdPassing,
        emailaddress: this.emailaddress,
        phoneNumber: this.phoneNumber,
        dob: this.dob,
        nationality: this.nationality,
        address: this.address,
        maritail: this.maritail,
        occupation: this.occupation,
        loanamount: parseFloat(this.loanamount),
        loanpurpose: this.loanpurpose,
        loantenure: parseInt(this.loantenure, 10),
        income: parseFloat(this.income),
        documentId: this.uploadedDocuments.join(','),
        loanType: LoanType
    })
        .then(() => {
            this.showToast('Loan Submission', 'Loan application submitted successfully!', 'success');
            this.resetForm();
            this.reviewinfo = false;
            this.reviewinfohome = false;
            this.reviewinfogold = false;
             this.isOpenLoanPage = true;
            //this.opendetailPage = true;
        })
        .catch((error) => {
            const message = error.body ? error.body.message : 'An unknown error occurred';
            this.showToast('Loan Submission', `Failed to submit loan application: ${message}`, 'error');
        });
}

// handleHomeLoanSubmitButtonClick() {
//     console.log('Account ID inside home loan button is:', this.accountIdPassing);
//     loanType = 'Home Loan';
//     saveHomeLoanApplication({
//         borrowerName: this.borrowerName,
//         accountId: this.accountIdPassing,
//         emailaddress: this.emailaddress,
//         phoneNumber: this.phoneNumber,
//         dob: this.dob,
//         nationality: this.nationality,
//         address: this.address,
//         maritail: this.maritail,
//         occupation: this.occupation,
//         loanamount: parseFloat(this.loanamount),
//         //loanpurpose: this.loanpurpose,
//         loantenure: parseInt(this.loantenure, 10),
//         income: parseFloat(this.income),
//         propertyAddress: this.propertyAddress,
//         propertyType: this.propertyType,
//         propertyValue: this.propertyValue,
//         builderName: this.builderName,
//         documentId: this.uploadedDocuments.join(','),
//         loanType: this.loanType
//     })
//         .then(() => {
//             console.log('Inside home loan toast mssg :::');
//             this.showToast('Loan Submission', 'Loan application submitted successfully!', 'success');
//             this.resetForm();
//             this.reviewinfo = false;
//             this.reviewinfohome = false;
//             this.reviewinfogold = false;
//             //this.opendetailPage = true;
//         })
//         .catch((error) => {
//             console.log('Error in home loan:::', error);
//             const message = error.body ? error.body.message : 'An unknown error occurred';
//             this.showToast('Loan Submission', `Failed to submit loan application: ${message}`, 'error');
//         });
// }
// handleHomeLoanSubmitButtonClick() {
//     console.log('Account ID inside save loan button is');

//     const LoanType = 'Home Loan'; // Ensure correct loan type
    
//     saveHomeLoanApplication({
//         borrowerName: this.borrowerName,
//         accountId: this.accountIdPassing,
//         emailaddress: this.emailaddress,
//         phoneNumber: this.phoneNumber,
//         dob: this.dob,
//         nationality: this.nationality,
//         address: this.address,
//         maritail: this.maritail,
//         occupation: this.occupation,
//         loanamount: parseFloat(this.loanamount) || 0.0,
//         loanpurpose: this.loanpurpose,
//         loantenure: parseInt(this.loantenure, 10) || 0,
//         income: parseFloat(this.income) || 0.0,
//         propertyAddress: this.propertyAddress || null,
//         propertyType: this.propertyType || null,
//         propertyValue: parseFloat(this.propertyValue) || null,
//         builderName: this.builderName || null,
//         documentId: this.uploadedDocuments.join(',') || '',
//         loanType: LoanType
//     })
//     .then((data) => {
//         console.log('loan type is:::', loanType);
//         this.showToast('Loan Submission', 'Loan application submitted successfully!', 'success');
//         this.resetForm();
//         this.reviewinfo = false;
//         this.reviewinfohome = false;
//         this.reviewinfogold = false;
//     })
//     .catch((error) => {
//         const message = error.body && error.body.message ? error.body.message : 'An unknown error occurred';
//         console.error('Error details:', error); // Debugging aid
//         this.showToast('Loan Submission', `Failed to submit loan application: ${message}`, 'error');
//     });
// }
 borrowerName;
    accountIdPassing;
    emailaddress;
    phoneNumber;
    dob; // Ensure format is YYYY-MM-DD
    nationality;
    address;
    maritail;
    occupation;
    loanamount;
    loanpurpose;
    loantenure;
    income;
    propertyAddress;
    propertyType;
    propertyValue;
    builderName;
    uploadedDocuments = [];

    // Flags
    reviewinfo = false;
    reviewinfohome = false;
    reviewinfogold = false;

    handleHomeLoanSubmitButtonClick() {
        console.log('Starting loan application submission...');
        
        // Loan Type is fixed as 'Home Loan'
        const LoanType = 'Home Loan';

        // // Validate Required Fields Before Submitting
        // if (!this.borrowerName || !this.accountIdPassing || !this.loanamount || !this.loantenure) {
        //     this.showToast('Error', 'Please fill in all required fields: Borrower Name, Account ID, Loan Amount, and Loan Tenure.', 'error');
        //     return;
        // }

        // Prepare parameters for Apex
        const params = {
            borrowerName: this.borrowerName,
            accountId: this.accountIdPassing,
            emailaddress: this.emailaddress,
            phoneNumber: this.phoneNumber,
            dob: this.dob, // Ensure proper format (YYYY-MM-DD)
            nationality: this.nationality,
            address: this.address,
            maritail: this.maritail,
            occupation: this.occupation,
            loanamount: parseFloat(this.loanamount) || 0.0,
            loanpurpose: this.loanpurpose,
            loantenure: parseInt(this.loantenure, 10) || 0,
            income: parseFloat(this.income) || 0.0,
            propertyAddress: this.propertyAddress || null,
            propertyType: this.propertyType || null,
            propertyValue: parseFloat(this.propertyValue) || null,
            builderName: this.builderName || null,
            documentId: this.uploadedDocuments.join(',') || '',
            loanType: LoanType
        };

        console.log('Parameters being sent to Apex:', JSON.stringify(params));

        // Call Apex Method
        saveHomeLoanApplication(params)
            .then((data) => {
                console.log('Loan application submitted successfully:', data);
                this.showToast('Success', 'Loan application submitted successfully!', 'success');
                this.resetForm();
                this.reviewinfo = false;
                this.reviewinfohome = false;
                this.reviewinfogold = false;
            })
            .catch((error) => {
                console.error('Error submitting loan application:', error);
                const message = error.body?.message || error.message || 'An unknown error occurred';
                this.showToast('Error', `Failed to submit loan application: ${message}`, 'error');
            });
    }

    // Toast Utility
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        }));
    }

    // Reset Form Utility
    resetForm() {
        this.borrowerName = '';
        this.accountIdPassing = '';
        this.emailaddress = '';
        this.phoneNumber = '';
        this.dob = null;
        this.nationality = '';
        this.address = '';
        this.maritail = '';
        this.occupation = '';
        this.loanamount = '';
        this.loanpurpose = '';
        this.loantenure = '';
        this.income = '';
        this.propertyAddress = '';
        this.propertyType = '';
        this.propertyValue = '';
        this.builderName = '';
        this.uploadedDocuments = [];
    }


handleGoldLoanSubmitButtonClick() {
    console.log('Account ID inside save loan button is:', this.accountIdPassing);

    // Check if the gold purity is valid
    if (!this.goldPurity || !this.goldPurityOptions.some(option => option.value === this.goldPurity)) {
        this.showToast('Validation Error', 'Please select a valid gold purity value.', 'error');
        return; // Prevent submission if invalid
    }

    // Define LoanType explicitly
    const LoanType = 'Gold Loan';

    // Call the Apex method
    saveGoldLoanApplication({
        borrowerName: this.borrowerName,
        accountId: this.accountIdPassing,
        emailaddress: this.emailaddress,
        phoneNumber: this.phoneNumber,
        dob: this.dob,
        nationality: this.nationality,
        address: this.address,
        maritail: this.maritail,
        occupation: this.occupation,
        loanamount: parseFloat(this.loanamount),
        loanpurpose: this.loanpurpose,
        loantenure: parseInt(this.loantenure, 10),
        income: parseFloat(this.income),
        goldWeight: this.goldWeight,
        goldType: this.goldType,
        goldPurity: this.goldPurity, // Pass selected picklist value
        documentId: this.uploadedDocuments.join(','),
        loanType: LoanType // Use explicitly defined LoanType
    })
        .then((data) => {
            this.showToast('Loan Submission', 'Loan application submitted successfully!', 'success');
            this.resetForm();
            this.reviewinfo = false;
            this.reviewinfohome = false;
            this.reviewinfogold = false;
        })
        .catch((error) => {
            const message = error.body ? error.body.message : 'An unknown error occurred';
            this.showToast('Loan Submission', `Failed to submit loan application: ${message}`, 'error');
        });
}

  

    resetForm() {
        console.log('Inside reset form:::');
        this.borrowerName = '';
        this.emailaddress = '';
        this.phoneNumber = '';
        this.dob = '';
        this.nationality = '';
        this.address = '';
        this.maritail = '';
        this.occupation = '';
        this.loanamount = '';
        this.loanpurpose = '';
        this.loantenure = '';
        this.income = '';
        this.goldWeight = '';
        this.goldType = '';
        this.goldPurity = '';
        //this.opendetailPage = true;
    }
    //  emicalcu;
    @track loanAmount = 50000; // Default Loan Amount
    @track tenure = 12; // Default Tenure in months
    @track interestRate = 11; // Default Interest Rate in %
    @track emi = 0; // Calculated EMI

    // Calculate EMI dynamically
    calculateEMI() {
        const ratePerMonth = this.interestRate / 1200; // Monthly interest rate
        this.emi = Math.round(
            (this.loanAmount * ratePerMonth) /
            (1 - Math.pow(1 + ratePerMonth, -this.tenure))
        );
    }

    // Handle Slider Changes
    handleSliderChange(event) {
        const field = event.target.dataset.id;
        this[field] = event.target.value;
        this.calculateEMI();
    }

    // Handle Input Changes
    handleInputChange(event) {
        const field = event.target.dataset.id;
        this[field] = parseFloat(event.target.value);
        this.calculateEMI();
    }

    // Initialize EMI calculation on component load
    connectedCallback() {
        this.calculateEMI();
         this.loadLoans();
         
         
    }
    // js for file upload 
    @track fileData = {
        aadhar: null,
        pan: null,
        license: null,
        salary: null,
    };

    // Handler for file input change
    openfileUpload(event) {
        const fileType = event.target.dataset.id;
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                this.fileData[fileType] = {
                    filename: file.name,
                    base64,
                };
            };
            reader.readAsDataURL(file);
        }
    }

    // Submit file to server
    handleClick(event) {
    const fileType = event.target.dataset.id;
    const fileDetails = this.fileData[fileType];

    if (fileDetails && fileDetails.base64) {
        uploadFile({
            base64: fileDetails.base64,
            filename: fileDetails.filename,
        })
            .then(() => {
                this.fileData[fileType] = null; // Clear after upload
                this.showToast('File Upload', `${fileDetails.filename} uploaded successfully!`, 'success');
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
                this.showToast('File Upload', 'Error uploading file.', 'error');
            });
    } else {
        this.showToast('File Upload', 'No file uploaded or invalid record ID.', 'error');
    }
}
@track isNewLoanPage = false; 
    // Helper to show toast messages
    showToast(title ,message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(event);
    }
    @track showLoanDetails=true;
    handleBack() {
       // this.showLoanForm = false;
        this.isOpenLoanPage = false;
        this.showLoanDetails = true; // Hide the loanForm component
    }
    @track showLoanDetailss=false;

    handleBacky(){
        this.showLoanDetails=true;
        this.isOpenLoanPage=true;
        this.showLoanDetailss=false;
        
    }
     handleaddloan(){
        this.isOpenLoanPage=false;
         this.isNewLoanPage = true; 
    }
    handleBackToDashboard() {
        this.isNewLoanPage = false; // Return to dashboard
        this.isOpenLoanPage=true;
    }

     closeLoanForm() {
        this.showLoanCreation = false;
    }
     loadLoans() {
        getLoans()
            .then(result => {
                this.Loans = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.Loans = [];
            });
    }
    @api Loans;
    
    @track isOpenLoanPage=true;
    // handleMoreActions(event) {
        
    //     const loanId = event.target.dataset.id;
    //     getLoanDetails({ loanId: loanId })
    //         .then(result => {
    //             this.loanDetails = result;
    //         })
    //         .catch(error => {
    //             this.error = error;
    //             console.error('Error fetching loan details: ', error);
    //         });
    // }
     loanDetails = null; // Initialize to null
    error = null;

    handleMoreActions(event) {
        this.showLoanDetails=true;
        this.isOpenLoanPage=!this.isOpenLoanPage;
        this.showLoanDetailss=true;
        const loanId = event.target.dataset.id;
        getLoanDetails({ loanId: loanId })
            .then(result => {
                this.loanDetails = result;
                this.error = null;
            })
            .catch(error => {
                this.loanDetails = null;
                this.error = error;
                console.error('Error fetching loan details: ', error);
            });
    }
    // handleMoreActions() {
    //     this.showLoanDetails=true;
    //     this.isOpenLoanPage=!this.isOpenLoanPage;
    //     this.showLoanDetailss=true;
    // }
}