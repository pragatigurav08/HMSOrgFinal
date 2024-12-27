import { LightningElement, track, wire, api } from 'lwc';
import getAccountDetails from '@salesforce/apex/AccountRelationshipController.getAccountDetails';
import getRecordTypes from '@salesforce/apex/InsuranceDetailsController.getRecordTypes';
import saveInsuranceDetails from '@salesforce/apex/InsuranceDetailsController.saveInsuranceDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class NewInsuranceForm extends LightningElement {
    @api accountId;
    @api recordType;
    @track accountDetail;
    @track isModalOpen = false;
    @track isLifeInsurance = false;
    @track isAutomobileInsurance = false;
   

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
    @wire(getRecordTypes, { objectApiName: 'Insurance_Policy__c' })
    wiredRecordTypes({ error, data }) {
        if (data) {
            this.recordTypeOptions = data.map(recordType => ({
                label: recordType.label,
                value: recordType.value
            }));
        } else if (error) {
            console.error('Error fetching record types: ', error);
        }
    }
   
    connectedCallback() {
        this.fetchAccountDetail();
        if (this.accountId) {
            console.log('Received Account ID:', this.accountId);
        }
         if (this.recordType) {
            console.log('Received recordType ID:', this.recordType);
        }
    }
    fetchAccountDetail() {
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

    handleCommit() {
        const accountIds = this.newAccount;
        console.log('accountidin commit>>' + accountIds);
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

            //    this[NavigationMixin.Navigate]({
            //     type: 'standard__webPage',
            //     attributes: {
            //         url: `https://companycom-45b-dev-ed.develop.my.site.com/EliteFinance/s/accountdetails?recordId=`+accountIds
            //     }
            //     })

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
}


}