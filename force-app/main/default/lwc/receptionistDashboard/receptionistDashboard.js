import { LightningElement,wire,track,api } from 'lwc';
import getTodayAppointments from '@salesforce/apex/ReceptionistDashboard.getTodayAppointments';//pavithra
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import doctorImage from '@salesforce/resourceUrl/doctorImage';
import receptionImage from '@salesforce/resourceUrl/receptionImage';
import chartjs from '@salesforce/resourceUrl/graphChart';
import { loadScript } from 'lightning/platformResourceLoader';
import getHealthMetrics from '@salesforce/apex/GraphController.getHealthMetrics';
import getAppointmentCounts from '@salesforce/apex/GraphController.getAppointmentCounts';
import updateStageInBackend from '@salesforce/apex/ReceptionistDashboard.updateStageInBackend'; 
import getProgressStages from '@salesforce/apex/ReceptionistDashboard.getProgressStages';
import bookAppointmentSlot from '@salesforce/apex/ReceptionistDashboard.bookAppointmentSlot';

import deletePatient from '@salesforce/apex/ReceptionistDashboard.deletePatient';
import { refreshApex } from '@salesforce/apex'; 
//import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getDoctors from '@salesforce/apex/ReceptionistDashboard.getDoctors'; 

//import getDoctors1 from '@salesforce/apex/DoctorController.getDoctors'; 
import bookSlot1 from '@salesforce/apex/ReceptionistDashboard.bookSlot1';// Import the Apex method
import rescheduleAppointment from '@salesforce/apex/ReceptionistDashboard.rescheduleSlot';
import getAppointmentDetails from '@salesforce/apex/ReceptionistDashboard.getAppointmentDetails';

//import getAppointmentsByDoctor from '@salesforce/apex/ReceptionistDashboard.getAppointmentsByDoctor'; 
import getRegisteredPatients from'@salesforce/apex/ReceptionistDashboard.getRegisteredPatients';
import getAppointmentPatients from'@salesforce/apex/ReceptionistDashboard.getAppointmentPatients';

//import getDepartments from'@salesforce/apex/ReceptionistDashboard.getDepartments';
//import getDoctorsByDepartment from'@salesforce/apex/ReceptionistDashboard.getDoctorsByDepartment';
//import bookSlot from'@salesforce/apex/ReceptionistDashboard.bookSlot';
//import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 

//import register from '@salesforce/resourceUrl/register';
import registerPatient from '@salesforce/apex/ReceptionistDashboard.registerPatient';
//import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getDoctorCount from '@salesforce/apex/ReceptionistDashboard.getDoctorCount'; 
import getTotalDoctorCount from '@salesforce/apex/ReceptionistDashboard.getTotalDoctorCount'; 
import getPatientCount from '@salesforce/apex/ReceptionistDashboard.getPatientCount'; 
import getNewPatientsToday from '@salesforce/apex/ReceptionistDashboard.getNewPatientsToday'; 
//import getNewDoctorsToday from '@salesforce/apex/ReceptionistDashboard.getNewDoctorsToday'; 
import getAppointmentsToday from '@salesforce/apex/ReceptionistDashboard.getAppointmentsToday'; 

import getCurrentUserNameIfDoctor from '@salesforce/apex/ReceptionistDashboard.getCurrentUserNameIfStaff';
import defaultProfileImage from '@salesforce/resourceUrl/defaultProfileImage';
import fetchMedicalRecords from '@salesforce/apex/ReceptionistDashboard.fetchMedicalRecords';
import getDoctorPicklistValues from '@salesforce/apex/ReceptionistDashboard.getDoctorPicklistValues'; 
import getBloodGroupPicklistValues from '@salesforce/apex/ReceptionistDashboard.getBloodGroupPicklistValues';


import availableDoctors1 from '@salesforce/apex/ReceptionistDashboard.availableDoctors1';

import receptionClinic from '@salesforce/resourceUrl/receptionClinic';
import receptionProfile from '@salesforce/resourceUrl/receptionProfile';
import receptionRightSiteBar from '@salesforce/resourceUrl/receptionRightSiteBar';
import bookApointment from '@salesforce/resourceUrl/bookApointment';
import receptionPatient from '@salesforce/resourceUrl/receptionPatient';
import receptionPatientImg1 from '@salesforce/resourceUrl/receptionPatientImg1';
import receptionDoctorImg from '@salesforce/resourceUrl/receptionDoctorImg';
import receptionAppointmentImg from '@salesforce/resourceUrl/receptionAppointmentImg';
import progress_billing from '@salesforce/resourceUrl/progress_billing';
import progress_medication from '@salesforce/resourceUrl/progress_medication';
import progress_scheduled from '@salesforce/resourceUrl/progress_scheduled';
import progress_registration from '@salesforce/resourceUrl/progress_registration';

//import savePatientDetails from '@salesforce/apex/ReceptionistDashboard.storePatientData';
//import savePatient from '@salesforce/apex/ReceptionistDashboard.savePatient';


/*
const COLUMNS = [
    { label: 'First Name', fieldName: 'Name', type: 'text' },
    { label: 'Email', fieldName: 'Email__c', type: 'text' },
    { label: 'Mobile Number', fieldName: 'phone_number__c', type: 'text' },
    { label:'Book Appointment',type: 'button', typeAttributes: { label: 'Book Slot', name: 'book_slot',  title:'Book Appointment',
    variant: 'brand' } },
    { label:'Reschedule Appointment',type: 'button', typeAttributes: { label: 'Reschedule', name: 'reschedule_slot',  title:'Reschedule Appointment',
    variant: 'brand' } }  
    ];  
*/
   /* const COLUMNS1 = [
        {
            label: 'First Name',
            fieldName: 'Name',
            type: 'button',
            typeAttributes: {
                label: { fieldName: 'Name' },
                name: 'viewProfile',
                variant: 'base'
            }
        },
        { label: 'Email', fieldName: 'Email__c' },
        { label: 'Mobile Number', fieldName: 'phone_number__c' },
        {
            label: 'Remove Patient',
            type: 'button',
            typeAttributes: {
                label: 'Delete',
                name: 'Delete',
                variant: 'brand',
                title: 'Delete',
                disabled: false,
                value: 'Delete',
                iconPosition: 'left'
            }
        },
        {
            label: 'Edit Patient',
            type: 'button',
            typeAttributes: {
                label: 'Edit',
                name: 'Edit',
                variant: 'brand',
                title: 'Edit',
                disabled: false,
                value: 'Edit',
                iconPosition: 'left'
            }
        }
    ];*/


   /* const COLUMNS1 = [
        {
            label: 'First Name',
            fieldName: 'Name',
            type: 'button',
            
            typeAttributes: {
                label: { fieldName: 'Name' },
                name: 'viewProfile',
                variant: 'base'
            },
            cellAttributes: {
                class: 'custom-cell-bold'
            }
            
        },
        {
            label: 'Email',
            fieldName: 'Email__c',
           
            cellAttributes: {
                alignment: 'left',
                class: 'custom-cell-light'
            }
           
        },
        {
            label: 'Mobile Number',
            fieldName: 'phone_number__c',
            
            cellAttributes: {
                alignment: 'center',
                class: 'custom-cell-highlight'
            }
        },
        {
            label: 'Remove Patient',
            type: 'button-icon',
           
            typeAttributes: {
                iconName: 'utility:delete',
                name: 'Delete',
                variant: 'border-filled',
                title: 'Delete',
                disabled: false,
                alternativeText: 'Delete'
            },
            cellAttributes: {
                alignment: 'center'
            }
        },
        {
            label: 'Edit Patient',
            type: 'button-icon',
           
            typeAttributes: {
                iconName: 'utility:edit',
                name: 'Edit',
                variant: 'border-filled',
                title: 'Edit',
                disabled: false,
                alternativeText: 'Edit'
            },
            cellAttributes: {
                alignment: 'center'
            }
        }
    ];
*/

const COLUMNS = [
    { label: 'First Name', fieldName: 'Name', type: 'text' },
    { label: 'Email', fieldName: 'Email__c', type: 'text' },
    { label: 'Mobile Number', fieldName: 'phone_number__c', type: 'text' },
    {
        label: 'Book Appointment',
        type: 'button-icon',
        typeAttributes: {
            iconName: 'action:new_event', // Icon for booking
            name: 'book_slot', // Action name
            variant: 'border-filled', // Style of the icon button
            title: 'Book Appointment', // Tooltip text
            alternativeText: 'Book Appointment', // Accessible text
            disabled: false // Enable or disable the button
        }
    },
    {
        label: 'Reschedule Appointment',
        type: 'button-icon',
        typeAttributes: {
            iconName: 'utility:redo', // Icon for rescheduling
            name: 'reschedule_slot', // Action name
            variant: 'border-filled', // Style of the icon button
            title: 'Reschedule Appointment', // Tooltip text
            alternativeText: 'Reschedule Appointment', // Accessible text
            disabled: false // Enable or disable the button
        }
    }
];



const COLUMNS1 = [
    {
        label: 'First Name',
        fieldName: 'Name',
        type: 'button',
        typeAttributes: {
            label: { fieldName: 'Name' },
            name: 'viewProfile',
            variant: 'base'
        },
        cellAttributes: {
            class: 'custom-cell-bold'
        }
    },
    {
        label: 'Email',
        fieldName: 'Email__c',
        cellAttributes: {
            alignment: 'left',
            class: 'custom-cell-light'
        }
    },
    {
        label: 'Mobile Number',
        fieldName: 'phone_number__c',
        cellAttributes: {
            alignment: 'center',
            class: 'custom-cell-highlight mobile-hidden' /* Add a class for hiding in mobile */
        }
    },
    {
        label: 'Remove Patient',
        type: 'button-icon',
        typeAttributes: {
            iconName: 'utility:delete',
            name: 'Delete',
            variant: 'border-filled',
            title: 'Delete',
            disabled: false,
            alternativeText: 'Delete'
        },
        cellAttributes: {
            alignment: 'center'
        }
    },
    {
        label: 'Edit Patient',
        type: 'button-icon',
        typeAttributes: {
            iconName: 'utility:edit',
            name: 'Edit',
            variant: 'border-filled',
            title: 'Edit',
            disabled: false,
            alternativeText: 'Edit'
        },
        cellAttributes: {
            alignment: 'center',
            class: 'mobile-hidden' /* Add a class for hiding in mobile */
        }
    }
];

    
    
export default class ReceptionistDashboard extends LightningElement {


   /*
    @track patientName = ''; // Patient name
    @track patientGender = ''; // Gender
    @track patientBloodGroup = ''; // Blood Group

    // Gender picklist options
    genderPicklistOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' }
    ];

    // Blood group picklist options
    bloodGroupPicklistOptions = [
        { label: 'A+', value: 'A+' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B-', value: 'B-' },
        { label: 'AB+', value: 'AB+' },
        { label: 'AB-', value: 'AB-' },
        { label: 'O+', value: 'O+' },
        { label: 'O-', value: 'O-' }
    ];

    // Handle input field changes
    handleFieldChange(event) {
        const fieldName = event.target.name;
        if (fieldName === 'patientName') {
            this.patientName = event.target.value;
        } else if (fieldName === 'patientGender') {
            this.patientGender = event.target.value;
        } else if (fieldName === 'patientBloodGroup') {
            this.patientBloodGroup = event.target.value;
        }
    }

    // Save patient details
    savePatientDetails() {
        if (this.patientName && this.patientGender && this.patientBloodGroup) {
            // Call Apex method to save data
            savePatient({
                patientName: this.patientName,
                gender: this.patientGender,
                bloodGroup: this.patientBloodGroup
            })
                .then(() => {
                    // Show success toast
                    this.showToast('Success', 'Patient details saved successfully!', 'success');
                    this.resetForm();
                })
                .catch(error => {
                    // Show error toast
                    this.showToast('Error', error.body.message, 'error');
                });
        } else {
            // Show error toast for incomplete form
            this.showToast('Error', 'Please fill in all fields.', 'error');
        }
    }

    // Reset form fields
    resetForm() {
        this.patientName = '';
        this.patientGender = '';
        this.patientBloodGroup = '';
    }

    // Display toast message
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }
*/

    receptionClinic=receptionClinic;
    receptionProfile=receptionProfile;
    receptionRightSiteBar=receptionRightSiteBar;
    bookApointment=bookApointment;
    receptionPatient=receptionPatient;
    receptionPatientImg1=receptionPatientImg1;
    receptionDoctorImg=receptionDoctorImg;
    receptionAppointmentImg=receptionAppointmentImg;
    progress_registration=progress_registration;
    progress_billing=progress_billing;
    progress_medication=progress_medication;
    progress_scheduled=progress_scheduled;

    @track doctorList = []; // Updated name from doctorsCard to doctorList
 
    @wire(availableDoctors1)
    wiredDoctors({ error, data }) {
        if (data) {
            console.log('Fetched doctors:', data);
            this.doctorList = data; // Update variable name here
        } else if (error) {
            console.error('Error fetching doctors:', error);
            this.doctorList = []; // Ensure it’s an empty array in case of error
        }
    }
 
    handleViewClick1(event) {
        const doctorId = event.target.dataset.id;
        console.log('View doctor details for ID:', doctorId);
        // Add logic to handle viewing doctor details
    }



@track isDoctor=false;
    @track userName=null;
    columns1=COLUMNS1;

    @wire(getCurrentUserNameIfDoctor)
    wiredUser({ error, data }) {
        if (data) {
            this.userName = data;
            this.isDoctor = true;
             // Fetch the appointment count if user is a doctor
        } else if (error) {
            console.error('Error fetching user data:', error);
            this.userName = 'guest';
            this.isDoctor = false;
        }
    }


    get welcomeMessage() {
        return this.isDoctor ? `Welcome, ${this.userName}` : 'Welcome, guest';
    }

    //////////////////////fetch user///////////////////////////


    ///////////////////DashBoard Overview code/////////////////////////
    @track doctorCount; 
    @track totaldoctor;
    @track patientCount; 
    @track newPatientsToday; 
    @track newDoctorsToday; 
    @track appointmentsToday; 
    //@track error; 
    @track departments; 
    @track doctors; 
    @track patients;

    // Fetch the count of doctors 

    @wire(getDoctorCount) 
    wiredDoctorCount({ error, data }) { 
        if (data) { 
            this.doctorCount = data; 
            this.error = undefined; 
        } else if (error) { 
            this.error = error.body.message; 
            this.doctorCount = undefined; 
        } 

    } 

    @wire(getTotalDoctorCount) 
    wiredTotalDoctorCount({ error, data }) { 
        if (data) { 
            this.totaldoctor = data; 
            this.error = undefined; 
        } else if (error) { 
            this.error = error.body.message; 
            this.totaldoctor = undefined; 
        } 

    } 

    // Fetch the count of patients 
    @wire(getPatientCount) 
    wiredPatientCount({ error, data }) { 
        if (data) { 
            this.patientCount = data; 
            this.error = undefined; 
        } else if (error) { 
            this.error = error.body.message; 
            this.patientCount = undefined; 
        } 
    } 

    // Fetch new patients today 

    @wire(getNewPatientsToday) 

    wiredNewPatients({ error, data }) { 

        if (data) { 

            this.newPatientsToday = data; 

            this.error = undefined; 

        } else if (error) { 

            this.error = error.body.message;  

            this.newPatientsToday = undefined; 

        } 

    } 

 

    // Fetch new doctors today 

  /*  @wire(getNewDoctorsToday) 

    wiredNewDoctors({ error, data }) { 

        if (data) { 

            this.newDoctorsToday = data; 

            this.error = undefined; 

        } else if (error) { 

            this.error = error.body.message; 

            this.newDoctorsToday = undefined; 

        } 

    } */

 

    // Fetch appointments today 

    @wire(getAppointmentsToday) 

    wiredAppointmentsToday({ error, data }) { 

        if (data) { 

            this.appointmentsToday = data; 

            this.error = undefined; 

        } else if (error) { 

            this.error = error.body.message; 

            this.appointmentsToday = undefined; 

        } 

    } 



    ////////////////DashBoard Overview code/////////////////
    
    @track showDoctors = false;
    @track showAppointmentForm = false;
    @track showAppointmentDetails = false;
    @track error;
    @track appointmentName = '';
    @track selectedDoctor = '';
    @track appointmentDate = '';
    @track appointmentTime = '';
    @track doctorOptions = [];
    @track showslot= false;
   

    @wire(getDoctors)
    wiredDoctors({ error, data }) {
        if (data) {
            console.log('Fetched doctors:', data);
            this.doctors = data;
            this.doctorOptions = data.map(doctor => {
                return { label: doctor.Name, value: doctor.Id };
            });
        } else if (error) {
            console.error('Error fetching doctors:', error);
        }
    }

    handleCardClick(event) {
        const cardClass = event.currentTarget.classList;

        if (cardClass.contains('card-1')) {
            // Fetch doctors' data if the "Doctors" card is clicked
            getDoctors()
                .then(result => {
                    this.doctors = result;
                    this.showDoctors = true;
                    this.showAppointmentForm = false;
                    this.error = undefined;
                })
                .catch(error => {
                    this.error = error;
                    this.doctors = undefined;
                });
        } else if (cardClass.contains('card-2')) {
            // Show appointment form if the "Slots" card is clicked
            this.showDoctors = false;
            this.showAppointmentForm = true;
        } else {
            // Reset both if any other card is clicked
            this.showDoctors = false;
            this.showAppointmentForm = false;
        }
    }
    handleSlotClick(event) {
        this.selectedDoctor = event.currentTarget.dataset.id;
        this.showDoctors = false;

        this.showslot = true;
        
        this.showAppointmentForm = false;
        this.showAppointmentDetails = false;
        getAppointmentsByDoctor({ doctorId: this.selectedDoctor })
            .then(result => {
                this.appointments = result;
            })
            .catch(error => {
                console.error('Error fetching appointments:', error);
            });
    }

    handleInputChange(event) {
        const field = event.target.label.toLowerCase().replace(' ', '');
        this[field] = event.target.value;
    }

    handleDoctorChange(event) {
        this.selectedDoctor = event.detail.value;
    }

    handleBookAppointment() {
        // Implement your logic to book an appointment
        console.log('Appointment booked with details:', {
            appointmentName: this.appointmentName,
            selectedDoctor: this.selectedDoctor,
            appointmentDate: this.appointmentDate,
            appointmentTime: this.appointmentTime
        });
    }

//Satish code Dispaly Docter

    @track doctors = [];
    @track appointments = [];
    selectedDoctorId;

    @wire(getDoctors)
    wiredDoctors({ error, data }) {
        if (data) {
            console.log('Fetched doctors:', data); // Log fetched doctors
            this.doctors = data;
        } else if (error) {
            console.error('Error fetching doctors:', error); // Log errors
        }
    }

    handleViewClick(event) {
        this.selectedDoctorId = event.target.dataset.id;
        console.log('Selected Doctor ID:', this.selectedDoctorId); // Log selected doctor ID
        this.fetchAppointments();
    }

    fetchAppointments() {
        getAppointmentsByDoctor({ doctorId: this.selectedDoctorId })
            .then(result => {
                console.log('Fetched appointments:', result); // Log fetched appointments
                //this.appointments = result;
                this.appointments = result.map(appointment => {
                    return {
                        ...appointment,
                        formattedStartTime: this.formatDatetime(appointment.Start_Time__c),
                        formattedEndTime: this.formatDatetime(appointment.End_Time__c)
                    };
                });

                console.log('Formatted appointments:', this.appointments);
            })
            .catch(error => {
                console.error('Error fetching appointments:', error); // Log errors
            });
    }
    formatDatetime(datetime) {
        if (datetime) {
            const options = { hour: '2-digit', minute: '2-digit' };
            return new Date(datetime).toLocaleString('en-US', options);
        }
        return '';
    }


    doctorImageUrl = doctorImage;
    receptionImage = receptionImage;
    @track showDoctorDirectory = false;
    @track isDoctorDirectoryVisible = false;
 
    toggleDoctorDirectory() {
        this.showDoctorDirectory = !this.showDoctorDirectory;
        this.isDoctorDirectoryVisible = false;
        this.noAppointments = false;
        this.view = false;
    }
 
   
    handleDoctorBoxClick() {
        this.isDoctorDirectoryVisible = !this.isDoctorDirectoryVisible;;
        this.showDoctorDirectory = false;
        this.noAppointments = false;
        this.view = false;
    }


    // Slot
   /* @track patients;
@track error;
@track isModalOpen = false;
@track selectedPatientId;
@track department;
@track doctor;
@track date;
@track startTime;
@track endTime;
@track departments;
@track doctors;
@track appointmentName;

*/
columns = COLUMNS;
/*@wire(getRegisteredPatients)
wiredPatients({ error, data }) {
if (data) {
this.patients = data;
this.wiredPatientsResult = data;
this.error = undefined;
} else if (error) {
this.error = error;
this.patients = undefined;
}
}*/
/*
@wire(getRegisteredPatients)
wiredPatients(result) {
    this.wiredPatientsResult = result; // Store the entire result object for refreshApex
    if (result.data) {
        this.patients = result.data;
        this.error = undefined;
    } else if (result.error) {
        this.error = result.error;
        this.patients = undefined;
    }
}*/

@track filteredPatients = [];
@wire(getRegisteredPatients)
wiredPatients(result) {
    this.wiredPatientsResult = result; // Store the entire result object for refreshApex
    if (result.data) {
        this.patients = result.data;
        this.filteredPatients = [...this.patients];
        this.error = undefined;
    } else if (result.error) {
        this.error = result.error;
        this.patients = undefined;
    }
}

@track patientAppointment=[];
@wire(getAppointmentPatients)
wiredAppointmentPatients(result) {
    if (result.data) {
        this.appointmentPatients = result.data;
        this.patientAppointment = [...this.appointmentPatients]; // Initialize with all patients
    } else if (result.error) {
        this.error = result.error;
        this.appointmentPatients = undefined;
    }
}




/*@wire(getDepartments)
wiredDepartments({ error, data }) {
if (data) {
this.departments = data.map(dept => ({ label: dept.Name, value:
dept.Id }));
this.error = undefined;
} else if (error) {
this.error = error;
this.departments = undefined;
}
}*/
handleRowAction(event) {
const actionName = event.detail.action.name;
const row = event.detail.row;
if (actionName === 'book_slot') {
this.selectedPatientId = row.Id;
this.isModalOpen = true;
}
}
closeModal() {
this.isModalOpen1 = false;
}
/*
handleInputChange(event) {
const field = event.target.dataset.field;
if (field === 'department') {
this.department = event.target.value;
this.fetchDoctors(event.target.value);
} else if (field === 'doctor') {
this.doctor = event.target.value;
} else if (field === 'date') {
this.date = event.target.value;
} else if (field === 'startTime') {
this.startTime = event.target.value;
} else if (field === 'endTime') {
this.endTime = event.target.value;
}
}*/


/*handleInputChange(event) {
    const field = event.target.dataset.field;
    if (field === 'appointmentName') {
    this.appointmentName = event.target.value;
    } else if (field === 'department') {
    this.department = event.target.value;
    this.fetchDoctors(event.target.value);
    } else if (field === 'doctor') {
    this.doctor = event.target.value;
    } else if (field === 'date') {
    this.date = event.target.value;
    } else if (field === 'startTime') {
    this.startTime = event.target.value;
    } else if (field === 'endTime') {
    this.endTime = event.target.value;
    }
    }

*/
/*fetchDoctors(departmentId) {
getDoctorsByDepartment({ departmentId })
.then(result => {
this.doctors = result.map(doc => ({ label: doc.Name, value:
doc.Id }));
})
.catch(error => {
this.doctors = undefined;
this.dispatchEvent(
new ShowToastEvent({
title: 'Error loading doctors',
message: error.body.message,
variant: 'error'
})
);
});
}*/
/*
handleBookSlot() {
const slotDetails = {
patientId: this.selectedPatientId,
department: this.department,
doctor: this.doctor,
date: this.date,
startTime: this.startTime,
endTime: this.endTime,
appointmentName: this.appointmentName
};
bookSlot({ slotDetails })
.then(() => {
this.dispatchEvent(
new ShowToastEvent({
title: 'Success',
message: 'Slot booked successfully',
variant: 'success'
})
);

this.resetFields();

this.closeModal();

})
.catch(error => {
this.dispatchEvent(
new ShowToastEvent({
title: 'Error',
message: error.body.message,
variant: 'error'
})
);
});
}

resetFields() {
    this.department = null;
    this.doctor = null;
    this.date = null;
    this.startTime = null;
    this.endTime = null;
    this.appointmentName = null;
    }
*/

   // growwmyImage7 =register;
////////patient registration//////////////

@track isScheduleModalOpen=false;
@track genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
];

@track isModalOpenReg = false;
@track firstName = '';
@track lastName = '';
@track age = '';
@track phoneNumber = '';
@track EmergencyNumber = '';
@track gender = '';
@track address = '';
@track Email = '';
@track bloodGroup__c = '';

@track bloodGroupOptions = [];

@wire(getBloodGroupPicklistValues)
wiredBloodGroupPicklist({ error, data }) {
    if (data) {
        console.log('Blood group picklist fetched:', data);
        this.bloodGroupOptions = data.map(option => {
            return { label: option.Label, value: option.Value };
        });
    } else if (error) {
        console.error('Error fetching blood group picklist:', error);
    }
}

openModal() {
    this.isModalOpenReg = true;
}

closeModalReg() {
    this.isModalOpenReg = false;
}
handleNext() {
    // Close the Patient Registration modal and open the Book Slot modal
    this.isModalOpenReg = false;
    this.isScheduleModalOpen = true;
    const currentIndex = this.stages.findIndex(stage => stage.value === this.currentStage);
    if (currentIndex < this.stages.length - 1) {
        const nextStage = this.stages[currentIndex + 1].value;
        this.setCurrentStage(nextStage);
    }
}

handleChange(event) {
    const { label, value } = event.detail;
    // console.log(`Field changed: ${label}, Value: ${value}`);
    if (label === 'First Name') this.firstName = value;
    else if (label === 'Last Name') this.lastName = value;
    else if (label === 'Phone Number') this.phoneNumber = value;
    else if (label === 'Emergency Number') this.EmergencyNumber = value;
    else if (label === 'Email') this.Email = value;
    else if (label === 'Age') this.age = value;
    else if (label === 'Address') this.address = value;
}

handleGenderChange(event) {
    console.log('Gender Selected:', event.target.value);
    this.gender = event.target.value;
}

handleBloodGroupChange(event) {
    console.log('Blood Group Selected:', event.target.value);
    this.bloodGroup__c = event.target.value;
}

handleRegister() {
    
    if (!this.firstName || !this.phoneNumber || !this.Email) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: 'Please fill in all required fields.',
                variant: 'error'
            })
        );
        return;
    }

    const patient = {
        Name: this.firstName,
        Last_Name__c: this.lastName,
        phone_number__c: this.phoneNumber,
        Emergency_Contact__c: this.EmergencyNumber,
        Email__c: this.Email,
        Gender__c: this.gender,
        Age__c: this.age,
        Address__c: this.address,
        blood_group__c: this.bloodGroup__c
    };

    registerPatient({ patient })
        .then((result) => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Patient registered successfully',
                    variant: 'success'
                })
            );

            this.patientBookId = result;
            this.patientName = `${this.firstName}`;
            console.log("Patient Name::::: " + this.patientName);
            console.log("Result::::: " + JSON.stringify(this.patientBookId));

            this.clearForm();
            
          

            // this.closeModalReg();
        })
        .catch(error => {
            console.error('Error:', error);

            // Display the custom error message from the Apex class
            const message = error.body && error.body.message ? error.body.message : 'An error occurred';
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: message,
                    variant: 'error'
                })
            );
        });
}



clearForm() {
    this.firstName = '';
    this.lastName = '';
    this.phoneNumber = '';
    this.EmergencyNumber = '';
    this.Email = '';
    this.gender = '';
    this.age = '';
    this.address = '';
    this.bloodGroup__c = '';
}
///////register ebded//////


    /////////New Js //////////

    @track isDashboardVisible = true;
    @track isPatientsVisible = false;
    @track isDoctorsVisible = false;
    @track isAppointmentsVisible = false;

    activeTab = 'dashboard'; // Tracks which tab is selected

    // Handle navigation
    showDashboard() {
        this.resetViews();
        this.isDashboardVisible = true;
        this.activeTab = 'dashboard';
    }

    showPatients() {
        this.resetViews();
        this.isPatientsVisible = true;
        this.activeTab = 'patients';
    }

    showDoctorsView() {
        this.resetViews();
        this.isDoctorsVisible = true;
        this.activeTab = 'doctors';
    }

    showAppointments() {
        this.resetViews();
        this.isAppointmentsVisible = true;
        this.activeTab = 'appointments';
        this.noAppointments = false;
        this.view = false;
    }
    showBilling() {
        this.resetViews(); // Reset other views
        this.isBillingVisible = true; // Set the Billing view visibility
        this.activeTab = 'billing'; // Set the active tab
        this.noBilling = false; // If applicable, reset any billing-specific flags
        this.view = false; // Set common view state if required
    }

    // Reset all views before activating another view
    resetViews() {
        this.isDashboardVisible = false;
        this.isPatientsVisible = false;
        this.isDoctorsVisible = false;
        this.isAppointmentsVisible = false;
        this.isBillingVisible = false;
    }

    // Dynamic class assignment for active tabs
    get getClassForDashboard() {
        return this.activeTab === 'dashboard' ? 'slds-nav-vertical__action active' : 'slds-nav-vertical__action';
    }

    get getClassForPatients() {
        return this.activeTab === 'patients' ? 'slds-nav-vertical__action active' : 'slds-nav-vertical__action';
    }

    get getClassForDoctors() {
        return this.activeTab === 'doctors' ? 'slds-nav-vertical__action active' : 'slds-nav-vertical__action';
    }

    get getClassForAppointments() {
        return this.activeTab === 'appointments' ? 'slds-nav-vertical__action active' : 'slds-nav-vertical__action';
    }
    get getClassForBilling() {
        return this.activeTab === 'billing' ? 'slds-nav-vertical__action active' : 'slds-nav-vertical__action';
    }
    /////////New Js //////////


//////////////////////////

@track isModalOpen = false;
    @track patient__c = ''; 
    @track patientId = '';
    @track dr__c = ''; 
    @track date = ''; 
    @track startTime = ''; 
    @track endTime = ''; 
    @track reasonToVisit = ''; 
    
    // @track sugarChecked = false; 
    // @track bpChecked = false;

    // Hold picklist values for doctors
    @track doctors = []; 
    
    @wire(getDoctorPicklistValues)
    wiredDoctorPicklist({ error, data }) {
        if (data) {
            console.log('Doctors data fetched:', data); 
            
            this.doctors = data.map(doctor => {
                return { label: doctor.Name, value: doctor.Id }; 
            });
        } else if (error) {
            console.error('Error fetching doctors:', error);
        }
    }


handleInputChange(event) {
        const field = event.target.dataset.field;
        // console.log(`Field changed: ${field}, Value: ${event.target.value}`); // Log field and value change
        if (field === 'patient__c') {
            this.patient__c = event.target.value;
        } else if (field === 'dr__c') {
            this.dr__c = event.target.value;
        } else if (field === 'date') {
            this.date = event.target.value;
        } else if (field === 'startTime') {
            this.startTime = event.target.value;
        } else if (field === 'endTime') {
            this.endTime = event.target.value;
        }else if (field === 'Reason_To_Visit__c') {
            this.reasonToVisit = event.target.value;
        } 
        // else if (field === 'Sugar__c') {
        //     this.sugarChecked = event.target.checked;
        // } else if (field === 'BP__c') {
        //     this.bpChecked = event.target.checked;
        // } 
    }

    // Close the modal
    closeModal() {
        console.log('Modal closed'); // Log modal close action
        this.isModalOpen = false;
        this.isScheduleModalOpen=false;
    }

    handleBookSlot() {
        // Prepare the slot details to send to Apex method
        const slotDetails = {
            //patientId: this.patient__c,
            patientId: this.patientId, 
            doctor: this.dr__c, // Doctor selected from picklist
            date: this.date,
            startTime: this.startTime,
            endTime: this.endTime,
            reasonToVisit: this.reasonToVisit,
            // sugarChecked: this.sugarChecked,
            // bpChecked: this.bpChecked,
        
        };
        console.log('Slot details to book:', JSON.stringify(slotDetails)); // Log slot details

        // Call Apex method to book slot
        bookSlot1({ slotDetails })
            .then((result) => {
                console.log('Slot booked successfully, result:',JSON.stringify(result)); // Log booking result
                // Show success toast message
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Slot booked successfully',
                        variant: 'success'
                    })
                );
                //this.closeModal();
                
            })
            .catch(error => {
                console.error('Error booking slot:', error); // Log booking error
                // Show error toast message
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error booking slot',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });

            // this.updateProgressBar('Scheduled');
            // this.updateStageInBackend();


    }

      
handleBookAppointmentSlot() {
    const appointmentDetails = {
        patientAppId: this.patientBookId, 
        doctor: this.dr__c,
        date: this.date,
        startTime: this.startTime,
        endTime: this.endTime,
        reasonToVisit: this.reasonToVisit
    };

    console.log('Appointment details to book:', JSON.stringify(appointmentDetails));
    bookAppointmentSlot({ appointmentDetails })
        .then((result) => {
            console.log('Appointment booked successfully, result:', result);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Appointment booked successfully',
                    variant: 'success'
                })
            );
            this.closeModal();
        })
        .catch(error => {
            console.error('Error booking appointment:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error booking appointment',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
}







    










    updateProgressBar(stageName) {
        let stageFound = false;
        this.stages = this.stages.map(stage => {
            if (stageFound) {
                return { ...stage, stageClass: 'slds-progress__item' }; 
            } else if (stage.name === stageName) {
                stageFound = true;
                return { ...stage, stageClass: 'slds-progress__item slds-is-active' }; 
            } else {
                return { ...stage, stageClass: 'slds-progress__item slds-is-completed' }; 
            }
        });
    }

    @track isModalOpenR = false;
    // Handle row action to open modal and set patient details
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row; // Get the patient details from the row
        console.log('Row action triggered, Action Name:', actionName, 'Row:', row); // Log row action details

        if (actionName === 'book_slot') {
            console.log('Opening modal for booking slot'); // Log modal open action
            this.isModalOpen = true;
            this.patientId = row.Id;
            this.patient__c = row.Name; // Set patient ID (field updated)
            console.log('Patient ID set for booking:', this.patient__c); // Log patient ID
            this.dr__c = ''; 
            this.date = '';
            this.startTime = '';
            this.endTime = ''; 
            this.reasonToVisit = '';  // Clear reason to visit
            // this.sugarChecked = false;  // Reset sugar checkbox
            // this.bpChecked = false;  // Reset BP checkbox
           

           // this.filteredPatients = this.filteredPatients.filter(patient => patient.Id !== row.Id);
        }else if (actionName === 'reschedule_slot') {
            console.log('Opening modal for rescheduling slot'); // Log modal open action
            this.isModalOpenR = true;
            this.patientId = row.Id;
            this.patient__c = row.Name; // Set patient name or ID
    
            // Fetch existing appointment details from Apex or any data source
            getAppointmentDetails({ patientId: this.patientId })
                .then((appointment) => {
                    console.log('Appointment Details:', appointment)
                    this.dr__c = appointment.Dr__c; // Set doctor
                    this.date = appointment.Date__c; // Set date
                    this.startTime = appointment.Start_Time__c; // Set start time
                    this.endTime = appointment.End_Time__c; // Set end time
                    this.reasonToVisit = appointment.Reason_To_Visit__c;
                    this.patientName = appointment.Patient__r.Name; // Patient's Name
                    // this.dr__c = appointment.Dr__r.Name;  
                    console.log('Patient Name:', appointment.Patient__r.Name);
                    console.log('Doctor Name:', appointment.Dr__r.Name);
                })
                .catch(error => {
                    console.error('Error fetching appointment details:', error);
                });
        }
       
    }


   

/////////////////////////
/* ---------------------------------------------Delete button in patients---------------------------------- */
 @track patients;
 @track error;
 @track paatID;
 @track showDeleteConfirmation = false; // Control the delete confirmation modal
 @track patientToDelete; // Stores the patient to be deleted
//@api patientId; // Set this to the patient ID passed to the component
 @track isModalOpen1 = false;
 // Handle row action
    handleRowAction1(event) {
        const actionName = event.detail.action.name; 
        const row = event.detail.row;

        if (actionName === 'viewProfile') {
            this.selectedPatient = row;
            this.showPatientDetails = true;  // Show modal for the selected patient
            this.fetchRecords();
        }
       else if (actionName === 'Delete') {
            //this.deletePatient(row.Id);  // Call the delete method with patient Id
            this.patientToDelete = row;
            this.showDeleteConfirmation = true;
        }
        
        else if (actionName === 'Edit') {
            this.paatID = row.Id;  // Call the delete method with patient Id
            this.isModalOpen1 = true;
        }
    }
    closeModal1() {
        this.isModalOpen1 = false;
        }







      /*  handleSave() {
            // This triggers the lightning-record-form submit
            this.template.querySelector('lightning-record-form').submit();
            this.closeModal();
    
            // Optional: Show a success message
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Success",
                    message: "Patient record has been updated successfully!",
                    variant: "success"
                })
            );
        }*/
        handleSave() {
        // Trigger form submission
        console.log('saved');
        this.template.querySelectorAll('lightning-record-edit-form').forEach(form => {
            form.submit();
            // this.updateProgressBar('Registered');

        });
         this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Patient record has been updated successfully!',
                variant: 'success'
            })
        );
    }

    

   

    /////////////link view of patient medical history///////////////

    fetchRecords() {
        console.log('inside fetchRecords - this.selectedPatient.Id::--' + this.selectedPatient.Id);
        try {
            fetchMedicalRecords({ patientId: this.selectedPatient.Id }) // Assuming selectedPatient has Id property
            .then((result) => {
                this.medicalRecords = result; 
                console.log('Fetched medical records::::' + JSON.stringify(result));
                this.showMedicalRecords = true; // Show medical records section
            })
            .catch((error) => {
                console.error('Error fetching medical records:::', JSON.stringify(error));
            });
        } catch (error) {
            console.log('error occured in fetchMedicalRecords:::' + JSON.stringify(error));
        }
    }

    handleCloseModal() {
        this.showPatientDetails = false;  // Hide modal
        this.showMedicalRecords = false;  // Reset medical records visibility
    }

    //////////////////////////link view of patient medical history//////////////////////////////////
    @track selectedPatient;
    @track medicalRecords = []; // Track medical records
    @track showPatientDetails = false;
    @track showMedicalRecords = false; // Track whether to show medical records
    profileImageUrl = defaultProfileImage;



    confirmDelete() {
        // Call the deletePatient method when confirmed
        this.deletePatient(this.patientToDelete.Id);
        this.showDeleteConfirmation = false; // Close the confirmation modal
        this.patientToDelete = null; // Clear the selected patient
    }

    cancelDelete() {
        // Close the confirmation modal without deleting
        this.showDeleteConfirmation = false;
        this.patientToDelete = null;
    }

    get hasRecords() {
        return this.medicalRecords && this.medicalRecords.length < 0;
    }

    deletePatient(patientId) {
    deletePatient({ patientId })
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Patient deleted successfully',
                    variant: 'success',
                })
            );
            // Refresh the list of patients after deletion
             return refreshApex(this.wiredPatientsResult); 
        })
        .catch((error) => {
            // Check if error.body and error.body.message exist
            let errorMessage = 'An error occurred'; // Default error message

            if (error && error.body && error.body.message) {
                errorMessage = error.body.message;
            } else if (error && error.message) {
                errorMessage = error.message; // Sometimes error might have 'message' directly
            }

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: errorMessage, // Use the safe error message
                    variant: 'error',
                })
            );
        });
}
/*---------------search bar event handler--------------------------*/
@track searchQuery = '';

 // Handler for search input
 handleSearchChange(event) {
    this.searchQuery = event.target.value.toLowerCase(); // Store search query in lowercase
    console.log('this.searchQuery>>>'+this.searchQuery);
//this.search=true;
    // Filter patients based on search query for multiple fields like Name, Email, Mobile Number
    if (this.searchQuery) {
        this.filteredPatients = this.patients.filter(patient => {
            console.log('patientName::'+patient.Name);
            console.log('patientEmail::'+patient.Email__c);
            console.log('patientMobile::'+patient.phone_number__c);
               if( patient.Name.toLowerCase().includes(this.searchQuery) || 
                patient.Email__c.toLowerCase().includes(this.searchQuery)||
                patient.phone_number__c.includes(this.searchQuery)){
                    console.log('Inside if>>>');
                    return patient; // Numbers don't need to be converted to lowercase

                }
                else{
                    console.log('Inside else>>>');
                    this.filteredPatients=[];
                }
        });
    } else {
        this.filteredPatients = [...this.patients]; // Reset if no search query
    }
}

////////////////////////SEARCH FOR APPOINTMENT/////////////////

@track search='';
handleSearchChange1(event) {
    this.search = event.target.value.toLowerCase(); // Store search query in lowercase
    console.log('this.search>>>'+this.search);
//this.search=true;
    // Filter patients based on search query for multiple fields like Name, Email, Mobile Number
    if (this.search) {
        this.patientAppointment = this.patients.filter(patient => {
            console.log('patientName::'+patient.Name);
            console.log('patientEmail::'+patient.Email__c);
            console.log('patientMobile::'+patient.phone_number__c);
               if( patient.Name.toLowerCase().includes(this.search) || 
                patient.Email__c.toLowerCase().includes(this.search)||
                patient.phone_number__c.includes(this.search)){
                    console.log('Inside if>>>');
                    return patient; // Numbers don't need to be converted to lowercase

                }
                else{
                    console.log('Inside else>>>');
                    this.patientAppointment=[];
                }
        });
    } else {
        this.patientAppointment = [...this.patientAppointment]; // Reset if no search query
    }
}



















/////////////////////////////Pragati doctor code here////////////////////////
 
   /* @track doctorsCard = []; 
    @track appointmentsCard = []; 
    @track selectedDoctor1 = null; 
    @track showDoctorsCard = false; 
    @track errorAppointments;
    isAppointmentsTableVisible = false;


    appointmentColumns = [
        { label: 'Patient Name', fieldName: 'Patient__r.Name', type: 'text' },
        { label: 'Date', fieldName: 'Date__c', type: 'date' },
        { label: 'Start Time', fieldName: 'formattedStartTime', type: 'time' },
        { label: 'End Time', fieldName: 'formattedEndTime', type: 'time' },
        {
            type: 'button',
            typeAttributes: {
                label: 'View Details',
                name: 'viewDetails',
                title: 'View Details',
                variant: 'brand'
            }
        }
    ];

    @wire(getDoctors)
    wiredDoctors({ error, data }) {
        if (data) {
            console.log('Fetched doctors:', data);
            this.doctorsCard = data;
        } else if (error) {
            console.error('Error fetching doctors:', error);
        }
    }

    handleCardClick(event) {
        const cardClass = event.currentTarget.classList;

        if (cardClass.contains('card-1')) {
            this.showDoctorsCard = true; 
        } else {
            this.showDoctorsCard = false; 
        }
    }

    handleViewClick(event) {
        const doctorId = event.target.dataset.id;
        const today = new Date().toISOString().split('T')[0];

        // Call Apex to fetch today's appointments for the selected doctor
        getAppointmentsByDoctor({ doctorId: doctorId, date1: today })
            .then(result => {
                this.appointmentsCard = result.map(appointment => ({
                    ...appointment,
                    formattedStartTime: this.formatDatetime(appointment.Start_Time__c),
                    formattedEndTime: this.formatDatetime(appointment.End_Time__c)
                }));
                this.selectedDoctor1 = this.doctorsCard.find(doc => doc.Id === doctorId);
                this.isAppointmentsTableVisible = true;
            })
            .catch(error => {
                this.errorAppointments = error;
                this.isAppointmentsTableVisible = true;
            });
    }

    // Helper function to format datetime to a more readable format
    formatDatetime(dateTimeString) {
        const dateTime = new Date(dateTimeString);
        return dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }


    handleRowActionCard(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if (actionName === 'viewDetails') {
            this.isAppointmentsTableVisible=true
            console.log('Viewing details for:', row);
        }
    }*/

/////////////////////////////pragati doctor code ends here//////////////////


///////////////Reschedule/////////////////

handleRescheduleSlot() {
    // Prepare the updated slot details to send to Apex method
    const updatedSlotDetails = {
        patientId: this.patientId, 
        doctor: this.dr__c, 
        date: this.date,
        startTime: this.startTime,
        endTime: this.endTime,
        reasonToVisit: this.reasonToVisit
    };

    console.log('Slot details to reschedule:', JSON.stringify(updatedSlotDetails)); // Log updated slot details

    // Call Apex method to update the appointment
    rescheduleAppointment({ updatedSlotDetails })
        .then((result) => {
            console.log('Slot rescheduled successfully, result:', result); // Log rescheduling result
            // Show success toast message
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Slot rescheduled successfully',
                    variant: 'success'
                })
            );
            this.closeRescheduleModal();
        })
        .catch(error => {
            console.error('Error rescheduling slot:', error); // Log error
            // Show error toast message
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error rescheduling slot',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
}

// Close reschedule modal
closeRescheduleModal() {
    this.isModalOpenR = false;
}

/*********************************doctors dashboard********************************************/
@wire(getDoctors)
    wiredDoctors({ error, data }) {
        if (data) {
            console.log('Fetched doctors:', data);
            this.doctorsCard = data;
        } else if (error) {
            console.error('Error fetching doctors:', error);
        }
    }

    appointmentss;
 noAppointments;
  view =false;
handleViewClick1(event) {
    this.view = !this.view;
    console.log('Clicked View Button');

    // Get doctor Id from button and log it
    const doctorId = event.target.dataset.id; 
    console.log('Doctor ID:', doctorId);

    // Fetch today's appointments for the selected doctor
    getTodayAppointments({ doctorId: doctorId })
        .then(result => {
            if (result.length > 0) {
                // Convert the Start Time and End Time from milliseconds to readable format
                this.appointmentss = result.map(appointment => {
                    return {
                        ...appointment,
                        
                        Start_Time__c: this.convertMillisecondsToTime(appointment.Start_Time__c),
                        End_Time__c: this.convertMillisecondsToTime(appointment.End_Time__c)
                    };
                });
                // Log the appointments to the console
                console.log('Appointments:', this.appointmentss);
                this.noAppointments = false;
            } else {
                // If no appointments are found
                this.appointmentss = [];
                this.noAppointments = !this.noAppointments;
                console.log('No appointments found for today.');
            }
        })
        .catch(error => {
            // Log the error and display a toast message
            console.error('Error fetching appointments:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error fetching appointments',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        });
}

// Helper function to convert milliseconds to readable time format
convertMillisecondsToTime(ms) {
    const date = new Date(ms);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();

    // Determine AM or PM suffix
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Adjust '0' hour to '12'

    // Format minutes
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    // Return formatted time as 'HH:MM AM/PM'
    return hours + ':' + minutesStr + ' ' + ampm;
}


//////graph js///////
chart; // Donut chart
barChart; // Bar chart
chartjsInitialized = false;
isChartJsLoaded = false;

// Data and config for the first (donut) chart
pendingData = [];
config = {
    type: 'doughnut',
    data: {
        datasets: [
            {
                data: [],
                backgroundColor: [
                    'rgba(173, 216, 230, 0.8)', // Light Blue
                    'rgba(144, 238, 144, 0.8)', // Light Green
                    'rgba(255, 228, 181, 0.8)', // Moccasin
                    'rgba(255, 182, 193, 0.8)'  // Light Pink
                ],
                label: 'Dataset 1'
            }
        ],
        labels: []
    },
    options: {
        responsive: true,
        legend: {
            position: 'right'
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    }
};

// Data and config for the second (bar) chart
barChartData = {
    labels: ['Today', 'This Week', 'This Month'],
    datasets: [
        {
            label: 'Appointments',
            data: [], // Dynamic data goes here
            backgroundColor: 'rgba(54, 162, 235, 0.8)', // Blue for the current week
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }
    ]
};

selectedPeriod = 'Today'; // Default selected period for appointments
periodOptions = [
    { label: 'Today', value: 'Today' },
    { label: 'This Week', value: 'This Week' },
    { label: 'This Month', value: 'This Month' },
    { label: 'This Year', value: 'This Year' }
];

// Appointment metrics data
appointmentMetrics = [];

// Handle selection change of the time period
handlePeriodChange(event) {
    this.selectedPeriod = event.target.value;
    this.fetchAppointmentsData(); // Fetch new data based on the selected period
}

// Wire to fetch health metrics data (for the first chart)
@wire(getHealthMetrics)
wiredMetrics({ data, error }) {
    if (data) {
        console.log('Metrics data:', JSON.stringify(data));
        if (this.chart) {
            data.forEach((item) => {
                this.updateChart(item.count, item.label);
            });
        } else {
            this.pendingData = data;
            console.warn('Chart not initialized when data loaded, queuing data');
        }
    } else if (error) {
        console.error('Error fetching data:', error);
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error fetching data',
                message: error.body.message,
                variant: 'error'
            })
        );
    }
}

// Wire to fetch appointment counts (for the second chart)
@wire(getAppointmentCounts)
wiredAppointmentCounts({ data, error }) {
    if (data) {
        console.log('Fetched appointment counts:', JSON.stringify(data));
        this.barChartData.datasets[0].data = [
            data.Today || 0, // Today's appointments
            data['This Week'] || 0, // This week's appointments
            data['This Month'] || 0 // This month's appointments
        ];

        if (this.barChart) {
            this.barChart.update();
        } else {
            this.appointmentMetrics = data;
        }
    } else if (error) {
        console.error('Error fetching appointment counts:', error);
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error fetching appointment counts',
                message: error.body.message,
                variant: 'error'
            })
        );
    }
}

// Initialize both charts
async connectedCallback() {
    if (this.isChartJsLoaded) {
        return;
    }

    try {
        await loadScript(this, chartjs);
        this.isChartJsLoaded = true;

        // Initialize the first (donut) chart
        const donutCanvas = this.template.querySelector('canvas.donut');
        const donutContext = donutCanvas.getContext('2d');
        this.chart = new window.Chart(donutContext, this.config);
        console.log('Donut chart initialized successfully');

        // Initialize the second (bar) chart
        const barCanvas = this.template.querySelector('canvas.chart');
        const barContext = barCanvas.getContext('2d');
        this.barChart = new window.Chart(barContext, {
            type: 'bar',
            data: this.barChartData,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        console.log('Bar chart initialized successfully');
    } catch (error) {
        console.error('Error loading Chart.js:', error);
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error loading Chart.js',
                message: error.message,
                variant: 'error'
            })
        );
    }
}

// Update the first (donut) chart with new data
updateChart(count, label) {
    if (!this.chart) {
        console.error('Chart not initialized');
        return;
    }
    console.log(`Updating chart: Label = ${label}, Count = ${count}`);
    this.chart.data.labels.push(label);
    this.chart.data.datasets[0].data.push(count);
    this.chart.update();
}

// Fetch appointment data based on selected period
fetchAppointmentsData() {
    // Modify this method to fetch data based on `this.selectedPeriod`
    console.log(`Fetching appointment data for: ${this.selectedPeriod}`);
}


@track isPatientModalOpen = false;  // Modal visibility flag
    @track patientId;                   // Patient ID
    @track patientName;                 // Patient Name
    @track doctorName;                  // Doctor Name
    @track appointmentDate;             // Appointment Date

    // Handles opening the modal and fetching billing details
    handleBillDetails(event) {
        this.isPatientModalOpen = true;
        this.patientId = event.target.dataset.id;  // Set patient ID from button's data-id
        console.log('Opening modal for patient:', this.patientId);

        // Fetch appointment details using the patient ID
        getAppointmentDetails({ patientId: this.patientId })
            .then((appointment) => {
                console.log('Appointment Details:', appointment);
                this.patientName = appointment.Patient__r.Name;  // Set Patient's Name
                this.doctorName = appointment.Dr__r.Name;        // Set Doctor's Name
                this.appointmentDate = appointment.Date__c;      // Set Appointment Date
            })
            .catch(error => {
                console.error('Error fetching appointment details:', error);
            });
    }

    // Closes the modal
    closePatientModal() {
        this.isPatientModalOpen = false;
    }







    @track stages = [
        { label: 'Registered', value: 'registered', completed: false, class: 'slds-progress__item', icon: `${progress_registration}` },
        { label: 'Scheduled', value: 'scheduled', completed: false, class: 'slds-progress__item', icon: `${progress_scheduled}` },
        { label: 'Monitoring/Recovery', value: 'Monitoring/Recovery', completed: false, class: 'slds-progress__item', icon: `${progress_scheduled}` },
        { label: 'Medication', value: 'medication', completed: false, class: 'slds-progress__item', icon: `${progress_medication}` },
        { label: 'Billing/Payment', value: 'Billing/Payment', completed: false, class: 'slds-progress__item', icon: `${progress_billing}` }
    ];
    
    @api currentStage = 'registered';
    
    connectedCallback() {
        this.updateStages(this.currentStage);
    }
    
    updateStages(currentStage) {
        let stageCompleted = true;
    
        this.stages = this.stages.map(stage => {
            if (stage.value === currentStage) {
                stageCompleted = false;
                stage.class = 'slds-progress__item slds-is-active';
            } else if (stageCompleted) {
                stage.class = 'slds-progress__item slds-is-completed';
            } else {
                stage.class = 'slds-progress__item';
            }
            return stage;
        });
    }
    
    // Expose a method to update the current stage externally
    @api
    setCurrentStage(stage) {
        this.currentStage = stage;
        this.updateStages(stage);
    }
    


// @api recordId; 
// @track selectedStage = 'Registered'; 
// Update stage in the backend
// updateStageInBackend() {
//     updateStageInBackend({ selectedStage: this.selectedStage, patientId: this.recordId })
//         .then(() => {
            
//             this.updateProgressBar(selectedStage);
//         })
//         .catch(error => {
//             console.error('Error updating stage:', JSON.stringify(error));
            
//         });
// }





/*
stages = [];

@wire(getProgressStages)
wiredStages({ error, data }) {
    if (data) {
        this.stages = data.map((stage) => ({
            ...stage,
            class: `slds-progress__item ${
                stage.status === 'completed'
                    ? 'slds-is-completed'
                    : stage.status === 'active'
                    ? 'slds-is-active'
                    : ''
            }`,
        }));
    } else if (error) {
        console.error('Error fetching progress stages:', error);
    }
}


    getStageClass(status) {
        return status === 'completed'
            ? 'slds-is-completed'
            : status === 'active'
            ? 'slds-is-active'
            : '';
    }

    getStageStyle(status) {
        return `position: absolute; color: ${
            status === 'completed' ? '#147813' : status === 'active' ? '#137cd7' : '#616161'
        }; margin-top: 25px; font-weight: ${
            status === 'active' ? '700' : '600'
        }; white-space: nowrap; font-size: 95%;`;
    }
*/
}