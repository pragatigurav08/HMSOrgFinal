import { LightningElement, track,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import savePolicyData from '@salesforce/apex/VehicleInsuranceForm.savePolicyData';
import getAccountDetails from '@salesforce/apex/AccountRelationshipController.getAccountDetails';

//import CreatVehicleInsurance from '@salesforce/apex/VehicleInsuranceForm.CreatVehicleInsurance';


export default class VehicleInsuranceForm extends LightningElement {

    @track accounts = [];
    @track selectedAccountId;
    @track searchKey = ''; 
    @track isModalOpen = false; 
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
    @track vin = '';
    @track liabilityCoverage = '';
    @track vehicleMakeModel = '';
    @track yearOfManufacture = '';
    @track personalInjuryProtection = false;
    @track roadsideAssistance = false;
    @track vehicleValue = '';
    @track noClaimBonus = false;
    @track coverageType = '';
    @track accountDetail;
    @api accountId;
    @api recordId;

    connectedCallback() {
        this.fetchAccountDetails();
        if (this.accountId) {
            console.log('Received Account ID:', this.accountId);
        }
    }
    fetchAccountDetails() {
        getAccountDetails({ accountId: this.accountId })
            .then(result => {
                console.log('Account Details:', result); // Debugging log
                this.accountDetail = result; // Corrected property assignment
                this.error = undefined;
                this.assingpersnoal();
            })
            .catch(error => {
                console.log('Error fetchinaccount details:', error); // Debugging log
                this.error = error;
                this.accountDetail = undefined;
            });
    }
    assingpersnoal(){
    this.newAccount=this.accountDetail.Id;
    this.firstName=this.accountDetail.FirstName__c;
    this.lastName=this.accountDetail.Last_Name__c;
    this.phoneNo=this.accountDetail.Phone_number__c;
    this.gender=this.accountDetail.Gender__c;
}
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

    illnessOptions = [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' }
    ];

    claimableOptions = [
        { label: 'Yes', value: 'yes' }
    ];

    coverageOptions = [
        { label: 'Comprehensive', value: 'Comprehensive' },
        { label: 'Third Party', value: 'ThirdParty' },
        { label: 'Collision', value: 'Collision' }
    ];
        // Holds the selected value
    selectedCoverage = '';

    // Handle the change event for the combobox
    handleCoverageChange(event) {
        this.selectedCoverage = event.detail.value;
    }

    handleAccountSelect(event) {
        // Get the selected account's Id and Name from the UI element
        const selectedAccountId = event.currentTarget.dataset.id; // Retrieve the account ID
        const selectedAccountName = event.currentTarget.innerText; // Retrieve the account name

        // Store the selected account ID in the Customer_Name__c field
        this.newAccount = selectedAccountId; // Master-detail reference to New_Account__c

        // Update the search field with the selected account's name
        this.searchKey = selectedAccountName; // Set the input value to the selected account name

        // Clear the search results after selection
        this.accounts = []; // Clear the search results to prevent further selections

        // Dispatch a custom event for external handling, if needed
        const selectedEvent = new CustomEvent('accountselect', {
            detail: { accountId: selectedAccountId, accountName: selectedAccountName }
        });
        this.dispatchEvent(selectedEvent); // Dispatch the custom event to notify parent components
    }
    // Handle form input changes
handleInputChange(event) {
    const field = event.target.dataset.field;

    // Handle yearOfManufacture separately
    if (field === 'yearOfManufacture') {
        // Extract the year from the date input
        this.yearOfManufacture = new Date(event.target.value).getFullYear();
    } else {
        this[field] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    }
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
            vin: this.vin,
            liabilityCoverage: this.liabilityCoverage,
            vehicleMakeModel: this.vehicleMakeModel,
            yearOfManufacture: this.yearOfManufacture,
            personalInjuryProtection: this.personalInjuryProtection,
            roadsideAssistance: this.roadsideAssistance,
            vehicleValue: this.vehicleValue,
            noClaimBonus: this.noClaimBonus,
            coverageType: this.coverageType
        });

        savePolicyData({
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
            vin: this.vin,
            liabilityCoverage: this.liabilityCoverage,
            vehicleMakeModel: this.vehicleMakeModel,
            yearOfManufacture: this.yearOfManufacture,
            personalInjuryProtection: this.personalInjuryProtection,
            roadsideAssistance: this.roadsideAssistance,
            vehicleValue: this.vehicleValue,
            noClaimBonus: this.noClaimBonus,
            coverageType: this.coverageType
        })
        
            .then(() => {
                // Display success message using ShowToastEvent
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record saved successfully!',
                        variant: 'success'
                    })
                );

                // Reset the form fields
                this.resetForm();
                this.handleCloseModal(); // Close the modal if needed
        //          this[NavigationMixin.Navigate]({
        //     type: 'standard__webPage',
        //     attributes: {
        //         url: `https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/insurance-policy/${accountIds}`
        //     }
        // });
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
    // Reset form fields after saving
    resetForm() {
        this.newAccount = '';
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
        this.vin = '';
        this.liabilityCoverage = '';
        this.vehicleMakeModel = '';
        this.yearOfManufacture = '';
        this.personalInjuryProtection = false;
        this.roadsideAssistance = false;
        this.vehicleValue = '';
        this.noClaimBonus = false;
        this.coverageType = '';
    }

}