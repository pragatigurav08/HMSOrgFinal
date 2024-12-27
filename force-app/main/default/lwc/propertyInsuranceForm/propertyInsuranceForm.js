import { LightningElement, track,api } from 'lwc';
import savePolicyData from '@salesforce/apex/PropertyInsuranceFormComtroller.savePolicyData';
import getAccountDetails from '@salesforce/apex/AccountRelationshipController.getAccountDetails';
//import CreatePropertyInsurance from '@salesforce/apex/PropertyInsuranceFormComtroller.CreatePropertyInsurance';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
export default class PropertyInsuranceForm extends NavigationMixin(LightningElement) {
    @track accounts = [];
    @track isModalOpen = false; 
    @api accountId;
    @api recordType;
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
    @track propertyType = '';
    @track naturalDisasterCoverage = false;
    @track propertyAddress = '';
    @track fireCoverage = false;
    @track yearOfConstruction = '';
    @track liabilityCoverage = '';
    @track reconstructionCost = '';
    @track floodCoverage = false;
    @track accountId;
    @track accountDetail;

    // Property Type Options
    propertyTypeOptions = [
        { label: 'Residential', value: 'Residential' },
        { label: 'Commercial', value: 'Commercial' },
        { label: 'Industrial', value: 'Industrial' }
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
    connectedCallback() {
        this.fetchAccountDetail();
        if (this.accountId) {
            console.log('Received Account ID:', this.accountId);
        }
         if (this.recordType) {
            console.log('Received recordType ID:', this.recordType);
        }
    }

fetchAccountDetail(){
     getAccountDetails({ accountId: this.accountId })
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
assingglobal(){
    this.newAccount=this.accountDetail.Id;
    this.firstName=this.accountDetail.FirstName__c;
    this.lastName=this.accountDetail.Last_Name__c;
    this.phoneNo=this.accountDetail.Phone_number__c;
    this.gender=this.accountDetail.Gender__c;
}

    // Handle form input changes
    handleInputChange(event) {
        const field = event.target.dataset.field;
        this[field] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

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
            propertyType: this.propertyType,
            naturalDisasterCoverage: this.naturalDisasterCoverage,
            propertyAddress: this.propertyAddress,
            fireCoverage: this.fireCoverage,
            yearOfConstruction: this.yearOfConstruction,
            liabilityCoverage: this.liabilityCoverage,
            reconstructionCost: this.reconstructionCost,
            floodCoverage: this.floodCoverage
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
            propertyType: this.propertyType,
            naturalDisasterCoverage: this.naturalDisasterCoverage,
            propertyAddress: this.propertyAddress,
            fireCoverage: this.fireCoverage,
            yearOfConstruction: this.yearOfConstruction,
            liabilityCoverage: this.liabilityCoverage,
            reconstructionCost: this.reconstructionCost,
            floodCoverage: this.floodCoverage
        })
        
           
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
        this.propertyType = '';
        this.naturalDisasterCoverage = false;
        this.propertyAddress = '';
        this.fireCoverage = false;
        this.yearOfConstruction = '';
        this.liabilityCoverage = '';
        this.reconstructionCost = '';
        this.floodCoverage = false;
    }


}