import { LightningElement, track, wire } from 'lwc';
import searchAccounts from '@salesforce/apex/InsurancePolicyController.searchAccounts';
import saveInsuranceDetails from '@salesforce/apex/InsuranceDetailsController.saveInsuranceDetails';
import getAccountDetails from '@salesforce/apex/AccountRelationshipController.getAccountDetails';
//import CreatenewLifeInsurance from '@salesforce/apex/InsuranceDetailsController.CreatenewLifeInsurance';
import { NavigationMixin } from 'lightning/navigation';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class NewTemplate extends NavigationMixin(LightningElement) {

    @track searchTerm = '';
    @track accounts = [];
    @track selectedAccountId;
    @track searchKey = ''; // Initialize searchKey
    @track isModalOpen = false; // State variable to control modal visibility

    // Other class properties...
    @track newAccount = '';
    @track firstName = '';
    @track lastName = '';
    @track customerEmail = '';
    @track phoneNo = '';
    @track gender = '';
    @track nominee = '';
    @track policyBeneficiary = '';
    @track policyPremiumAmount = null;
    @track coverageAmount = null;
    @track status = '';
    @track paymentFrequency = '';
    @track underwritingStatus = '';
    @track policyStartDate = '';
    @track policyEndDate = '';
    @track claimable = false;

    @track PremiumPaymentMode = '';
    @track PolicyTerm = null;
    @track SumAssured = null;
    @track MaturityDate = '';
    @track CriticalIllnessRider = false;
    @track AccidentalDeathBenefit = false;
    @track HealthCheckRequired = false;
    @track accountId;
    @track accountDetails;
    @track accname='';
    @track accountDetail;
    
     // Wire the CurrentPageReference to get URL parameters
    @wire(CurrentPageReference)
    getPageReference(currentPageReference) {
        if (currentPageReference) {
            // Get the recordId from the URL query parameters
            this.accountId = currentPageReference.state.accountId;
            this.searchKey=currentPageReference.state.accId;
            if (this.accountId) {
                this.fetchAccountDetails();
            } else {
                this.fetchAccountDetail();

            }
        }
    }
       // Method to call Apex class and get account details


    fetchAccountDetails() {
        getAccountDetails({ accountId: this.accountId })
            .then(result => {
                console.log('Account Details:', result); // Debugging log
                this.accountDetails = result; // Corrected property assignment
                this.error = undefined;
                this.assingpersnoal();
            })
            .catch(error => {
                console.log('Error fetchinaccount details:', error); // Debugging log
                this.error = error;
                this.accountDetails = undefined;
            });
    }
        fetchAccountDetail() {
        getAccountDetails({ accountId: this.searchKey})
            .then(result => {
                console.log('Account Details:', result); // Debugging log
                this.accountDetail = result; // Corrected property assignment
                this.error = undefined;
                this.assingglobal();
            })
            .catch(error => {
                console.log('Error fetchinaccount details:', error); // Debugging log
                this.error = error;
                this.accountDetail = undefined;
            });
    }
assingpersnoal(){
    this.newAccount=this.accountDetails.Id;
    this.firstName=this.accountDetails.FirstName__c;
    this.lastName=this.accountDetails.Last_Name__c;
    this.phoneNo=this.accountDetails.Phone_number__c;
    this.gender=this.accountDetails.Gender__c;
}
assingglobal(){
    this.newAccount=this.accountDetail.Id;
    this.firstName=this.accountDetail.FirstName__c;
    this.lastName=this.accountDetail.Last_Name__c;
    this.phoneNo=this.accountDetail.Phone_number__c;
    this.gender=this.accountDetail.Gender__c;
}

    PremiumPaymentOptions = [
        { label: 'Single', value: 'Single' },
        { label: 'Regular', value: 'Regular' }
    ];

    genderOptions = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Third Gender', value: 'Third Gender' }
    ];

    statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Expired', value: 'Expired' },
        { label: 'Lapsed', value: 'Lapsed' },
        { label: 'Cancelled', value: 'Cancelled' },
        { label: 'Pending', value: 'Pending' }
    ];

    paymentOptions = [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Annually', value: 'Annually' }
    ];

    underwritingStatusOptions = [
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Declined', value: 'Declined' }
    ];

    claimableOptions = [
        { label: 'Yes', value: 'yes' }
    ];

    
    handleSearchTermChange(event) {
        this.accname = event.target.value;
        if (this.accname.length > 2) {
            // Call the Apex method when input is 3 characters or more
            searchAccounts({ searchTerm: this.accname })
                .then(result => {
                    this.accounts = result;
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            this.accounts = null;  // Clear results when input is less than 3 characters
        }
    }

    handleAccountSelect(event) {
        // Get the selected account's Id and Name from the UI element
        const selectedAccountId = event.currentTarget.dataset.id; // Retrieve the account ID
        const selectedAccountName = event.currentTarget.innerText; // Retrieve the account name

        // Store the selected account ID in the Customer_Name__c field
        this.newAccount = selectedAccountId; // Master-detail reference to New_Account__c

        // Update the search field with the selected account's name
        this.accname = selectedAccountName; // Set the input value to the selected account name

        // Clear the search results after selection
        this.accounts = []; // Clear the search results to prevent further selections

        // Dispatch a custom event for external handling, if needed
        const selectedEvent = new CustomEvent('accountselect', {
            detail: { accountId: selectedAccountId, accountName: selectedAccountName }
        });
        this.dispatchEvent(selectedEvent); // Dispatch the custom event to notify parent components
    }
    //persnoal account
    handlePersonalInputChange(event) {
        const field = event.target.dataset.field;
        this[field] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    }
    // Handle form input changes
    handleInputChange(event) {
        const field = event.target.dataset.field;
        this[field] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    }
        handleBack() {
        // Hide the upload section and reset any necessary properties
        window.history.back();
        // Optionally, reset any form fields or state variables if needed
        // For example, this.resetForm(); // Uncomment if you want to reset the form
    }

    handleSave() {
        // Open the modal and pass the form data
        this.isModalOpen = true;
    }
    handleCloseModal() {
        // Close the modal
        this.isModalOpen = false;
    }

 handleCommit() {
    const accountIds = this.newAccount;
    console.log('accountidin commit>>'+accountIds);
    console.log('Data committed:', {
        newAccountId: this.newAccount,
        firstName: this.firstName,
        lastName: this.lastName,
        customerEmail: this.customerEmail,
        phoneNo: this.phoneNo,
        gender: this.gender,
        nominee: this.nominee,
        policyBeneficiary: this.policyBeneficiary,
        policyPremiumAmount: parseFloat(this.policyPremiumAmount),
        coverageAmount: parseFloat(this.coverageAmount),
        status: this.status,
        paymentFrequency: this.paymentFrequency,
        underwritingStatus: this.underwritingStatus,
        policyStartDate: this.policyStartDate,
        policyEndDate: this.policyEndDate,
        claimable: this.claimable,
        PremiumPaymentMode: this.PremiumPaymentMode,
        PolicyTerm: this.PolicyTerm,
        SumAssured: this.SumAssured,
        MaturityDate: this.MaturityDate,
        CriticalIllnessRider: this.CriticalIllnessRider,
        AccidentalDeathBenefit: this.AccidentalDeathBenefit,
        HealthCheckRequired: this.HealthCheckRequired,
    });

    saveInsuranceDetails({
        newAccountId: this.newAccount,
        firstName: this.firstName,
        lastName: this.lastName,
        customerEmail: this.customerEmail,
        phoneNo: this.phoneNo,
        gender: this.gender,
        nominee: this.nominee,
        policyBeneficiary: this.policyBeneficiary,
        policyPremiumAmount: parseFloat(this.policyPremiumAmount),
        coverageAmount: parseFloat(this.coverageAmount),
        status: this.status,
        paymentFrequency: this.paymentFrequency,
        underwritingStatus: this.underwritingStatus,
        policyStartDate: this.policyStartDate,
        policyEndDate: this.policyEndDate,
        claimable: this.claimable,
        PremiumPaymentMode: this.PremiumPaymentMode,
        PolicyTerm: this.PolicyTerm,
        SumAssured: this.SumAssured,
        MaturityDate: this.MaturityDate,
        CriticalIllnessRider: this.CriticalIllnessRider,
        AccidentalDeathBenefit: this.AccidentalDeathBenefit,
        HealthCheckRequired: this.HealthCheckRequired,
    })
    //  .then(() => {
    //     // Call CreatenewLifeInsurance after saving details
    //     CreatenewLifeInsurance({ NewLifeRecords: saveInsuranceDetails })
    //         .then(result => {
    //             console.log('Life Insurance record saved successfully:', result);
    //             this.showToast('Success', 'Life Insurance Application successfully Submitted!', 'success');
    //         })
    //         .catch(error => {
    //             console.error('Error saving Life record:', error);
    //         });
    // })
    

    .then(() => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record saved successfully!',
                variant: 'success'
            })
        );
        this.resetForm();
        this.handleCloseModal(); // Close the modal if needed
        
           this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/accountdetails?recordId=`+accountIds
            }
            })
 
    })
    .catch(error => {
        console.error('Error saving policy:', error);
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: 'Failed to save record: ' + (error.body?.message || 'Unknown error'),
                variant: 'error'
            })
        );
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
resetForm() {
    this.newAccount='';
    this.firstName = '';
    this.lastName = '';
    this.customerEmail = '';
    this.phoneNo = '';
    this.gender = '';
    this.nominee = '';
    this.policyBeneficiary = '';
    this.policyPremiumAmount = null;
    this.coverageAmount = null;
    this.status = '';
    this.paymentFrequency = '';
    this.underwritingStatus = '';
    this.policyStartDate = '';
    this.policyEndDate = '';
    this.claimable = false;
    
    this.PremiumPaymentMode = '';
    this.PolicyTerm = null;
    this.SumAssured = null;
    this.MaturityDate = '';
    this.CriticalIllnessRider = false;
    this.AccidentalDeathBenefit = false;
    this.HealthCheckRequired = false;

    this.accname = ''; // Reset search key for accounts
    this.accounts = []; // Clear account suggestions if any
}

    

}