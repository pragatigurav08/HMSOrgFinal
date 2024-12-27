public with sharing class ReceptionistDashboard  
{
    
     @AuraEnabled(cacheable=true)
	public static List<Appointment__c> getAppointmentsByDoctorName(String doctorName, Date appointmentDate) {
    // Fetch appointments for the specified doctor and today's date
    return [
        SELECT Id, Name, Patient__r.Name, Date__c, Start_Time__c, End_Time__c, Dr__r.Name
        FROM Appointment__c
        WHERE Dr__r.Name = :doctorName
        AND Date__c = :appointmentDate
    ];
	}
    
     @AuraEnabled(cacheable=true)
    public static List<Appointment__c> getTodayAppointments(Id doctorId) {
      //  Date today = Date.today();
       // System.debug('today' + today);
        return [SELECT Id, Patient__r.Name, Date__c, Status__c, Start_Time__c, End_Time__c,Dr__r.Name 
                FROM Appointment__c 
                WHERE Dr__c = :doctorId AND Date__c = TODAY
               ORDER BY Start_Time__c ASC];
    }
    
    @AuraEnabled
    public static void deletePatient(Id patientId) {
        try {
            delete [SELECT Id FROM Patient_Registration__c WHERE Id = :patientId];
        } catch (Exception e) {
            throw new AuraHandledException('Error deleting patient: ' + e.getMessage());
        }
    }
    
    @AuraEnabled
    public static void bookSlot1(Map<String, Object> slotDetails) {
        System.debug('slotDetails: ' + slotDetails);

        // Extract slot details
        String patientId = (String) slotDetails.get('patientId');
        String doctorId = (String) slotDetails.get('doctor');  // Assuming this is a User ID
        String dateString = (String) slotDetails.get('date');
        String startTimeString = (String) slotDetails.get('startTime');
        String endTimeString = (String) slotDetails.get('endTime');
        String reasonToVisit = (String) slotDetails.get('reasonToVisit');

        // Convert strings to Date and Time
        Date slotDate = Date.valueOf(dateString);
        Time startTime = getTimeFromString(startTimeString);
        Time endTime = getTimeFromString(endTimeString);

        // Create Appointment
        Appointment__c appointment = new Appointment__c();
        appointment.Patient__c = patientId; // Lookup to Patient (e.g., Contact)
        appointment.Dr__c = doctorId;  // Assuming Doctor__c is a lookup to User
        appointment.Date__c = slotDate;
        appointment.Start_Time__c = startTime;
        appointment.End_Time__c = endTime;
        appointment.Reason_To_Visit__c = reasonToVisit;

        try {
            // Insert the appointment record
            insert appointment;
            System.debug('Appointment inserted successfully: ' + appointment.Id);


        } catch (DmlException e) {
            System.debug('Error inserting appointment: ' + e.getMessage());
            throw new AuraHandledException('Error inserting appointment: ' + e.getMessage());
        }
    }
    
     // Helper method to convert String to Time
    private static Time getTimeFromString(String timeString) {
        Integer hours = Integer.valueOf(timeString.substring(0, 2));
        Integer minutes = Integer.valueOf(timeString.substring(3, 5));
        return Time.newInstance(hours, minutes, 0, 0);
    }
    
    @AuraEnabled
    public static String rescheduleSlot(Map<String, Object> updatedSlotDetails) {
        try {
            // Extract details from the slotDetails map
            String patientId = (String) updatedSlotDetails.get('patientId');
            String appointmentId = (String) updatedSlotDetails.get('appointmentId');  // For rescheduling, we'll pass the appointment ID
            String doctor = (String) updatedSlotDetails.get('doctor');
            String appointmentDate = (String) updatedSlotDetails.get('date');
            String startTime = (String) updatedSlotDetails.get('startTime');
            String endTime = (String) updatedSlotDetails.get('endTime');
            String reasonToVisit = (String) updatedSlotDetails.get('reasonToVisit');

            Date slotDate = Date.valueOf(appointmentDate);
            Time newSartTime = getTimeFromString(startTime);
            Time newEndTime = getTimeFromString(endTime);
            
            // Query the appointment by Id
            Appointment__c appointment = [SELECT Id, Dr__c, Date__c, Patient__c, Start_Time__c, End_Time__c, Reason_To_Visit__c
                                          FROM Appointment__c WHERE Patient__c = :patientId LIMIT 1];

            // Update the appointment details
            appointment.Patient__c = patientId;
            appointment.Dr__c = doctor;
            appointment.Date__c = slotDate;
            appointment.Start_Time__c = newSartTime;
            appointment.End_Time__c = newEndTime;
            appointment.Reason_To_Visit__c = reasonToVisit;

            update appointment;
            return 'Success';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static Appointment__c getAppointmentDetails(Id patientId) {
        try {
            return [SELECT Id, Dr__c, Date__c, Reason_To_Visit__c,Dr__r.Name,Patient__r.Name
                    FROM Appointment__c
                    WHERE Patient__c = :patientId
                    LIMIT 1];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching appointment details: ' + e.getMessage());
        }
    }
    
    @AuraEnabled(cacheable=true)
public static List<Appointment__c> getUpAppointments(Id patientId, Date selectedDate) {
    return [
        SELECT Id, Reason_To_Visit__c, Start_Time__c, End_Time__c, Dr__r.Name
        FROM Appointment__c
        WHERE Patient__c = :patientId
        AND Date__c = :selectedDate
    ];
}
    
    @AuraEnabled(cacheable=true)
	public static List<Appointment__c> getRelatedAppointments(Id patientId) {
    Date today = Date.today();
    return [
        SELECT Id, Date__c, Reason_To_Visit__c, Dr__r.Name
        FROM Appointment__c
        WHERE Patient__c = :patientId
        AND Date__c < :today
        ORDER BY Date__c DESC
    ];
}
    
    
    // Fetch all doctors
    @AuraEnabled(cacheable=true)
    public static List<User> getDoctors() {
        return [SELECT Id, Name,Specialist__c,Email,Phone FROM User WHERE Name LIKE '%Dr%'];
    }



    @AuraEnabled(cacheable=true)
    public static List<User> availableDoctors1() {
        try {
            // Query to fetch doctors
            List<User> doctors = [
                SELECT Id, Name, Specialist__c, Email, Phone 
                FROM User 
                WHERE Name LIKE '%Dr%' 
                AND Available__c = TRUE
            ];
            System.debug('Fetched doctors count: ' + doctors.size());
            return doctors;
        } catch (Exception e) {
            System.debug('Error fetching doctors: ' + e.getMessage());
            throw new AuraHandledException('Unable to fetch doctors. Please try again later.');
        }
    }
    
    @AuraEnabled(cacheable=true)
public static List<Patient_Registration__c> getRegisteredPatients() {
 return [SELECT Id, Name, Email__c, phone_number__c,Age__c,blood_group__c FROM 
Patient_Registration__c order by CreatedDate DESC]; 
 }
    
   
    @AuraEnabled(cacheable=true) 
 public static List<Patient_Registration__c> getAppointmentPatients() {
 return [SELECT Id, Name, Email__c, phone_number__c,Age__c,blood_group__c FROM Patient_Registration__c WHERE Show_Patient__c=false]; 
 }
    
  /* @AuraEnabled
public static void registerPatient(Patient_Registration__c patient) {
    try {
        // Check if a patient with the same email or phone number already exists
        List<Patient_Registration__c> existingPatients = [SELECT Id FROM Patient_Registration__c 
                                                          WHERE Email__c = :patient.Email__c 
                                                          OR phone_number__c = :patient.phone_number__c LIMIT 1];
        if (!existingPatients.isEmpty()) {
            // If a patient already exists, throw an exception
            throw new AuraHandledException('Enter Name please');
        }
        
        // Insert the patient if no duplicates are found
        insert patient;
    } catch (Exception e) {
        throw new AuraHandledException('A patient with the same email or phone number already exists. ');
    }
}*/


@AuraEnabled
public static Id registerPatient(Patient_Registration__c patient) {
    try {
        System.debug('Received patient object: ' + patient);

        // Check for duplicate phone number
        List<Patient_Registration__c> phoneDuplicate = [
            SELECT Id 
            FROM Patient_Registration__c 
            WHERE phone_number__c = :patient.phone_number__c 
            LIMIT 1
        ];

        if (!phoneDuplicate.isEmpty()) {
            throw new AuraHandledException('A patient with the same phone number already exists.');
        }

        // Check for duplicate email
        List<Patient_Registration__c> emailDuplicate = [
            SELECT Id 
            FROM Patient_Registration__c 
            WHERE Email__c = :patient.Email__c 
            LIMIT 1
        ];

        if (!emailDuplicate.isEmpty()) {
            throw new AuraHandledException('A patient with the same email already exists.');
        }

        // Insert the patient if no duplicates are found
        insert patient;
        System.debug('Patient successfully registered: ' + patient);
        return patient.Id;
    } catch (AuraHandledException e) {
        System.debug('AuraHandledException: ' + e.getMessage());
        throw e; // Pass the specific message to LWC
    } catch (Exception e) {
        System.debug('Unexpected exception: ' + e.getMessage());
        throw new AuraHandledException('An unexpected error occurred. Please try again later.');
    }
}


    @AuraEnabled(cacheable=true) 

    public static Integer getDoctorCount() { 

        Integer count=[SELECT COUNT() FROM User WHERE Name LIKE '%Dr%' AND Available__c	=TRUE]; 
        return count != null ? count : 0;

    }

    
    @AuraEnabled(cacheable=true) 

    public static Integer getTotalDoctorCount() { 

        Integer count=[SELECT COUNT() FROM User WHERE Name LIKE '%Dr%']; 
        return count != null ? count : 0;

    }
    
     @AuraEnabled(cacheable=true) 

    public static Integer getPatientCount() { 

        Integer count=[SELECT COUNT() FROM Patient_Registration__c]; 
        return count != null ? count : 0;

    } 

    
     @AuraEnabled(cacheable=true) 

    public static Integer getNewPatientsToday() { 

        Integer count = [SELECT COUNT() FROM Patient_Registration__c WHERE CreatedDate = TODAY];
        return count != null ? count : 0;

    } 
    
    /*
    @AuraEnabled(cacheable=true) 

    public static Integer getNewDoctorsToday() { 

        Integer count=[SELECT COUNT() FROM Doctor__c WHERE CreatedDate = TODAY];
        return count != null ? count : 0;

    }*/
    
     @AuraEnabled(cacheable=true) 

    public static Integer getAppointmentsToday() { 

        Integer count=[SELECT COUNT() FROM Appointment__c WHERE CreatedDate = TODAY];
        return count != null ? count : 0;


    } 
    
    @AuraEnabled(cacheable=true)
    public static String getCurrentUserNameIfStaff() {
        Id userId = UserInfo.getUserId();
       System.debug('user123'+userId);
        // Query the current user's name and role
        User currentUser = [
            SELECT Name
            //, UserRole.Name
            FROM User
            WHERE Id = :userId
            LIMIT 1
        ];
       
        // Check if the user role is 'Doctor'
      /*  if (currentUser.UserRoleId != null && currentUser.UserRole.Name == 'Staff') {
            return currentUser.Name;
        }*/
 
        return currentUser.Name; // User is not a doctor
    }
    
     @AuraEnabled(cacheable=true)
public static List<Map<String, String>> getDoctorPicklistValues() {
    List<Map<String, String>> doctors = new List<Map<String, String>>();
    
    // Querying Users with the role 'Doctor'
    List<User> doctorsList = [
        SELECT Id, Name FROM User WHERE UserRole.Name = 'Doctor'
    ];
    
    // Create a list of doctors with ID and Name
    for (User doctor : doctorsList) {
        Map<String, String> doctorMap = new Map<String, String>();
        doctorMap.put('Id', doctor.Id);
        doctorMap.put('Name', doctor.Name);
        doctors.add(doctorMap);
    }
    
    return doctors; // Return list of doctors with ID and Name
}
    
@AuraEnabled(cacheable=true)
public static List<Map<String, String>> getBloodGroupPicklistValues() {
    try {
        Schema.DescribeFieldResult fieldResult = Patient_Registration__c.Blood_Group__c.getDescribe();
        List<Schema.PicklistEntry> picklistValues = fieldResult.getPicklistValues();

        List<Map<String, String>> options = new List<Map<String, String>>();
        for (Schema.PicklistEntry entry : picklistValues) {
            options.add(new Map<String, String>{
                'Label' => entry.getLabel(),
                'Value' => entry.getValue()
            });
        }
        System.debug('Blood Group Picklist Options: ' + options);
        return options;
    } catch (Exception e) {
        System.debug('Error fetching Blood Group picklist values: ' + e.getMessage());
        throw new AuraHandledException('Error fetching picklist values');
    }
}

    
    
@AuraEnabled(cacheable=true)
public static List<Medical_Record__c> fetchMedicalRecords(Id patientId) {
    // Debug the input patientId
    System.debug('Input patientId: ' + patientId);

    // Ensure that patientId is not null
    if (patientId == null) {
        System.debug('Patient ID is null. Throwing an exception.');
        throw new AuraHandledException('Patient ID is required.');
    }

    // Query medical records for the given patientId
    List<Medical_Record__c> medicalRecords = [
        SELECT Id, Visit_Date__c, Remarks__c
        FROM Medical_Record__c 
        WHERE Patient_id__c = :patientId
        
    ];

    // Debug the fetched medical records
    System.debug('Fetched Medical Records: ' + medicalRecords);

    return medicalRecords;
}


    @AuraEnabled
    public static void savePatient(String patientName, String gender, String bloodGroup) {
        // Check if any required field is missing
       

        try {
            // Create a new Patient_Registration__c record
            Patient_Registration__c patientRecord = new Patient_Registration__c();
            patientRecord.Name = patientName; // Assuming "Name" is used for the patient name field
            patientRecord.Gender__c = gender; // Gender field
            patientRecord.Blood_Group__c = bloodGroup; // Blood Group field

            // Insert the record
            insert patientRecord;
        } catch (Exception ex) {
            throw new AuraHandledException('Error saving patient details: ' + ex.getMessage());
        }
    }

    @AuraEnabled
    public static void updateStageInBackend(String selectedStage, Id patientId) {
        try {
            // Query the patient record
            Patient_Registration__c patient = [SELECT Id, Stage__c FROM Patient_Registration__c WHERE Id = :patientId LIMIT 1];

            // Update the stage field
            patient.Stage__c = selectedStage;

            // Perform the update
            update patient;
        } catch (Exception e) {
            // Log the error for debugging
            System.debug('Error updating stage: ' + e.getMessage());
            throw new AuraHandledException('Unable to update the stage. Please try again.');
        }
    }
    
    
  
    
    
   @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getProgressStages() {
        List<Map<String, Object>> stages = new List<Map<String, Object>>();
        stages.add(new Map<String, Object>{
            'name' => 'Registered',
            'status' => 'completed',
            'icon' => '/resource/progress_registration'
        });
        stages.add(new Map<String, Object>{
            'name' => 'Scheduled',
            'status' => 'active',
            'icon' => '/resource/progress_scheduled'
        });
        stages.add(new Map<String, Object>{
            'name' => 'Billing/Payment',
            'status' => 'pending',
            'icon' => '/resource/progress_treatment'
        });
        stages.add(new Map<String, Object>{
            'name' => 'Medication',
            'status' => 'pending',
            'icon' => '/resource/progress_medication'
        });
        stages.add(new Map<String, Object>{
            'name' => 'Billing/Payment',
            'status' => 'pending',
            'icon' => '/resource/progress_billing'
        });
        return stages;
    } 
    
    
    
    @AuraEnabled
public static String bookAppointmentSlot(Map<String, Object> appointmentDetails) {
    System.debug('appointmentDetails: ' + appointmentDetails);

    try {
        // Extract appointment details
        String patientId = (String) appointmentDetails.get('patientAppId');
        String doctorId = (String) appointmentDetails.get('doctor'); // Assuming this is a User ID
        String dateString = (String) appointmentDetails.get('date');
        String startTimeString = (String) appointmentDetails.get('startTime');
        String endTimeString = (String) appointmentDetails.get('endTime');
        String reasonToVisit = (String) appointmentDetails.get('reasonToVisit');

        // Convert strings to Date and Time
        Date appointmentDate = Date.valueOf(dateString);
        Time startTime = getTimeFromString(startTimeString);
        Time endTime = getTimeFromString(endTimeString);

        // Create Appointment record
        Appointment__c newAppointment = new Appointment__c();
        newAppointment.Patient__c = patientId; // Lookup to Patient (e.g., Contact)
        newAppointment.Dr__c = doctorId;       // Assuming Doctor__c is a lookup to User
        newAppointment.Date__c = appointmentDate;
        newAppointment.Start_Time__c = startTime;
        newAppointment.End_Time__c = endTime;
        newAppointment.Reason_To_Visit__c = reasonToVisit;

        // Insert the appointment record
        insert newAppointment;

        System.debug('Appointment inserted successfully: ' + newAppointment.Id);
        return 'Appointment booked successfully with ID: ' + newAppointment.Id;

    } catch (DmlException e) {
        System.debug('Error inserting appointment: ' + e.getMessage());
        throw new AuraHandledException('Error booking appointment: ' + e.getMessage());
    }
}
}