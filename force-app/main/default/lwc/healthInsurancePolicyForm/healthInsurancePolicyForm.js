import { LightningElement, track, api } from 'lwc';
import savePolicyData from '@salesforce/apex/HealthInsurancePolicyController.savePolicyData';
import getAccountDetails from '@salesforce/apex/AccountRelationshipController.getAccountDetails';
import SaveBeneficiaries from '@salesforce/apex/HealthInsurancePolicyController.SaveBeneficiary';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import spousemom from '@salesforce/resourceUrl/spousemom';
// import { refreshApex } from '@salesforce/apex'; 
import { NavigationMixin } from 'lightning/navigation'; // Import NavigationMixin
export default class HealthInsurancePolicyForm extends NavigationMixin(LightningElement) {

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
    @track coveragAmount = null;
    @track status = '';
    @track AadharNo='';
    @track paymentFrequency = '';
    @track underwritingStatus = '';
    @track policyStartDate = '';
    @track policyEndDate = '';
    @track claimable = false;
    @track networkHospitals = '';
    @track hospitalizationCoverage = null;
    @track criticalIllnessCovered = '';
    @track preExistingConditionsCoverage = false;
    @track opdCoverage = false;
    @track coPayPercentage = null;
    spouseUrl=spousemom;
    @track accountDetails;
    @track accountDetail;
    @track polocyid='';
    @api accountId;
    @api recordId;
    @api premimumAmount;
    @api coverageAmount;
    @api selectedMebers;
    @api policyPlanyear;
    @track covetrageamt;
connectedCallback() {
        this.fetchAccountDetails();
        if (this.accountId) {
            console.log('Received Account ID in health:', this.accountId);
            console.log('prmimumamt>>'+this.premimumAmount);
            this.covetrageamt=(this.coverageAmount*100000);
            this.policyPremiumAmount=this.premimumAmount;
            console.log('covamt>>'+this.coverageAmount);
             console.log('this.selectedMembers>>>', JSON.stringify(this.selectedMebers));
        }
    }
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
    assingpersnoal() {
        this.newAccount = this.accountDetails.Id;
        this.firstName = this.accountDetails.FirstName__c;
        this.lastName = this.accountDetails.Last_Name__c;
        this.phoneNo = this.accountDetails.Phone_number__c;
        this.gender = this.accountDetails.Gender__c;
        this.AadharNo=this.accountDetails.Aadhar_Number__c;
    }
    handleNext() {
        // Show the document upload section when "Next" is clicked
        this.showUploadSection = true;
    }
    handleBack() {
        // Hide the upload section and reset any necessary properties
        this.showUploadSection = false;
        // Optionally, reset any form fields or state variables if needed
        // For example, this.resetForm(); // Uncomment if you want to reset the form
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


    handleInputChange(event) {
    const field = event.target.dataset.field;
    this[field] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    if (field === 'policyStartDate') {
        this.calculatePolicyEndDate();
    }
}

calculatePolicyEndDate() {
    if (this.policyStartDate && this.policyPlanyear) {
        const startDate = new Date(this.policyStartDate);
        const yearsToAdd = parseInt(this.policyPlanyear, 10); // Ensure yearsToAdd is a number

        if (!isNaN(yearsToAdd)) {
            // Calculate the end date
            const endDate = new Date(
                startDate.getFullYear() + yearsToAdd,
                startDate.getMonth(),
                startDate.getDate()
            );
            // Format the date in yyyy-mm-dd for the date input
            this.policyEndDate = endDate.toISOString().split('T')[0];
        } else {
            console.error('Invalid number of years in policyPlanyear');
        }
    } else {
        console.warn('Policy Start Date or Policy Plan Year is missing');
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
        console.log('Data committed:', {
            newAccountId: this.newAccount,
            RecordTypeId: this.recordId,
            firstName: this.firstName,
            lastName: this.lastName,
            customerEmail: this.customerEmail,
            phoneNo: this.phoneNo,
            gender: this.gender,
            nominee: this.nominee,
            policyBeneficiary: this.policyBeneficiary,
            policyPremiumAmount: this.premimumAmount,
            covetrageamt: this.covetrageamt,
            status: this.status,
            aadharNo:this.AadharNo,
            paymentFrequency: this.paymentFrequency,
            underwritingStatus: this.underwritingStatus,
            policyStartDate: this.policyStartDate,
            policyEndDate: this.policyEndDate,
            claimable: this.claimable,
            criticalIllnessCovered: this.criticalIllnessCovered,
            preExistingConditionsCoverage: this.preExistingConditionsCoverage,
            opdCoverage: this.opdCoverage,
            coPayPercentage: parseFloat(this.coPayPercentage)
        });
        savePolicyData({
            newAccountId: this.newAccount,
            RecordTypeId: this.recordId,
            firstName: this.firstName,
            lastName: this.lastName,
            customerEmail: this.customerEmail,
            phoneNo: this.phoneNo,
            gender: this.gender,
            nominee: this.nominee,
            policyBeneficiary: this.policyBeneficiary,
            policyPremiumAmount: this.premimumAmount,
            covetrageamt: this.covetrageamt,
            status: this.status,
            aadharNo:this.AadharNo,
            paymentFrequency: this.paymentFrequency,
            underwritingStatus: this.underwritingStatus,
            policyStartDate: this.policyStartDate,
            policyEndDate: this.policyEndDate,
            claimable: this.claimable,
            criticalIllnessCovered: this.criticalIllnessCovered,
            preExistingConditionsCoverage: this.preExistingConditionsCoverage,
            opdCoverage: this.opdCoverage,
            coPayPercentage: parseFloat(this.coPayPercentage)
        })
        .then(result => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Record saved successfully!',
                    variant: 'success'
                })
            );
            this.polocyid=result;
             console.log('in save polocyid>>'+this.polocyid);
            console.log('resultid>>'+result);
            // Navigate to the new insurance policy record
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: result, 
                    objectApiName: 'Insurance_Policy__c',
                    actionName: 'view'
                }
            });
            this.saveBeneficiaries();
            this.resetForm();
            this.handleCloseModal();
           // this.dispatchEvent(new CustomEvent('save'));
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
   
// saveBeneficiaries() {
//     if (!this.selectedMebers || this.selectedMebers.length === 0) {
//         this.dispatchEvent(
//             new ShowToastEvent({
//                 title: 'Error',
//                 message: 'No members selected to save.',
//                 variant: 'error'
//             })
//         );
//         return;
//     }

//     const promises = this.selectedMebers.map(member => {
//         return SaveBeneficiaries({
//             newAccountId: this.newAccount, 
//             firstName: member.fullname,      
//             policyId: this.polocyid        
//         });
//     });

//     Promise.all(promises)
//         .then(results => {
//             this.dispatchEvent(
//                 new ShowToastEvent({
//                     title: 'Success',
//                     message: 'All beneficiaries saved successfully!',
//                     variant: 'success'
//                 })
//             );
//             console.log('Saved beneficiary IDs:', results);
//         })
//         .catch(error => {
//             console.error('Error saving beneficiaries:', error);
//             this.dispatchEvent(
//                 new ShowToastEvent({
//                     title: 'Error',
//                     message: 'Failed to save beneficiaries: ' + (error.body?.message || 'Unknown error'),
//                     variant: 'error'
//                 })
//             );
//         });
// }

saveBeneficiaries() {
    if (!this.selectedMebers || this.selectedMebers.length === 0) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: 'No members selected to save.',
                variant: 'error'
            })
        );
        return;
    }
    

    // Filter out members whose name is 'Self'
    const membersToSave = this.selectedMebers.filter(member => member.name !== 'Self');

     console.log('polocyid>>'+this.polocyid);
    const promises = membersToSave.map(member => {
        return SaveBeneficiaries({
            newAccountId: this.newAccount, 
            firstName: member.fullname,
            Dob:member.dob,      
            policyId: this.polocyid,
            AadharNo:member.AadharNo
            
        });
    });

    Promise.all(promises)
        .then(results => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'All eligible beneficiaries saved successfully!',
                    variant: 'success'
                })
            );
            console.log('Saved beneficiary IDs:', results);
        })
        .catch(error => {
            console.error('Error saving beneficiaries:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Failed to save beneficiaries: ' + (error.body?.message || 'Unknown error'),
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
    this.covetrageamt = null;
    this.status = '';
    this.paymentFrequency = '';
    this.underwritingStatus = '';
    this.policyStartDate = '';
    this.policyEndDate = '';
    this.claimable = false;
    this.criticalIllnessCovered = '';
    this.preExistingConditionsCoverage = false;
    this.opdCoverage = false;
    this.coPayPercentage = null;

    // if (this.accountDetails) {
    //     refreshApex(this.accountDetails)
    //         .then(() => {
    //             console.log('Page refreshed successfully.');
    //         })
    //         .catch(error => {
    //             console.error('Error refreshing the page:', error);
    //         });
    // }
}
}