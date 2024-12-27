import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveClaimRecord from '@salesforce/apex/ClaimController.saveClaimRecord';
import getpolicydetails from '@salesforce/apex/ClaimController.getpolicydetails';
import getaddress from '@salesforce/apex/ClaimController.getaddress';
import getBeneficiaries from '@salesforce/apex/ClaimController.searchBeneficiaries';
import getBeneficiaryDetails from '@salesforce/apex/ClaimController.getBeneficiaryDetails';
export default class ClaimManagementInsurance extends LightningElement {

    @track showForm = true;
    @track claimId;
    @track addinput = false;
    @track otherValue = '';
    @track currentRecordId;
    @track showbenefiForm = false;
    @track claimData = {};
    @track claimDatas = {};
    @track beneficiaryDetails = {};
    @track Policydetails = {};
    @track accId;
    @track gender = '';
    @track claimDetails = '';
    @track hospitalName='' ;
    @track admissionDate = '';
    @track admissionTime = '';
    @track dischargeDate = '';
    @track dischargeTime = '';
    @track handleOtherInputChange = '';
    @track selectedDocuments = [];
    @track selectedHospitalizationReason;
    @track beneficiaryOptions = [];
    @track selectedBeneficiaryId;
    @track currentRecordId;
    @track admissionDateTime;
    @track dischargeDateTime;
    @track RecordTypeId='';
    @track pName;
    @track AmountToClaim='';
    @track pLastName;
    @track pMobile;
    @track pgender;
    @track pPanCard;
    @track pDob;
    @track pAddress;
    @track pCity;
    @track pstate='';
    @track pcountry='';
    @track ppincode='';
    @track beneficiaryId;
    @track bName;
    @track bGender;
    @track baadhar;
    @track bDob;
    @track genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' }
    ];
    @track documentOptions = [
        { label: 'Hospital Main Bill', value: 'Hospital Main Bill' },
        { label: 'Pharmacy Bill', value: 'Pharmacy Bill' },
        { label: 'ECG', value: 'ECG' },
        { label: 'Doctor’s Prescription', value: 'Doctor’s Prescriptions' },
        { label: 'Others', value: 'Others' }
    ];
    @track reson = [
        { label: 'Injury', value: 'Injury' },
        { label: 'Illness', value: 'Illness' },
        { label: 'Maternity', value: 'Maternity' }
    ];
    @track relationshipOptions = [
        { label: 'Spouse', value: 'Spouse' },
        { label: 'Child', value: 'Child' },
        { label: 'Parent', value: 'Parent' },
        { label: 'Other', value: 'Other' }
    ];

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        // Check if the recordId exists in the page state
        if (currentPageReference) {
            this.currentRecordId = currentPageReference.state.recordId;
            console.log('Current Record ID:', this.currentRecordId);
        }
    }

    connectedCallback() {
        this.fetchpolicydetails();
        this.fetchBeneficiaries();
    }
    fetchpolicydetails() {
        getpolicydetails({ recordId: this.currentRecordId })
            .then(result => {
                console.log('Policy Details:', result); // Debugging log
                this.claimDatas = result; // Corrected property assignment
                this.error = undefined;
                this.accId = result.Customer_Name__c;
                console.log('accId details:', this.accId);
                this.fetchaddress();
                this.assingprimarydetails();
            })
            .catch(error => {
                console.log('Error fetchinaccount details:', error); // Debugging log
                this.error = error;
                this.claimDatas = undefined;
            });
    }
    assingprimarydetails() {
        this.pName = this.claimDatas.First_Name__c;
        this.pLastName = this.claimDatas.Last_Name__c;
        this.pgender = this.claimDatas.Gender__c;
        this.pMobile = this.claimDatas.Phone_No__c
    }
    fetchaddress() {
        getaddress({ AccId: this.accId })
            .then(result => {
                console.log('Policy Details:', result); // Debugging log
                this.Policydetails = result; // Corrected property assignment
                this.error = undefined;
                this.assingaddress();
            })
            .catch(error => {
                console.log('Error fetchinaccount details:', error); // Debugging log
                this.error = error;
                this.Policydetails = undefined;
            });
    }
    assingaddress() {
        this.pDob = this.Policydetails.DateOfBirth__c;
        this.pPanCard = this.Policydetails.PANCardNo__c;
        this.pAddress = this.Policydetails.CommunicationResidentAddress__c;
        this.pCountry = this.Policydetails.Country__c;
        this.pState = this.Policydetails.State__c;
        this.pCity = this.Policydetails.City__c;
        this.pPincode = this.Policydetails.PinCode__c;
    }
    handleRadioChange(event) {
        const selectedValue = event.target.value;
        this.showForm = selectedValue === 'self' || selectedValue === 'beneficiary';
        this.showbenefiForm = selectedValue === 'beneficiary';
        if (this.showForm && !this.showbenefiForm) {
            this.RecordTypeId = '012J4000000090eIAA';
        }
        if (this.showForm && this.showbenefiForm) {
            this.RecordTypeId = '012J4000000090yIAA';
        }
        this.claimData = {}; // Clear data when switching forms
    }

    // handleInputChange(event) {
    //     const field = event.target.dataset.id;
    //     const value = event.target.value;

    //     // Update the claimData object with the new value
    //     this.claimData[field] = value;

    //     // Handle specific fields for datetime construction
    //     if (field === 'admissionDate' || field === 'admissionTime') {
    //         const date = this.claimData['admissionDate'];
    //         const time = this.claimData['admissionTime'];
    //         this.admissionDateTime = date && time ? new Date(`${date}T${time}`) : null;
    //     }
    //     if (field === 'dischargeDate' || field === 'dischargeTime') {
    //         const date = this.claimData['dischargeDate'];
    //         const time = this.claimData['dischargeTime'];
    //         this.dischargeDateTime = date && time ? new Date(`${date}T${time}`) : null;
    //     }
    // }


    handleClear() {
        this.claimData = {}; // Clear all fields
    }

    handleClose() {
        // Close or hide the component
        this.dispatchEvent(new CustomEvent('close'));
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(evt);
    }

    handleDocumentChange(event) {
        this.selectedDocuments = event.detail.value;
        console.log('Selected Documents:', this.selectedDocuments);
        // Check if 'Others' is selected
        this.addinput = this.selectedDocuments.includes('Others');
    }

    handleOtherInputChange(event) {
        this.otherValue = event.target.value;
        console.log('Other Input Value:', this.otherValue);
    }

    fetchBeneficiaries() {
        getBeneficiaries({ recId: this.currentRecordId })
            .then(result => {
                this.beneficiaryOptions = result.map(beneficiary => ({
                    label: beneficiary.Name,
                    value: beneficiary.Id
                }));
                console.log('Fetched Beneficiaries:', this.beneficiaryOptions); // Debugging log
            })
            .catch(error => {
                console.error('Error fetching beneficiaries:', error);
            });
    }

    handleBeneficiaryChange(event) {
        this.selectedBeneficiaryId = event.detail.value;
        this.beneficiarydetails(); // Fetch details of the selected beneficiary
        console.log('Selected Beneficiary ID:', this.selectedBeneficiaryId); // Debugging log
    }

    beneficiarydetails() {
        getBeneficiaryDetails({ benId: this.selectedBeneficiaryId })
            .then(result => {
                console.log('Fetched Beneficiary Details:', JSON.stringify(result)); // Inspect all fields
                this.beneficiaryDetails = result;
                this.assignbeneficiary();
            })
            .catch(error => {
                console.error('Error fetching beneficiary details:', error);
            });

    }
    assignbeneficiary() {
        this.beneficiaryId = this.beneficiaryDetails.Id;
        this.bName = this.beneficiaryDetails.Name;
        this.bGender = this.beneficiaryDetails.Gender__c;
        this.baadhar = this.beneficiaryDetails.Aadhar_Number__c;
        this.bDob = this.beneficiaryDetails.Date_of_Birth__c;
    }

   handleInputChange(event) {
    const field = event.target.dataset.id;
    const value = event.target.value;

    // Update the claimData object with the new value
    this.claimData[field] = value;

    // Handle specific fields for datetime construction
    if (field === 'admissionDate' || field === 'admissionTime') {
        const date = this.claimData['admissionDate'];
        const time = this.claimData['admissionTime'];
        this.admissionDateTime = date && time ? new Date(`${date}T${time}`) : null;
    }
    if (field === 'dischargeDate' || field === 'dischargeTime') {
        const date = this.claimData['dischargeDate'];
        const time = this.claimData['dischargeTime'];
        this.dischargeDateTime = date && time ? new Date(`${date}T${time}`) : null;
    }
}

handleSave() {
    // Convert selectedDocuments array to a string by joining values
    const selectedDocumentsString = this.selectedDocuments.join(', ');

    console.log('Data Saved>>>', JSON.stringify({
        InsurancePolicy: this.currentRecordId,
        RecordTypeId: this.RecordTypeId,
        pName: this.pName,
        plastName: this.pLastName,
        pMobileno: this.pMobile,
        pgender: this.pgender,
        pPanno: this.pPanCard,
        pDobno: this.pDob,
        pAdd: this.pAddress,
        pcity: this.pCity,
        pstate: this.pState,
        pcountry: this.pCountry,
        ppincode: this.pPincode,
        policyBeneficiary: this.beneficiaryId,
        bname: this.bName,
        bgender: this.bGender,
        baadharno: this.baadhar,
        bdob: this.bDob,
        claimDetails: this.claimData['claimDetails'],
        hospitalName: this.claimData['hospitalName'],
        admissionDateTime: this.admissionDateTime,
        dischargeDateTime: this.dischargeDateTime,
        selectedDocuments: selectedDocumentsString,
        AmountToClaim:this.claimData['AmountToClaim'],  // Pass the string
        //selectedHospitalizationReason: this.selectedHospitalizationReason,
    }));

    saveClaimRecord({
        InsurancePolicy: this.currentRecordId,
        RecordTypeId: this.RecordTypeId,
        pName: this.pName,
        plastName: this.pLastName,
        pMobileno: this.pMobile,
        pgender: this.pgender,
        pPanno: this.pPanCard,
        pDobno: this.pDob,
        pAdd: this.pAddress,
        pcity: this.pCity,
        pstate: this.pState,
        pcountry: this.pCountry,
        ppincode: this.pPincode,
        policyBeneficiary: this.beneficiaryId,
        bname: this.bName,
        bgender: this.bGender,
        baadharno: this.baadhar,
        bdob: this.bDob,
        claimDetails: this.claimDetails,
        hospitalsName: this.claimData['hospitalName'],
        admissionDate: this.admissionDateTime,
        dischargeDate: this.dischargeDateTime,
        selectedDocuments: selectedDocumentsString,  // Pass the string
        selectedHospitalizationReason: this.selectedHospitalizationReason,
        AmountToClaim:this.claimData['AmountToClaim'], 
    })
    .then((result) => { 
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record saved successfully!',
                variant: 'success',
            })
        );
        this.claimId = result;
    })
    .catch((error) => {
        console.error('Error saving claim:', error);
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: 'Failed to save record: ' + (error.body?.message || 'Unknown error'),
                variant: 'error',
            })
        );
    });
}




}