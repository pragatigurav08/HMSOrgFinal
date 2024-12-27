import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { CurrentPageReference } from 'lightning/navigation';
import getAccountDetails from '@salesforce/apex/AccountRelationshipController.getAccountDetails';
import getLoanDetails from '@salesforce/apex/AccountRelationshipController.getLoanDetails';
import getInsuranceDetails from '@salesforce/apex/AccountRelationshipController.getInsuranceDetails';
import getLoanDetailsById from '@salesforce/apex/AccountRelationshipController.getLoanDetailsById';
import getInsuranceDetailsById from '@salesforce/apex/AccountRelationshipController.getInsuranceDetailsById';
import getRelationshipInsurence from '@salesforce/apex/AccountRelationshipController.getRelationshipInsurence';
import getRelatedLoans from '@salesforce/apex/AccountRelationshipController.getRelatedLoans';

export default class AccountDetailsComponent extends NavigationMixin(LightningElement) {
    @track accountDetails;
    @track loanDetails;
    @track loanDetail;
    @track InsuranceDetails;
    @track InsuranceDetail;
    @track error;
    @track isModalOpen = false;
    @track isaadharOpen = false;
    @track isModalsOpen = false;
    recordId;
    @track showAadhar = false;
    @track fileName = '';         // File name
    @track fileUrl = '';          // File URL for preview
    @track fileSize = '';         // File size
    @track isModalOpen = false;
    @track isImage = false;
    @track isPdf = false;
    @track isUnsupportedFile = false;
    @track isFileUploaded = false;
    @track relatedInsurances = [];
    @track relatedLoans = [];

    // File size formatter (e.g., KB, MB)
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    handleFileUpload(event) {
        const uploadedFiles = event.target.files;
        if (uploadedFiles.length > 0) {
            const file = uploadedFiles[0];

            // Validate file size (4 MB limit)
            const fileSizeLimit = 4 * 1024 * 1024; // 4 MB in bytes
            if (file.size > fileSizeLimit) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'File Size Error',
                        message: 'The file size exceeds the 4 MB limit. Please upload a smaller file.',
                        variant: 'error'
                    })
                );
                return; // Prevent further execution if file size exceeds the limit
            }

            // Get the file name and size
            this.fileName = file.name;
            this.fileSize = this.formatBytes(file.size);

            // Call readFile to set the fileUrl and file type flags
            this.readFile(file);
            this.isFileUploaded = true;
        }
    }

    readFile(file) {
        const reader = new FileReader();
        reader.onload = () => {
            const fileType = file.type;
            this.fileUrl = reader.result; // Base64 encoded file content

            // Set file type flags
            if (fileType.startsWith('image/')) {
                this.isImage = true;
                this.isPdf = false;
                this.isUnsupportedFile = false;

                // Add the proper Base64 MIME type prefix for images
                this.fileUrl = `data:${fileType};base64,${reader.result.split(',')[1]}`;
            } else if (fileType === 'application/pdf') {
                this.isImage = false;
                this.isPdf = true;
                this.isUnsupportedFile = false;

                // Add the proper Base64 MIME type prefix for PDFs
                this.fileUrl = `data:application/pdf;base64,${reader.result.split(',')[1]}`;
            } else {
                this.isImage = false;
                this.isPdf = false;
                this.isUnsupportedFile = true;
            }

            // Store Base64 encoded file data without the MIME type prefix
            this.uploadedFile = reader.result.split(',')[1]; // Extract Base64 part
        };
        reader.readAsDataURL(file);
    }


    handlePreviewClick() {
        if (this.fileUrl) {
            this.isModalOpen = true;
        }
    }

    closeModal() {
        this.isModalOpen = false;
    }

    handleDeleteClick() {
        this.fileName = '';
        this.fileSize = '';  // Clear the file size
        this.fileUrl = '';
        this.isModalOpen = false;
        this.isImage = false;
        this.isPdf = false;
        this.isUnsupportedFile = false;
        this.isFileUploaded = false;
    }

    async handleSaveClick() {
        if (this.fileUrl) {
            const base64Data = this.fileUrl.split(',')[1]; // Get the base64 string
            const fileData = {
                fileName: this.fileName,
                base64Data: base64Data
            };

            try {
                await saveFileToAccount({ fileData });

                // Clear file data after saving
                this.handleDeleteClick();

                // Dispatch a toast event for success
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'File saved successfully',
                        variant: 'success'
                    })
                );
            } catch (error) {
                console.error('Error saving file: ', error);

                // Dispatch a toast event for error
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error saving file',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            }
        }
    }

    // Wire the CurrentPageReference to get URL parameters
    @wire(CurrentPageReference)
    getPageReference(currentPageReference) {
        if (currentPageReference) {
            // Get the recordId from the URL query parameters
            this.recordId = currentPageReference.state.recordId;
            console.log('Record ID from URL: ' + this.recordId); // Debugging log
            if (this.recordId) {
                this.fetchAccountDetails();
                this.fetchLoanDetails();
                this.fetchInsuranceDetails();
            } else {
                console.log('No recordId found in URL');
            }
        }
    }

    // Method to call Apex class and get account details
    fetchAccountDetails() {
        getAccountDetails({ accountId: this.recordId })
            .then(result => {
                console.log('Account Details:', result); // Debugging log
                this.accountDetails = result; // Corrected property assignment
                this.error = undefined;
                this.loadRelatedRecords();
            })
            .catch(error => {
                console.log('Error fetchinaccount details:', error); // Debugging log
                this.error = error;
                this.accountDetails = undefined;
            });
            
    }
    loadRelatedRecords() {
        getRelatedLoans({ accountId: this.recordId })
            .then(result => this.relatedLoans = result)
            .catch(error => this.error = error);
        getRelationshipInsurence({ accountId: this.recordId })
            .then(result => this.relatedInsurances = result)
            .catch(error => this.error = error);
    }
    renderedCallback() {
        if (this.accountDetails && this.accountDetails.UploadedFile__c) {
            const uploadedFileElement = this.template.querySelector('.uploaded-file');
            if (uploadedFileElement) {
                uploadedFileElement.innerHTML = this.accountDetails.UploadedFile__c;
            }
        }
    }
    showModal() {
        this.isaadharOpen = true;
    }

    closeaadhar() {
        this.isaadharOpen = false;
    }
    // Method to call Apex class and get loan details
    fetchLoanDetails() {
        getLoanDetails({ accountId: this.recordId })
            .then(result => {
                console.log('Loan Details:', result); // Debugging log
                this.loanDetails = result; // Corrected property assignment
                this.error = undefined;
            })
            .catch(error => {
                console.log('Error fetching loan details:', error); // Debugging log
                this.error = error;
                this.loanDetails = undefined;
            });
    }
    fetchInsuranceDetails() {
        getInsuranceDetails({ accountId: this.recordId })
            .then(result => {
                console.log('Insurance Details:', result); // Debugging log
                this.InsuranceDetails = result; // Corrected property assignment
                this.error = undefined;
            })
            .catch(error => {
                console.log('Error fetching loan details:', error); // Debugging log
                this.error = error;
                this.InsuranceDetails = undefined;
            });
    }
    handleLoanClick(event) {
        const loansId = event.target.dataset.id;
        this.fetchselectedLoanDetail(loansId);
        this.isModalOpen = true;
    }

    fetchselectedLoanDetail(loanId) {
        getLoanDetailsById({ loanId })
            .then(result => {
                this.loanDetail = result;
            })
            .catch(error => {
                console.error('Error fetching loan details:', error);
                this.loanDetail = null;
            });
    }

    closeModal() {
        this.isModalOpen = false;
        this.loanDetail = null;
    }
    handleInsuranceClick(event) {
        const insuranceId = event.target.dataset.id;
        this.fetchselectedInsuranceDetail(insuranceId);
        this.isModalsOpen = true;
    }
    fetchselectedInsuranceDetail(insuranceId) {
        getInsuranceDetailsById({ insuranceId })
            .then(result => {
                this.InsuranceDetail = result;
            })
            .catch(error => {
                console.error('Error fetching loan details:', error);
                this.InsuranceDetail = null;
            });
    }
    closesModal() {
        this.isModalsOpen = false;
        this.InsuranceDetail = null;
    }
    // handleNavigate() {
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__webPage',
    //         attributes: {
    //             url: 'https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/wealthmanagement'
    //         }
    //     });
    // }

    // handleNavigate1(event) {
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__webPage',
    //         attributes: {
    //             url: 'https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/loan-management'
    //         }
    //     });
    // }

    // handleNavigate2(event) {
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__webPage',
    //         attributes: {
    //             url: 'https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/insurance-management'
    //         }
    //     });
    // }
    handleNavigate1() {
        const accountId = this.accountDetails?.Id;
        if (accountId) {
            const url = 'https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/loan-management?accountId=' + accountId;
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: url
                }
            });
        }
    }
    handleNavigate2() {
        const accountId = this.accountDetails?.Id;
        if (accountId) {
            const url = 'https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/insurance-management?accountId=' + accountId;
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: url
                }
            });
        }
    }
    handleViewAllClick() {
        const accountId = this.accountDetails?.Id;

        // Navigate to the web page and include the account ID as a query parameter
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/all-loans?recordId=${accountId}`
            }
        });
    }
    handleInsuranceViewAllClick(){
         const accountId = this.accountDetails?.Id;

        // Navigate to the web page and include the account ID as a query parameter
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/allinsurances?recordId=${accountId}`
            }
        });
    }
    handleAccountClick(event) {
        const loanRecordId = event.target.dataset.id;

        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/loan/${loanRecordId}`
            }
        });
    }
    handleInsuranceAccountClick(event) {
        const InsuranceRecordId = event.target.dataset.id;

        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/insurance-policy/${InsuranceRecordId}`
            }
        });
    }
    get visibleLoanDetails() {
        return this.loanDetails ? this.loanDetails.slice(0, 2) : [];
    }
    get visibleInsuranceDetails() {
        return this.InsuranceDetails ? this.InsuranceDetails.slice(0, 2) : [];
    }

    get firstNameStyle() {
        return this.accountDetails.FirstName__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get lastNameStyle() {
        return this.accountDetails.Last_Name__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get dobStyle() {
        return this.accountDetails.DateOfBirth__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get phoneNumberStyle() {
        return this.accountDetails.Phone_number__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get nationalityStyle() {
        return this.accountDetails.Nationality__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get homeBranchStyle() {
        return this.accountDetails.Home_Branch__r.Name ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get totalBalance() {
        return this.accountDetails && this.accountDetails.Total_Balance__c ? this.accountDetails.Total_Balance__c : '0';
    }
    get isSameasResidentAddressChecked() {
        // Returns true if the PANCard__c field is true, otherwise false.
        return this.accountDetails && this.accountDetails.Same_as_Resident_Address__c;
    }

    get fathersNameStyle() {
        return this.accountDetails.Father_sName__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get mothersNameStyle() {
        return this.accountDetails.Mother_sName__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get genderStyle() {
        return this.accountDetails.Gender__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get maritalStatusStyle() {
        return this.accountDetails.MaritalStatus__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }
    // second coloumn
    get accountNumberStyle() {
        return this.accountDetails.Name ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get panCardNoStyle() {
        return this.accountDetails.PANCardNo__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }
    get AadharCardNoStyle() {
        return this.accountDetails.Aadhar_Number__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }
    toggleAadharVisibility() {
        this.showAadhar = !this.showAadhar;

    }
    get displayAadharCardno() {
        return this.showAadhar ? this.accountDetails.Aadhar_Number__c : '********' + this.accountDetails.Aadhar_Number__c.slice(-4);
    }
    get documentVerificationStatusStyle() {
        return this.accountDetails.Document_Verification_Status__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get openDateStyle() {
        return this.accountDetails.Open_Date__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get modeOfOperationStyle() {
        return this.accountDetails.Mode_Of_Operation__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get modeOfPaymentStyle() {
        return this.accountDetails.Mode_Of_Payment__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get totalDepositAmountStyle() {
        return this.accountDetails.Total_Deposit_Amount__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get ifscCodeStyle() {
        return this.accountDetails.IFSC_Code__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get firstJointApplicationNameStyle() {
        return this.accountDetails.X1st_Joint_Application_Name__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get secondJointApplicationNameStyle() {
        return this.accountDetails.X2nd_Joint_Application_Name__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get thirdJointApplicationNameStyle() {
        return this.accountDetails.X3rd_Joint_Application_Name__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get statusStyle() {
        return this.accountDetails.Status__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get annualIncomeStyle() {
        return this.accountDetails.Annual_Income__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }
    //thirdColumn
    get ifCountypStyle() {
        return this.accountDetails.Country_P__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get ifStatepStyle() {
        return this.accountDetails.State_P__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get ifCitypNameStyle() {
        return this.accountDetails.City_P__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get ifPincodepNameStyle() {
        return this.accountDetails.PinCode_P__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get ifLandmarkpStyle() {
        return this.accountDetails.Landmark_P__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

    get ifpermanentaddressStyle() {
        return this.accountDetails.Permanent_Address__c ? 'border-bottom: 1px solid lightgray; font-size: initial;' : 'margin-top: 22px; border-bottom: 1px solid lightgray; font-size: initial;';
    }

}