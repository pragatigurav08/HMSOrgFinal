import { LightningElement, track,wire } from 'lwc';
import getPatientDetailsAndRecords from '@salesforce/apex/DoctorDashboard.getPatientDetailsAndRecords';
import getAdmittedPatients from '@salesforce/apex/DoctorDashboard.getAdmittedPatients';
//import getCurrentUserNameIfDoctor from '@salesforce/apex/DoctorDashboard.getCurrentUserNameIfDoctor';
import getCurrentUserNameIfDoctor from '@salesforce/apex/ReceptionistDashboard.getCurrentUserNameIfStaff';
import dischargePatient from '@salesforce/apex/DoctorDashboard.dischargePatient';
import getTodaysAppointments from '@salesforce/apex/DoctorDashboard.getTodaysAppointments';
import getMedicalRecord from '@salesforce/apex/DoctorDashboard.getMedicalRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import fetchMedicalRecordsDoc from '@salesforce/apex/DoctorDashboard.fetchMedicalRecordsDoc';
import getTodaysAppointmentsForCurrentUser from '@salesforce/apex/DoctorDashboard.getTodaysAppointmentsForCurrentUser';
import getTotalAppointmentsForCurrentUser from '@salesforce/apex/DoctorDashboard.getTotalAppointmentsForCurrentUser';
import getUpcomingAppointments from '@salesforce/apex/DoctorDashboard.getUpcomingAppointments';
//import getTotalUpcomingAppointments from '@salesforce/apex/DoctorDashboard.getTotalUpcomingAppointments';

import doctorIcon from '@salesforce/resourceUrl/DoctorIcon';
import doctorImage from '@salesforce/resourceUrl/doctorcardImage';
import doctorAppointment from '@salesforce/resourceUrl/doctorAppointment';
import AddmitedPatients from '@salesforce/resourceUrl/AddmitedPatients';
import upcomingAppoinment from '@salesforce/resourceUrl/upcomingAppoinment';
import backgroundProfile from '@salesforce/resourceUrl/backgroundProfile';
import defaultProfileImage from '@salesforce/resourceUrl/defaultProfileImage';
import bookApointment from '@salesforce/resourceUrl/bookApointment';
import saveDiagnosisRecords from '@salesforce/apex/DoctorDashboard.saveDiagnosisRecords';
import saveMedicalDetails from '@salesforce/apex/DoctorDashboard.saveMedicalDetails';
import getMedicines from '@salesforce/apex/DoctorDashboard.getMedicines';
import getPicklistValues from '@salesforce/apex/DoctorDashboard.getPicklistValues';
import savePrescriptionRecords from '@salesforce/apex/DoctorDashboard.savePrescriptionRecords'; 


//import getTodayAppointments from '@salesforce/apex/DoctorController.getTodayAppointments';




import { getRecord } from 'lightning/uiRecordApi';
import USER_ID from '@salesforce/user/Id';
import NAME_FIELD from '@salesforce/schema/User.Name';
import saveMedicalRecord from '@salesforce/apex/DoctorDashboard.saveMedicalRecord';
import cancelAppointment from '@salesforce/apex/DoctorDashboard.cancelAppointment';
import getAdmittedPatientsCount from'@salesforce/apex/DoctorDashboard.getAdmittedPatientsCount';
import updateAvailability from '@salesforce/apex/DoctorDashboard.updateAvailability';
import getCurrentAvailability from '@salesforce/apex/DoctorDashboard.getCurrentAvailability';




export default class DashboardDoctor extends LightningElement {
    doctorAppointment=doctorAppointment;
    doctorimageIcon=doctorIcon;
    doctorcardImage=doctorImage;
    AddmitedPatients=AddmitedPatients;
    upcomingAppoinment=upcomingAppoinment;
    backgroundProfile=backgroundProfile;
    bookApointment=bookApointment;
    
    isAvailable = false; // Initial state of the toggle

    // Fetch the current availability state on component load
    connectedCallback(){
        this.getCurrentUser();
        this.fetchUpcomingAppointments();
    }

    @wire(getCurrentAvailability)
    wiredAvailability({ error, data }) {
        console.log('Fetching current availability...');
        if (data !== undefined) {
            console.log('Fetched data: ', data);
            this.isAvailable = data;
        } else if (error) {
            console.error('Error fetching availability:', error);
            this.showToast('Error', 'Failed to fetch availability.', 'error');
        }
    }
    get greetingMessage() {
        const currentHour = new Date().getHours(); // Get current hour (0-23)

        if (currentHour >= 5 && currentHour < 12) {
            return 'Good Morning';
        } else if (currentHour >= 12 && currentHour < 17) {
            return 'Good Afternoon';
        } else if (currentHour >= 17 && currentHour < 21) {
            return 'Good Evening';
        } else {
            return 'Good Night';
        }
    }
    // Handle toggle change
    handleToggleChange(event) {
        const isChecked = event.target.checked;
        console.log(`Toggle changed. New state: ${isChecked}`);
        this.updateAvailability(isChecked);
    }

    // Update availability state
    updateAvailability(isAvailable) {
        updateAvailability({ isAvailable })
            .then(() => {
                console.log(`Availability updated successfully to: ${isAvailable}`);
                this.isAvailable = isAvailable;

                // Show a success toast
                this.showToast(
                    'Success',
                    `Availability updated to ${isAvailable ? 'Available' : 'Not Available'}`,
                    'success'
                );
            })
            .catch((error) => {
                console.error('Error updating availability:', error);

                // Show an error toast
                this.showToast('Error', 'Failed to update availability.', 'error');
            });
    }

    // Utility to show a toast message
    showToast(title, message, variant) {
        console.log(`Toast Message - Title: ${title}, Message: ${message}, Variant: ${variant}`);
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant,
            })
        );
    }


    @track isAvailable = false; // Checkbox state
    @track toggleButtonLabel = 'Check-In'; // Initial button label

    // Handle toggle button click
    handleToggle() {
        this.isAvailable = !this.isAvailable; // Toggle the checkbox state
        this.toggleButtonLabel = this.isAvailable ? 'Check-Out' : 'Check-In'; // Update button label
    }







    @track homepage =true;
    @track upcomingAppointments = [];
    @track showUpcomingAppointmentsTable = false;  // Variable to toggle table visibility
    @track totalAppointments = 0;
    admittedCount=0;

    @wire(getAdmittedPatientsCount)
    wiredAdmittedPatients({ error, data }) {
        if (data) {
            this.admittedCount = data.admittedPatientsCount;
            console.log('admittedpatientsdata:::::',JSON.stringify(data));
        } else if (error) {
            console.error('Error retrieving admitted patient count:', error);
        }
    }

    @wire(getTodaysAppointmentsForCurrentUser)
    wiredTodaysAppointments({ error, data }) {
        if (data) {
            // Log the raw response data
            console.log('Apex method returned data: ', data);
            
            // Extract the data from the wrapper
            this.todaysAppointmentCount = data.todaysAppointmentsCount;

            // Log the appointment count
            console.log('Today\'s Appointment Count: ', this.todaysAppointmentCount);
        } else if (error) {
            // Log any errors that occurred
            console.error('Error fetching today\'s appointments: ', error);
            this.error = error;
        }
    }
// Columns for the appointment datatable
columnsupcomingapp = [
    { label: 'Patient Name', fieldName: 'PatientName', type: 'text' },
    { label: 'Appointment Date', fieldName: 'AppointmentDate', type: 'date' },
    { label: 'Start Time', fieldName: 'StartTime', type: 'text' },  // Changed to 'text'
    { label: 'End Time', fieldName: 'EndTime', type: 'text' }       // Changed to 'text'
];

    // Fetch upcoming appointments when the component loads

    @wire(getUpcomingAppointments)
    fetchUpcomingAppointments1({ error, data }) {
        if (data) {
            // Log the raw response data
            console.log('Apex method upcoming appointments data: ', data);
            
            // Extract the data from the wrapper
            this.totalAppointments = data.length;

            // Log the appointment count
            console.log('Today\'s Appointment Count1: ', this.totalAppointments);
        } else if (error) {
            // Log any errors that occurred
            console.error('Error fetching today\'s appointments: ', error);
            this.error = error;
        }
    }
    // Fetch upcoming appointments from Apex
    fetchUpcomingAppointments() {
        getUpcomingAppointments()
            .then(result => {
                console.log('hello world');
               this.upcomingAppointments = result;
    // Mapping the result to display in the datatable
// this.upcomingAppointments = result.map(appointment => {
//     return {
//         Id: appointment.Id,
//         PatientName: appointment.Patient__r.Name,
//         AppointmentDate: appointment.Date__c,
//         StartTime: appointment.Start_Time__c, // If necessary, format the time here
//         EndTime: appointment.End_Time__c      // If necessary, format the time here
//     };
// });
               // this.upcomingAppointments = result;
                console.log('upcomingAppointments : '+JSON.stringify(this.upcomingAppointments));
                this.totalAppointments = result.length;  // Set the total number of appointments
            })
            .catch(error => {
                console.error('Error fetching appointments:', JSON.stringify(error));
            });
    }
    get hasUpcomingAppointments() {
        return this.upcomingAppointments && this.upcomingAppointments.length > 0;
    }
    // Method to toggle the visibility of the appointments table
    handleCardClick() {
        this.fetchUpcomingAppointments();
        console.log('card clicked ');
        this.showUpcomingAppointmentsTable = !this.showUpcomingAppointmentsTable;
        console.log('showUpcomingAppointmentsTable',this.showUpcomingAppointmentsTable);
        this.isAppointmentsTableVisible = false;
        //this.totalAppointments = false;
        //this.showUpcomingAppointmentsTable = true;
        this.isTableVisible = false;

        
    }
   
   
    connectedCallback(){
        this.getCurrentUser();
        this.fetchUpcomingAppointments();
    }

    totalAppointmentCount = 0;
    todaysAppointmentCount = 0;
    error;

   

    @wire(getTotalAppointmentsForCurrentUser)
    wiredTotalAppointments({ error, data }) {
        if (data) {
            this.totalAppointmentCount = data.totalAppointmentsCount;
        } else if (error) {
            console.error('Error fetching total appointments: ', error);
            this.error = error;
        }
    }

    /*toggleAppointmentsTable() {
        console.log('Toggling appointments table.');
        // Logic to toggle the appointments table
    }*/








   
   
   
    // @track userName = null; // Holds the user's name
    @track isDoctor = false;

   /* get welcomeMessage() {
       // return this.isDoctor ? ` ${this.userName}` : 'Welcome, Guest';
       return this.userName;
    }*/
    //Admit patients //
    @track medicalRecords = [];
    //errors;
    wiredMedicalRecordsResult;
    isTableVisible = false; // Property to manage table visibility
    //Admit patients///
    @track doctors;
    @track values;
    @track error;
    @track selectedDoctor;
   // @track appointments = {};
    @track showAppointmentsTable = false;

    /////Today's Appointmet pavithra;s///
 // Appointments
 @track isModalOpen = false;
 @track selectedAppointmentId;
 @track medicalRecordId;
 @track errorMedicalRecord;
 @track appointments = [];
 @track errorAppointments;
 @track isAppointmentsTableVisible = false;
   // @api recordId;
   // @wire(getTodayAppointments, { doctorId: '$recordId' }) appointmentss;
 
    /*columns = [
        
        { label: 'Patient Name', fieldName: 'Patient__c' },
        { label: 'Contact Details', fieldName: 'Patient__r.First_Name__c' },
       
        { label: 'Appointment Date', fieldName: 'Date__c', type: 'date' }
    ];

    handleCardClick(event) {
        this.values = event.target.value;
        this.showAppointmentsTable = true;
        this.isTableVisible = false;
        this.fetchTodaysAppointments();
    }

    fetchTodaysAppointments() {
        getTodayAppointments()
            .then(result => {
                this.appointments = { data: result, error: undefined };
            })
            .catch(error => {
                this.appointments = { data: undefined, error: error };
            });
    }*/

    ///////////////////////////////////Admitted patients code starts//////////
    
///////////////////////////////////Admitted patients code starts//////////
    @wire(getAdmittedPatients)
    wiredMedicalRecords(result) {
        this.wiredMedicalRecordsResult = result;
        const { data, error } = result;
        if (data) {
            this.medicalRecords = data;
            this.error = undefined;
        } else if (error) {
            this.error= error;
            this.medicalRecords = [];
        }
    }
 
    columns = [
        { label: 'Patient Name', fieldName: 'PatientName', type: 'text' },
      //  { label: 'Prescription', fieldName: 'Prescription', type: 'text' },
        { label: 'Remarks', fieldName: 'Remarks', type: 'text' },
        { label: 'Admite Date', fieldName: 'CreatedDate', type: 'Date/Time' },
        { label: 'Admit Status', fieldName: 'AdmitStatus', type: 'boolean' },
       
        {
            label: 'Action',
            type: 'button',
            typeAttributes: {
                label: 'Discharge',
                name: 'discharge',
                title: 'Discharge Patient',
                disabled: false,
                value: 'discharge',
                iconPosition: 'left'
            }
        }
    ];
 
    /// Toggle table visibility
    toggleTable() {
       // this.showAppointmentsTable = false;
        this.isTableVisible = !this.isTableVisible;
         //this.isTableVisible = true;
        this.isAppointmentsTableVisible = false;
        this.showUpcomingAppointmentsTable = false;
    }
 
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
 
        if (actionName === 'discharge') {
            this.dischargePatient(row.Id);
        }
    }
 
    dischargePatient(medicalRecordId) {
        dischargePatient({ medicalRecordId })
            .then(() => {
                this.showToast('Success', 'Patient discharged successfully', 'success');
                return refreshApex(this.wiredMedicalRecordsResult);
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
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
//////////Admitted patients code ended///////
///////////////Getting current user name /////////////////////////////////c/
 // Wire the Apex method to fetch the user's name if they are a doctor
 /*@wire(getCurrentUserNameIfDoctor)
 wiredUser({ error, data }) {
     if (data) {
         this.userName = data;
        // this.isDoctor = true;
       //  this.fetchAppointmentCount(); // Fetch the appointment count if user is a doctor
     } else if (error) {
         console.error('Error fetching user data:', error);
         this.userName = 'guest';
        // this.isDoctor = false;
     }
 }*/

    // @track userName = '';

    //  @wire(getCurrentUserNameIfDoctor)
    //  wiredUser({ error, data }) {
    //      try {
    //          if (data) {
    //              this.userName = data;
    //              console.log('this.userName inside if:::' + this.userName);
    //          } else if (error) {
    //              // If there's an error, log it and handle it
    //              console.error('Error fetching user Name::', error);
    //              this.userName = 'guest'; // Default to guest on error
    //          }
    //      } catch (err) {
    //          // Catch any runtime errors during processing
    //          console.error('An unexpected error occurred:' +  err);
    //          this.userName = 'guest'; // Fallback to guest on unexpected error
    //      }
    //  }

    @track userName = ''; // Default value for userName

   

    getCurrentUser() {
        console.log('Inside getCurrentUser');
        getCurrentUserNameIfDoctor()
            .then((result) => {
                this.userName = result //Assign result or fallback to 'guest'
                console.log('getCurrentUser result:', this.userName);
            })
            .catch((error) => {
                console.error('Error in getCurrentUser:', error);
                this.userName = 'guest'; // Fallback to 'guest' in case of an error
            });
    }
    connectedCallback() {
        this.getCurrentUser(); // Fetch the current user when the component is loaded
    }
    get welcomeMessage() {
        return this.userName !== 'guest' ? `Welcome, ${this.userName}` : 'Welcome, Guest';
    }
    



 /////////////Todays appointment pavithra;s/c/a
 @track appointments = [];
 @track errorAppointments;
 @track isAppointmentsTableVisible = false;
 @track isModalOpen = false;
 @track medicalRecordId;
 @track patientName;
 @track currentDoctor;



 @track appointments;  // Holds appointment data
 @track errorAppointments;  // Holds any errors
 @track isAppointmentsTableVisible = false;  // Controls the visibility of the table

 // Wire method to fetch today's appointments
 @wire(getTodaysAppointments)
 wiredAppointments({ error, data }) {
     if (data) {
         this.appointments = data;
         this.errorAppointments = undefined;
         console.log('Appointments data fetched successfully:', JSON.stringify(this.appointments));

         // Set table visibility to true if data is fetched
         this.isAppointmentsTableVisible = true;
     } else if (error) {
         console.error('Error fetching appointments:', error);
         this.errorAppointments = error;
         this.appointments = [];

         // Ensure table visibility is false if there's an error
         this.isAppointmentsTableVisible = false;
     }
 }

 // Event handlers for button actions
 handleViewProfile(event) {
    // const appointmentId = event.target.dataset.id;
    // console.log('View profile for appointment ID:', appointmentId);
     // Add logic for viewing the profile
     this.selectedPatient = event.target.dataset.id;
     this.showPatientDetails = true;  // Show modal for the selected patient
     this.fetchRecords();
 }

 @track appointId = '';
 handleAddDetails(event) {
    const appointmentId = event.target.dataset.id;
      this.appointId = appointmentId;
      this.medicalRecord.patient_appointment_id__c = this.appointId;
     console.log('Add details for appointment ID:', this.appointId);
     console.log('debug for modal opened:::');
        this.isModalOpen1 = true;
        console.log('modal opened ::' + this.isModalOpen1);
    
 }

 /*
 @track appointId1 = '';
 handleCancelAppointment(event) {
     const appointmentId = event.target.dataset.id;
     console.log('Cancel appointment ID111111111:', appointmentId);
    
 }*/

     @track appointId1 = '';

     handleCancelAppointment(event) {
         const appointmentId = event.target.dataset.patappid;
         console.log('Cancel appointment triggered for ID:----', appointmentId);
 
         // Log before calling Apex
         console.log('Calling Apex method to cancel appointment...');
 
         cancelAppointment({ patientCheckId : appointmentId })
             .then((result) => {
                 // Log success case
                //  console.log('Apex method completed successfully, appointment cancelled for ID:', appointmentId);
                console.log('result::::' + result);
 
                 // Show success toast
                 this.showToast('Success', 'Appointment cancelled successfully', 'success');
                // return refreshApex(this.appointments);
                location.reload();
             })
             .catch((error) => {
                 // Log error case
                //  console.log('false', appointmentId);
 
                 console.error('Error cancelling appointment for ID:::' + appointmentId + 'Error details::' + JSON.stringify(error));
 
                 // Show error toast
                 this.showToast('Error', 'Failed to cancel appointment', 'error');
             });


     }
 
     showToast(title, message, variant) {
         // Log toast message details
         console.log(`Toast message: Title: ${title}, Message: ${message}, Variant: ${variant}`);
         
         const evt = new ShowToastEvent({
             title: title,
             message: message,
             variant: variant,
         });
         this.dispatchEvent(evt);
     }







 @track appointments;  // Holds appointment data
 @track errorAppointments;  // Holds any errors
 @track isAppointmentsTableVisible = false;  // Controls the visibility of the table

 // Wire method to fetch today's appointments
 /*
 @wire(getTodaysAppointments)
 wiredAppointments({ error, data }) {
     if (data) {
         this.appointments = data;
         this.errorAppointments = undefined;
         console.log('Appointments data fetched successfully:', JSON.stringify(this.appointments));

         // Set table visibility to true if data is fetched
         this.isAppointmentsTableVisible = true;
     } else if (error) {
         console.error('Error fetching appointments:', error);
         this.errorAppointments = error;
         this.appointments = [];

         // Ensure table visibility is false if there's an error
         this.isAppointmentsTableVisible = false;
     }
 }

 // Event handlers for button actions
 handleViewProfile(event) {
     const appointmentId = event.target.dataset.id;
     console.log('View profile for appointment ID:', appointmentId);
     // Add logic for viewing the profile
 }

 
/*
 handleCancelAppointment(event) {
     const appointmentId = event.target.dataset.id;
     console.log('Cancel appointment ID:', appointmentId);
     // Add logic for canceling the appointment
 }
*/










/*
 @wire(getTodaysAppointments)
 wiredAppointments({ error, data }) {
     if (data) {
         this.appointments = data;
         this.errorAppointments = undefined;
         console.log('getTodaysAppointments - this.appointments::' + JSON.stringify(this.appointments));
     } else if (error) {
         console.error('Error fetching appointments: ', error);
         this.errorAppointments = error;
         this.appointments = [];
     }
 }*/



 @wire(getRecord, { recordId: USER_ID, fields: [NAME_FIELD] })
 wiredUser({ error, data }) {
     if (data) {
         this.currentDoctor = data.fields.Name.value;
     } else if (error) {
         console.error('Error fetching doctor name: ', error);
     }
 }




 @track isModalOpen1 = false;
 /*
 // Define columns for the appointments datatable
 appointmentColumns = [
     { label: 'Patient Name', fieldName: 'PatientName',
         type: 'button',
         typeAttributes: {
            label:  { fieldName: 'PatientName' },
            name: 'viewProfile',
            title: 'View Details',
            variant: 'base'
        }
         },
     { label: 'Age', fieldName: 'Age', type: 'number' },
     { label: 'Start Time', fieldName: 'StartTime', type: 'time' },
     { label: 'End Time', fieldName: 'EndTime', type: 'time' },
     {
         type: 'button',
         typeAttributes: {
             label: 'Add Details',
             name: 'AddDetails',
             title: 'Add Details',
             value: 'AddDetails',
             variant: 'brand'
         }
     }
     
 ];
*/


 // Fetch medical record of the selected patient
 loadMedicalRecord(patientId) {
     getMedicalRecord({ patientId })
         .then(result => {
             this.medicalRecordId = result.Id;
             this.errorMedicalRecord = undefined;
         })
         .catch(error => {
             this.errorMedicalRecord = error;
             this.medicalRecordId = null;
         });
 }

 // Toggle visibility of the appointments table
 toggleAppointmentsTable() {
     this.isAppointmentsTableVisible = !this.isAppointmentsTableVisible;
     //this.isAppointmentsTableVisible = true;
     this.isTableVisible = false;
     this.showUpcomingAppointmentsTable = false;
    // this.toggleTable = false;
    //this.toggleAppointmentsTable=false;
 }

//  // Open the modal
//  openModal() {
//      this.isModalOpen = true; // This will toggle modal visibility
//  }

//  // Close the modal
//  closeModal() {
//      this.isModalOpen = false;
//  }

 // Save medical details
//  saveDetails() {
//      // Implementation for saving medical details (if needed)
//      this.closeModal(); // Close the modal after saving
//  }


@track medicalRecord = {
    patient_appointment_id__c: null,
    Patient_Id__c:null,
    Patient__c: '',
   // Height__c:'',
    Weight__c:'',  
    Bp__c:'',
    Temperature__c:'',
    hCG_test__c:false,
    HbA1c_test__c:false,
    Blood_test__c:false,
    Urine_examination__c:false,
    Admit__c:false,
    Visit_Date__c: '',
    Remarks__c:''
};


handleInputChange(event) {
    const field = event.target.dataset.field;
    console.log(`Field changed: ${field}, Value: ${event.target.value}`); // Log field and value change

    // this.medicalRecord.Patient__c = event.target.value;
    // console.log('this.medicalRecord.Patient__c::::: ' + this.medicalRecord.Patient__c);
   
    if (field === 'Visit_Date__c') { // Use the API name for Visit Date
        this.medicalRecord.Visit_Date__c = event.target.value; // Store in medicalRecord object
    }
    else if(field === 'Weight__c'){
        this.medicalRecord.Weight__c = event.target.value;
        console.log('this.medicalRecord.Weight__c---' + this.medicalRecord.Weight__c);
    }
    else if(field === 'Bp__c'){
        this.medicalRecord.Bp__c = event.target.value;
        console.log('this.medicalRecord.Bp__c---' + this.medicalRecord.Bp__c);
    }
    else if(field === 'Temperature__c'){
        this.medicalRecord.Temperature__c = event.target.value;
        console.log('this.medicalRecord.Temperature__c---' + this.medicalRecord.Temperature__c);
    }

    //else if(field === 'Prescription__c'){
        //this.medicalRecord.Prescription__c = event.target.value;
        //console.log('this.medicalRecord.Prescription__c---' + this.medicalRecord.Prescription__c);
    //}
   
    else if(field === 'hCG_test__c'){
        this.medicalRecord.hCG_test__c = event.target.checked;
    }
    else if(field === 'HbA1c_test__c'){
        this.medicalRecord.HbA1c_test__c = event.target.checked;
        console.log('this.medicalRecord.HbA1c_test__c---' + this.medicalRecord.HbA1c_test__c);
    }
   
    else if(field === 'Blood_test__c'){
        this.medicalRecord.Blood_test__c = event.target.checked;
    }
    else if(field === 'Urine_examination__c'){
        this.medicalRecord.Urine_examination__c = event.target.checked;
    }
    else if(field === 'Admit__c'){
        this.medicalRecord.Admit__c = event.target.checked;
        console.log('this.medicalRecord.Admit__c---' + this.medicalRecord.Admit__c);
    }
    else if(field === 'Remarks__c'){
        this.medicalRecord.Remarks__c = event.target.value;
        console.log('this.medicalRecord.Remarks---' + this.medicalRecord.Remarks__c);
    }
    console.log('inside handleInputChange - patient_appointment_id__c::' + this.medicalRecord.patient_appointment_id__c +
                '\nVisit_Date__c::' + this.medicalRecord.Visit_Date__c +
                '\nHbA1c_test__c::' + this.medicalRecord.HbA1c_test__c +
                '\nAdmit__c::' + this.medicalRecord.Admit__c
    );
}





@track selectedPatient;
    @track medicalRecords = []; // Track medical records
    @track showPatientDetails = false;
    @track showMedicalRecords = false; // Track whether to show medical records
    profileImageUrl = defaultProfileImage;

 
    handleRowAction1(event) {
        const actionName = event.detail.action.name;
            const row = event.detail.row; // Get the current row data
     
            if (actionName === 'AddDetails') {
             
                this.medicalRecord.Patient__c = row.Id;
               // this.medicalRecord.Height__c='';
                this.medicalRecord.Weight__c='';
                this.medicalRecord.Bp__c='';
                this.medicalRecord.Temperature__c='';
                this.medicalRecord.hCG_test__c=false;
                this.medicalRecord.HbA1c_test__c=false;
                this.medicalRecord.Blood_test__c=false;
               
                this.medicalRecord.Urine_examination__c=false;
                this.medicalRecord.Admit__c=false;
               
                this.medicalRecord.Visit_Date__c='';
                this.medicalRecord.Remarks__c='';
               
               
               
               
     
             
                this.isModalOpen1 = true; // Open modal
            }else if(actionName === 'viewProfile') {
                this.selectedPatient = row;
                this.showPatientDetails = true;  // Show modal for the selected patient
                this.fetchRecords();
            }
     
            console.log('inside handleRowAction1 - this.medicalRecord.Patient_Id__c::' + this.medicalRecord.patient_appointment_id__c
                + '\nthis.medicalRecord.Patient__c::' + this.medicalRecord.Patient__c
                + '\nthis.medicalRecord.Visit_Date__c::' + this.medicalRecord.Visit_Date__c
                + '\nthis.medicalRecord.HbA1c_test__c::' + this.medicalRecord.HbA1c_test__c
                + '\nthis.medicalRecord.Admit__c::' + this.medicalRecord.Admit__c
                + '\nthis.medicalRecord.Admit__c::' + this.medicalRecord.row.Id
            );
    }
     

fetchRecords() {
    console.log('inside fetchRecords - this.selectedPatient.Id::--' + this.selectedPatient.Id);
    try {
        fetchMedicalRecordsDoc({ patientId: this.selectedPatient.Id }) // Assuming selectedPatient has Id property
        .then((result) => {
            this.medicalRecords = result;
            console.log('Fetched medical records::::' + JSON.stringify(result));
            this.showMedicalRecords = true; // Show medical records section
        })
        .catch((error) => {
            console.error('Error fetching medical records:::', JSON.stringify(error));
        });
    } catch (error) {
        console.log('error occured in fetchMedicalRecordsDoc:::' + JSON.stringify(error));
    }
}

handleCloseModal() {
    this.showPatientDetails = false;  // Hide modal
    this.showMedicalRecords = false;  // Reset medical records visibility
}
/*handleNext() {
    const currentIndex = this.sections.indexOf(this.activeSection);
    if (currentIndex < this.sections.length - 1) {
        this.activeSection = this.sections[currentIndex + 1]; // Move to the next section
    }
   // this.handleSectionClick();
}*/
/*handleNext1(){
    this.handleSectionClick();
    this.handleNext();
}*/
// Handle Previous button click
/*handlePrevious() {
    const currentIndex = this.sections.indexOf(this.activeSection);
    if (currentIndex > 0) {
        this.activeSection = this.sections[currentIndex - 1]; // Move to the previous section
    }
}*/






handleSaveMedicalRecord() {
    if (
        !this.currentPatientId || 
        !this.medicalRecord.Weight__c || 
        !this.medicalRecord.Bp__c || 
        !this.medicalRecord.Temperature__c || 
        !this.medicalRecord.Visit_Date__c || 
        !this.medicalRecord.Remarks__c
    ) {
        // Display an error toast if validation fails
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Cannot save',
                message: 'Please Enter the Details',
                variant: 'error'
            })
        );
        return; // Stop further execution if validation fails
    }
 
    const appId = this.appointId;
    console.log('appId--'+appId);
    console.log('inside handleSaveMedicalRecord::');
    const medicalRecordDetails = {
       // patient_appointment_id__c: appId, // Use API name for Patient ID
        //Patient__c: this.medicalRecord.Patient__c, // Patient name
        // Bp__c:this.medicalRecord.Bp__c,
        //Dr__c: this.medicalRecord.Dr__c, // Doctor
        Patient_id__c: this.currentPatientId,
        //Height__c:this.medicalRecord.Height__c,
        Weight__c: this.medicalRecord.Weight__c,
        Bp__c:this.medicalRecord.Bp__c,
        Temperature__c:this.medicalRecord.Temperature__c,
        hCG_test__c:this.medicalRecord.hCG_test__c,
        HbA1c_test__c:this.medicalRecord.HbA1c_test__c,
        Blood_test__c:this.medicalRecord.Blood_test__c,
        Urine_examination__c:this.medicalRecord.Urine_examination__c,
        Admit__c:this.medicalRecord.Admit__c,
        Visit_Date__c: this.medicalRecord.Visit_Date__c, // Visit date
        Remarks__c: this.medicalRecord.Remarks__c,

       
       
       
       
       
        // Start_Time__c: this.medicalRecord.Start_Time__c, // Start time
        // End_Time__c: this.medicalRecord.End_Time__c // End time
    };
    console.log('medicalRecordDetails:::' + JSON.stringify(medicalRecordDetails));


    // Call Apex method to save the medical record
    saveMedicalRecord({ medicalRecordDetails: medicalRecordDetails })
        .then(result => {
            this.medicalRecordId = result;
            console.log('inside then of saveMedicalRecord::' + JSON.stringify(this.medicalRecordId));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Medical details saved successfully.',
                    variant: 'success'
                })
            );
            this.clearFields();
            this.closeModal();
           
        })
        .catch(error => {
            console.error('Error saving medical details::', JSON.stringify(error));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Error saving medical details: ' + (error.body?.message || 'Unknown error'),
                    variant: 'error'
                })
            );
        });



}




 // Open the modal
 openModal() {
    this.isModalOpen1 = true; // This will toggle modal visibility
}

// Close the modal
closeModal() {
    this.isModalOpen1 = false;
}

@track patientNameDisplay;
@track patientDetails;
@track medicalRecords;
@track diagnosisDetails;
@track isPatientDetailsVisible = false;
@track isAppointmentsTableVisible=true;
handlePatientClick(event) {
    const patientId = event.target.dataset.id;
    console.log('Patient ID clicked:', patientId); // Log the patient ID
    this.fetchPatientDetails(patientId);
    this.currentPatientId = patientId;
    this.homepage=false;
    this.isAppointmentsTableVisible=false;
    
}

fetchPatientDetails(patientId) {
    console.log('Fetching details for patient ID:', patientId); // Log the patient ID being fetched

    getPatientDetailsAndRecords({ patientId })
        .then((result) => {
            console.log('Patient details and medical records fetched successfully:', JSON.stringify(result));
           
            this.patientDetails = result.patientDetails;
            this.medicalRecords = result.medicalRecords;
            this.diagnosisDetails = result.diagnosisDetails;
            this.isPatientDetailsVisible = !this.isPatientDetailsVisible; 
            
            console.log('Patient Details:', this.patientDetails.Name);
            console.log('Patient Name:', result.Name);
            console.log('patientNameDisplay:', this.patientNameDisplay );
            console.log('Medical Records:', this.medicalRecords);
        })
        .catch((error) => {
            console.error('Error fetching patient details and records:', error);
            // Handle error appropriately (e.g., show a toast message)
        });
}
get hasDiagnosisDetails() {
    return this.diagnosisDetails && this.diagnosisDetails.length > 0;
}
get patientProfileTitle() {
    return `${this.patientDetails.Name || ''}`;
}
handlecancel(){
    this.isPatientDetailsVisible = false;
    this.homepage=true;
    
}











// pragati added adddetails js////////

@track isDetailsVisible=false;
@track complaints = [];
@track observations = [];
@track diagnoses = [];

newComplaint = '';
newObservation = '';
newDiagnosis = '';
newNote = '';


// Section navigation handlers
/*handleSectionClick(event) {
    this.activeSection = event.target.dataset.section;

    // Remove "active" class from all sidebar items
    this.template.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add "active" class to the clicked item
    event.currentTarget.classList.add('active');

    // Update progress percentage based on the clicked section
    switch (this.activeSection) {
        case 'medicalRecord':
            this.progressPercentage = 25;
            break;
        case 'clinicalNotes':
            this.progressPercentage = 50;
            break;
        case 'vitalSign':
            this.progressPercentage = 75;
            break;
        case 'prescription':
            this.progressPercentage = 100;
            break;
        default:
            this.progressPercentage = 0;
    }
}*/
sections = ['medicalRecord', 'clinicalNotes', 'vitalSign', 'prescription'];
activeSection = 'medicalRecord'; 
handleSectionClick(event) {
    const section = event.target.dataset.section;
    this.updateActiveSection(section);
}

// Handle navigation for "Next" button
handleNext() {
    const currentIndex = this.sections.indexOf(this.activeSection);
    if (currentIndex < this.sections.length - 1) {
        const nextSection = this.sections[currentIndex + 1];
        this.updateActiveSection(nextSection);
    }
    
}

// Handle navigation for "Previous" button
handlePrevious() {
    const currentIndex = this.sections.indexOf(this.activeSection);
    if (currentIndex > 0) {
        const previousSection = this.sections[currentIndex - 1];
        this.updateActiveSection(previousSection);
    }
}

// Update active section and apply class changes
updateActiveSection(section) {
    this.activeSection = section;

    // Update the active class for navigation items
    this.template.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeItem = this.template.querySelector(`[data-section="${section}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}


get isMedicalRecordsActive() {
    return this.activeSection === 'medicalRecord';
}

get isClinicalNotesActive() {
    return this.activeSection === 'clinicalNotes';
}

get isVitalSignActive() {
    return this.activeSection === 'vitalSign';
}

get isPrescriptionActive() {
    return this.activeSection === 'prescription';
}


//sections = ['medicalRecord', 'clinicalNotes', 'vitalSign', 'prescription'];

// Calculate the progress percentage based on the active section
get progressPercentage() {
    const index = this.sections.indexOf(this.activeSection);
    return ((index + 1) / this.sections.length) * 100;
}

get progressStyle() {
    return `width: ${this.progressPercentage}%;`;
}
// Complaint handlers
handleComplaintChange(event) {
    this.newComplaint = event.target.value;
}

addComplaint() {
    if (this.newComplaint) {
        this.complaints = [...this.complaints, this.newComplaint];
        this.newComplaint = '';
    }
}

removeComplaint(event) {
    const complaintToRemove = event.target.dataset.id;
    this.complaints = this.complaints.filter(complaint => complaint !== complaintToRemove);
}

// Observation handlers
handleObservationChange(event) {
    this.newObservation = event.target.value;
}

addObservation() {
    if (this.newObservation) {
        this.observations = [...this.observations, this.newObservation];
        this.newObservation = '';
    }
}

removeObservation(event) {
    const observationToRemove = event.target.dataset.id;
    this.observations = this.observations.filter(observation => observation !== observationToRemove);
}

// Diagnosis handlers
handleDiagnosisChange(event) {
    this.newDiagnosis = event.target.value;
}

addDiagnosis() {
    if (this.newDiagnosis) {
        this.diagnoses = [...this.diagnoses, this.newDiagnosis];
        this.newDiagnosis = '';
    }
}

removeDiagnosis(event) {
    const diagnosisToRemove = event.target.dataset.id;
    this.diagnoses = this.diagnoses.filter(diagnosis => diagnosis !== diagnosisToRemove);
}

handleNoteChange(event) {
    this.newNote = event.target.value; // Capture the note
}

handleSave() {
    if (
        !this.currentPatientId ||
        (!this.complaints || this.complaints.length === 0) ||
        (!this.observations || this.observations.length === 0) ||
        (!this.diagnoses || this.diagnoses.length === 0) 
    ) {
        // Display an error toast if validation fails
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'cannot save',
                message: 'Please fill in the missing values.',
                variant: 'error'
            })
        );
        return; // Exit the method to prevent saving
    }
    saveDiagnosisRecords({
        patientId: this.currentPatientId,
        complaints: this.complaints,
        observations: this.observations,
        diagnoses: this.diagnoses,
        notes: this.newNote,
        
    })
    
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records saved successfully',
                    variant: 'success'
                })
            );
            // Clear lists after save
            this.complaints = [];
            this.observations = [];
            this.diagnoses = [];
            this.newNote = '';

        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error saving records',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
}

@track height = '';
@track weight = '';
@track bp = '';
@track temperature = '';
@track hcgTest = false;
@track hba1cTest = false;
@track bloodTest = false;
@track urineExamination = false;
@track admit = false;
@track visitDate = '';
@track remarks = '';

handleInputChange1(event) {
    const field = event.target.dataset.field; // Use dataset.field for better targeting
    console.log(`Field changed: ${field}, Value: ${event.target.value}`);

    // Ensure the correct value is assigned based on the field type
    if (field === 'Visit_Date__c') {
        this.Visit_Date__c = event.target.value;
    } else if (field === 'Remarks__c') {
        this.Remarks__c = event.target.value;
        console.log('this.Remarks__c---' + this.Remarks__c);
    } else if (field === 'Bp__c') {
        this.Bp__c = event.target.value; 
        console.log('this.Bp__c---' + this.Bp__c);
    } else if (field === 'HbA1c_test__c') {
        this.HbA1c_test__c = event.target.checked; 
        console.log('this.HbA1c_test__c---' + this.HbA1c_test__c);
    } else if (field === 'hCG_test__c') {
        this.hCG_test__c = event.target.checked; 
    } else if (field === 'Blood_test__c') {
        this.Blood_test__c = event.target.checked; 
    } else if (field === 'Urine_examination__c') {
        this.Urine_examination__c = event.target.checked; 
    } else if (field === 'Admit__c') {
        this.Admit__c = event.target.checked; 
        console.log('this.Admit__c---' + this.Admit__c);
    }else if (field === 'Height__c') {
        this.Height__c = event.target.value;
        console.log('this.Height__c---' + this.Height__c);
    }else if (field === 'Weight__c') {
        this.Weight__c = event.target.value;
        console.log('this.Weight__c---' + this.Weight__c);
    }
    
    
}

handleSaveClinic() {
    if (
        !this.currentPatientId ||
        !this.height ||
        !this.weight ||
        !this.bp ||
        !this.temperature ||
        !this.visitDate ||
        !this.remarks
    ) {
        // Display error toast if validation fails
        this.dispatchEvent(new ShowToastEvent({
            title: 'Cannot Save',
            message: 'Fill the details',
            variant: 'error'
        }));
        return; // Stop further execution if validation fails
    }
    // Prepare medical record data to save
    const medicalRecordDetails = {
        Patient_id__c: this.currentPatientId,
        Height__c: this.height,
        Weight__c: this.weight,
        Bp__c: this.bp,
        Temperature__c: this.temperature,
        HbA1c_test__c: this.hba1cTest,
        hCG_test__c: this.hcgTest,
        Blood_test__c: this.bloodTest,
        Urine_examination__c: this.urineExamination,
        Admit__c: this.admit,
        Visit_Date__c: this.visitDate,
        Remarks__c: this.remarks,
       
    };

    console.log('medicalRecordDetails:::', JSON.stringify(medicalRecordDetails)); // For debugging

    // Call Apex method to save the medical record
    saveMedicalDetails({ medicalRecordDetails: medicalRecordDetails })
        .then(result => {
            console.log('Medical record saved successfully, ID:', result);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Medical record saved successfully.',
                variant: 'success'
            }));
            this.clearFields();
        })
        .catch(error => {
            console.error('Error saving medical records:', error);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: 'Error saving medical records: ' + (error.body?.message || 'Unknown error'),
                variant: 'error'
            }));
        });
}

clearFields() {
    this.medicalRecord = {
        'Patient_id__c': '',
        'Height__c': '',
        'Temperature__c':'',
        'weight__c':'',
        'Bp__c': '',
        'Remarks__c': '',
        'Visit_Date__c': '',
        'HbA1c_test__c': false,
        'hCG_test__c': false,
        'Blood_test__c': false,
        'Urine_examination__c': false,
        'Admit__c': false
    };
    // Reset any other necessary state variables as well
}
 


// Prescription data handling
@track drugOptions = [];
@track frequencyOptions = [];
@track intakeOptions = [];

@track selectedDrugId = '';
@track dosage = 1;
@track frequency = '';
@track intake = '';
@track duration = 1;
@track prescriptions = [];

connectedCallback() {
this.fetchMedicines();
this.fetchPicklistValues();
this.addPrescriptionRow(); 
}

fetchMedicines() {
getMedicines()
    .then(result => {
        this.drugOptions = result.map(medicine => ({
            label: medicine.Name,
            value: medicine.Id
        }));
    })
    .catch(error => {
        console.error('Error fetching medicines:', error);
    });
}

addPrescriptionRow() {
const newId = this.prescriptions.length + 1;
this.prescriptions = [
    ...this.prescriptions,
    { id: newId, drug: '', dosage: 1, frequency: '', intake: '', duration: 1 }
];
}

// Fetch picklist values for Frequency and Intake fields
fetchPicklistValues() {
getPicklistValues()
    .then(result => {
        this.frequencyOptions = result.Frequency__c.map(value => ({ label: value, value: value }));
        this.intakeOptions = result.Intake__c.map(value => ({ label: value, value: value }));
    })
    .catch(error => {
        console.error('Error fetching picklist values:', error);
    });
}
handleFieldChange(event) {
const fieldName = event.target.name;
const rowId = parseInt(event.target.dataset.id, 10);
const newValue = event.target.value;

this.prescriptions = this.prescriptions.map(prescription => {
    if (prescription.id === rowId) {
        // Dynamically update the property based on the field name
        return { ...prescription, [fieldName]: newValue };
    }
    return prescription;
});
}


handleAddPrescription() {
this.addPrescriptionRow();
}

handleSavePrescriptions() {
this.savePrescriptions().then(() => {
});
}




handleDeletePrescription(event) {
const rowId = event.target.dataset.id;
this.prescriptions = this.prescriptions.filter(prescription => prescription.id !== parseInt(rowId, 10));
}


    savePrescriptions() {
         // Validate that all fields are filled for each prescription
    const isValid = this.prescriptions.every(prescription => 
        prescription.drug && 
        prescription.dosage && 
        prescription.frequency && 
        prescription.intake && 
        prescription.duration
    );

    if (!isValid) {
        // Show error toast if validation fails
        this.dispatchEvent(new ShowToastEvent({
            title: 'Cannot Save',
            message: 'All fields must be filled for each prescription before saving.',
            variant: 'error'
        }));
        return; // Exit the function if validation fails
    }

        const prescriptionsToSave = this.prescriptions.map(prescription => ({
            Patient_Registration__c: this.currentPatientId,
            Drug__c: prescription.drug,
            Dosage__c: prescription.dosage,
            Frequency__c: prescription.frequency,
            Intake__c: prescription.intake,
            Duration__c: prescription.duration
           
                    }));
        
        console.log('Prescriptions to save:', JSON.stringify(prescriptionsToSave)); // Add this line for debugging
        savePrescriptionRecords({ prescriptions: prescriptionsToSave })
            .then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Prescriptions saved successfully',
                    variant: 'success'
                }));

                // Clear fields in the prescriptions array after saving
    this.prescriptions = this.prescriptions.map(prescription => ({
        ...prescription,
        drug: '',         
        dosage: '',        
        frequency: '',     
        intake: '',        
        duration: ''       
    }));
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error'
                }));
            });
    }
    
 


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


}