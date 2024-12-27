public class DoctorDashboard {


    @AuraEnabled
    public static void updateAvailability(Boolean isAvailable) {
        System.debug('Entering updateAvailability. isAvailable: ' + isAvailable);

        try {
            User currentUser = [SELECT Id, Available__c FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
            System.debug('Current User Retrieved: ' + currentUser);

            currentUser.Available__c = isAvailable;
            update currentUser;

            System.debug('Availability updated successfully for User: ' + currentUser.Id);
        } catch (Exception e) {
            System.debug('Error in updateAvailability: ' + e.getMessage());
            throw new AuraHandledException('Error updating availability: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Boolean getCurrentAvailability() {
        System.debug('Entering getCurrentAvailability');

        try {
            User currentUser = [SELECT Available__c FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
            System.debug('Current User Availability: ' + currentUser.Available__c);

            return currentUser.Available__c;
        } catch (Exception e) {
            System.debug('Error in getCurrentAvailability: ' + e.getMessage());
            throw new AuraHandledException('Error fetching current availability: ' + e.getMessage());
        }
    }




     @AuraEnabled(cacheable=true)
    public static Map<String, Object> getPatientDetailsAndRecords(Id patientId) {
        Map<String, Object> result = new Map<String, Object>();

        // Log the patient ID received
        System.debug('Received patientId: ' + patientId);
        
        try {
            // Query patient details
            Patient_Registration__c patient = [
                SELECT Id, Name, Age__c, Gender__c, Email__c,Emergency_Contact__c
                FROM Patient_Registration__c 
                WHERE Id = :patientId 
                LIMIT 1
            ];
            result.put('patientDetails', patient);

            // Query medical records related to the patient
            List<Medical_Record__c> records = [
                SELECT Id, Prescription__c,Remarks__c,Visit_Date__c,Doctorr__c
                FROM Medical_Record__c 
                WHERE Patient_id__c = :patientId
            ];
            result.put('medicalRecords', records);
            
            // Query diagnosis related to the patient
            List<Diagonisis__c	> diagnoses = [
                SELECT Id, Complaints__c, Observations__c, Diagnosis__c
                FROM Diagonisis__c	
                WHERE Patient_Name__c = :patientId
            ];
            result.put('diagnosisDetails', diagnoses);

        } catch (QueryException qe) {
            System.debug('QueryException: ' + qe.getMessage());
            throw new AuraHandledException('Error querying data: ' + qe.getMessage());
        } catch (Exception e) {
            // Log the error message
            System.debug('Error in getPatientDetailsAndRecords: ' + e.getMessage());
            throw new AuraHandledException('Error fetching patient details and records: ' + e.getMessage());
        }

        return result;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getAdmittedPatients() {
        Id currentUserId = UserInfo.getUserId();
       
        // Query medical records where Admit__c is true and Doctorr__c is the current user
       
        // List<Medical_record__c> admittedPatients = [
        //     SELECT Id, Remarks__c,Patient_id__r.Name, Patient_id__r.Age__c, Patient_id__r.Gender__c, Admit__c, Prescription__c
        //     FROM Medical_record__c
        //     WHERE Admit__c = true
        //     //AND Doctorr__c = :currentUserId
        // ];
 
        List<Medical_record__c> admittedPatients = [
            SELECT Id, Patient_id__r.Name,patient_appointment_id__r.Patient__r.Name,Patient_id__c,Prescription__c,Remarks__c,CreatedDate,Admit__c
            FROM Medical_record__c
            WHERE Admit__c = true
            //AND Doctorr__c = :currentUserId
        ];
 
 
        // SELECT Id, Diagonisis__c, Doctorr__r.Name, Visit_Date__c, Remarks__c,
        //      patient_appointment_id__c, patient_appointment_id__r.Patient__c,
        //       patient_appointment_id__r.Dr__c, patient_appointment_id__r.Dr__r.Name
        //     FROM Medical_Record__c where patient_appointment_id__r.Patient__c =: patientId
        //     ORDER BY CreatedDate DESC LIMIT 1
 
        // Create a list of maps to flatten the data
        List<Map<String, Object>> result = new List<Map<String, Object>>();
       
        for (Medical_record__c record : admittedPatients) {
            Map<String, Object> recordMap = new Map<String, Object>();
            recordMap.put('Id', record.Id);
            recordMap.put('PatientName', record.Patient_id__r.Name);
          //  recordMap.put('PatientName', record.patient_appointment_id__r.Patient__r.Name != null ? record.patient_appointment_id__r.Patient__r.Name : null);
           // recordMap.put('Prescription', record.Prescription__c);
            recordMap.put('Remarks', record.Remarks__c);
            recordMap.put('CreatedDate', record.CreatedDate);
            recordMap.put('AdmitStatus', record.Admit__c);
           
            result.add(recordMap);
        }
       
        return result;
    }
    
	@AuraEnabled(cacheable=true)
    public static String getCurrentUserNameIfDoctor() {
        // Query the User object to retrieve the user's name
        Id userId = UserInfo.getUserId();
        User userName = [SELECT Id,Name FROM User WHERE Id =: userId LIMIT 1];
        System.debug('userName:::' + userName);
        return userName.Name;
    }

    @AuraEnabled
    public static void dischargePatient(Id medicalRecordId) {
        // Update the Admit__c field to false for the specified medical record
        Medical_record__c recordToUpdate = [
            SELECT Id, Admit__c FROM Medical_record__c
            WHERE Id = :medicalRecordId
            LIMIT 1
        ];
       
        recordToUpdate.Admit__c = false; // Set Admit to false
        update recordToUpdate; // Update the record in the database
    }
    
    
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getTodaysAppointments() {
        Date today = System.today(); // Get today's date
        Id currentUserId = UserInfo.getUserId();

        // Query for today's appointments
        // List<Appointment__c> todaysAppointments = [
        //     SELECT Id, Patient__r.Name, Patient__r.Age__c,Start_Time__c,End_Time__c
        //     FROM Appointment__c
        //     WHERE Date__c = :today
        //     AND Dr__c = :currentUserId
        // ];



        List<Appointment__c> todaysAppointments = [
            SELECT Id, Patient__r.Name, Patient__c, Patient__r.Age__c,Start_Time__c,End_Time__c,appointment_checkbox__c
            FROM Appointment__c
            WHERE (Date__c = :today
            AND Dr__c = :currentUserId AND appointment_checkbox__c=false)
        ];

        // List<Appointment__c> todaysAppointments = [
        //     SELECT Id, appointment_checkbox__c
        //     FROM Appointment__c
        //     WHERE (Dr__r.Name = :currentUser.Name 
        //     AND Date__c = :today AND appointment_checkbox__c=false)
        // ];

        System.debug('todaysAppointments123 : '+todaysAppointments);

        // Create a list of maps to flatten the data
        List<Map<String, Object>> result = new List<Map<String, Object>>();
        for (Appointment__c appointment : todaysAppointments) {
            Map<String, Object> appointmentMap = new Map<String, Object>();
            appointmentMap.put('Id', appointment.Id);
            appointmentMap.put('PatientName', appointment.Patient__r.Name);
            appointmentMap.put('Age', appointment.Patient__r.Age__c);
            appointmentMap.put('patintidapp', appointment.Patient__c);
            
             // Convert Start_Time__c and End_Time__c to human-readable format
        if (appointment.Start_Time__c != null) {
            String startTimeFormatted = formatTime(appointment.Start_Time__c);
            appointmentMap.put('StartTime', startTimeFormatted);
        }

        if (appointment.End_Time__c != null) {
            String endTimeFormatted = formatTime(appointment.End_Time__c);
            appointmentMap.put('EndTime', endTimeFormatted);
        }
            result.add(appointmentMap);
            system.debug('result123'+result);
        }

        return result;
        
    }
    
     // Helper method to convert Time to a human-readable string (e.g., "12:15 AM")
public static String formatTime(Time t) {
    String formattedTime;
    Integer hour = t.hour();
    Integer minute = t.minute();

    // Determine if the time is AM or PM
    String period = (hour >= 12) ? 'PM' : 'AM';

    // Adjust hour for 12-hour clock format
    if (hour == 0) {
        hour = 12; // Midnight is 12 AM
    } else if (hour > 12) {
        hour -= 12; // Convert to 12-hour format
    }

    // Pad minutes with leading zero if necessary
    String minuteString = (minute < 10) ? '0' + String.valueOf(minute) : String.valueOf(minute);

    // Format time as "h:mm AM/PM"
    formattedTime = hour + ':' + minuteString + ' ' + period;
    
    return formattedTime;
}


    @AuraEnabled(cacheable=true)
    public static Medical_Record__c getMedicalRecord(Id patientId) {
        return [SELECT Id, Admit__c, Diagonisis__c, Visit_Date__c, Prescription__c, Patient_id__r.Name 
                FROM Medical_Record__c 
                WHERE Patient_id__r.Id = :patientId LIMIT 1];
    }
    public class TodayAppointmentWrapper {
        @AuraEnabled public Integer todaysAppointmentsCount;
    }
      @AuraEnabled(cacheable=true)
    public static TodayAppointmentWrapper getTodaysAppointmentsForCurrentUser() {
        // Get the current user ID
        Id currentUserId = UserInfo.getUserId();
        System.debug('Current User ID: ' + currentUserId);
        
        // Query to get the current user's role
        User currentUser = [
            SELECT Id, Name, UserRole.Name 
            FROM User 
            WHERE Id = :currentUserId
            LIMIT 1
        ];
        System.debug('Current User: ' + currentUser);

        // Create a wrapper to store the count
        TodayAppointmentWrapper result = new TodayAppointmentWrapper();
        result.todaysAppointmentsCount = 0;
        
        // Check if the user role contains 'Doctor'
        if (currentUser.UserRole != null && currentUser.UserRole.Name.contains('Doctor')) {
            System.debug('User is a Doctor: ' + currentUser.Name);
            
            // Get today's date
            Date today = Date.today();
            System.debug('Today\'s Date: ' + today);
            
            // Query for today's appointments for this doctor
            // List<Appointment__c> todaysAppointments = [
            //     SELECT Id 
            //     FROM Appointment__c
            //     WHERE Dr__r.Name = :currentUser.Name
            //     AND Date__c = :today
            // ];
            List<Appointment__c> todaysAppointments = [
                SELECT Id
                FROM Appointment__c
                WHERE Dr__r.Name = :currentUser.Name 
                AND Date__c = :today AND appointment_checkbox__c=false
            ];
            
            // Log the appointment results
            System.debug('Today\'s Appointments: ' + todaysAppointments);
            
            // Set today's appointment count
            result.todaysAppointmentsCount = todaysAppointments.size();
        } else {
            System.debug('User is not a Doctor or no role found.');
        }
        
        // Return the wrapper object with the count
        System.debug('Today\'s Appointment Count: ' + result.todaysAppointmentsCount);
        return result;
    }
    
     public class TotalAppointmentWrapper {
        @AuraEnabled public Integer totalAppointmentsCount;
    }
    
     @AuraEnabled(cacheable=true)
    public static TotalAppointmentWrapper getTotalAppointmentsForCurrentUser() {
        // Get the current user ID
        Id currentUserId = UserInfo.getUserId();
        
        // Query to get the current user's role
        User currentUser = [
            SELECT Id, Name, UserRole.Name 
            FROM User 
            WHERE Id = :currentUserId
            LIMIT 1
        ];

        TotalAppointmentWrapper result = new TotalAppointmentWrapper();
        result.totalAppointmentsCount = 0;
        
        // Check if the user role contains 'Doctor'
        if (currentUser.UserRole != null && currentUser.UserRole.Name.contains('Doctor')) {
            // Query for total appointments
            Integer totalAppointmentsCount = [
                SELECT COUNT()
                FROM Appointment__c
                WHERE Dr__r.Name = :currentUser.Name
            ];
            result.totalAppointmentsCount = totalAppointmentsCount;
        }

        return result;
    }
    



 @AuraEnabled(cacheable=true)
    public static List<Medical_Record__c> fetchMedicalRecordsDoc(Id patientId) {
        return [
            SELECT Id, Diagonisis__c,  Visit_Date__c, Remarks__c,
             patient_appointment_id__c, patient_appointment_id__r.Patient__c,
             patient_appointment_id__r.Dr__r.Name
            FROM Medical_Record__c where id =: patientId 
            ORDER BY CreatedDate DESC LIMIT 1
        ];
    }
    
        @AuraEnabled(cacheable=true)
public static List<Map<String, Object>> getUpcomingAppointments() {
    Id currentUserId = UserInfo.getUserId();
    List<Map<String, Object>> result = new List<Map<String, Object>>();
    
    try {
        // Fetch today's appointments for the logged-in doctor
        List<Appointment__c> todaysAppointments = [SELECT Id, Patient__r.Name, Date__c, Start_Time__c, End_Time__c 
                                                   FROM Appointment__c 
                                                   WHERE Date__c > TODAY AND Dr__c = :currentUserId  
                                                   ORDER BY Date__c ASC];
        
        System.debug('todaysAppointments: ' + todaysAppointments);

        // Create a list of maps to flatten the data
        for (Appointment__c appointment : todaysAppointments) {
            Map<String, Object> appointmentMap = new Map<String, Object>();
            appointmentMap.put('Id', appointment.Id);
            appointmentMap.put('PatientName', appointment.Patient__r.Name);
            appointmentMap.put('AppointmentDate', appointment.Date__c);
            
            // Convert Start_Time__c and End_Time__c to human-readable format
            if (appointment.Start_Time__c != null) {
                String startTimeFormatted = formatTime(appointment.Start_Time__c);
                appointmentMap.put('StartTime', startTimeFormatted);
            }

            if (appointment.End_Time__c != null) {
                String endTimeFormatted = formatTime(appointment.End_Time__c);
                appointmentMap.put('EndTime', endTimeFormatted);
            }

            result.add(appointmentMap);
        }

    } catch (Exception e) {
        // Log the error and return an empty result or a custom error message
        System.debug('Error fetching upcoming appointments: ' + e.getMessage());
    }

    return result;
}
    
@AuraEnabled
public static void saveMedicalRecord(Map<String, Object> medicalRecordDetails) {
    System.debug('MedicalRecordDetails: ' + medicalRecordDetails);

    // Extract values from the input map
    Id patientId = (String) medicalRecordDetails.get('Patient_id__c');

    //String heightStr = (String) medicalRecordDetails.get('Height__c');
    //Decimal Height = heightStr != null ? Decimal.valueOf(heightStr) : null;

    String weightStr = (String) medicalRecordDetails.get('Weight__c');
    //Decimal Weight = weightStr != null ? Decimal.valueOf(weightStr) : null;
    Decimal Weight = null;
    if (!String.isBlank(weightStr)) {
        Weight = Decimal.valueOf(weightStr);
    }

    //Decimal Height = (Decimal) medicalRecordDetails.get('Height__c');
   
    //String Prescription = (String) medicalRecordDetails.get('Prescription__c');
   

    String bp = (String) medicalRecordDetails.get('Bp__c');

    String tempStr = (String) medicalRecordDetails.get('Temperature__c');

    //Decimal Temperature = tempStr != null ? Decimal.valueOf(tempStr) : null;
    Decimal Temperature = null;
    if (!String.isBlank(tempStr)) {
        Temperature = Decimal.valueOf(tempStr);
    }

    Boolean hcg = (Boolean) medicalRecordDetails.get('hCG_test__c');

    Boolean hba1c = (Boolean) medicalRecordDetails.get('HbA1c_test__c');
   
    Boolean bloodtest = (Boolean) medicalRecordDetails.get('Blood_test__c');
   
    Boolean Urineexamination = (Boolean) medicalRecordDetails.get('Urine_examination__c');

    Boolean admit = (Boolean) medicalRecordDetails.get('Admit__c');

    String visitDateString = (String) medicalRecordDetails.get('Visit_Date__c');

    String Remarks = (String) medicalRecordDetails.get('Remarks__c');
   
   
   
   

    // Convert visit date from String to Date
    //Date visitDate = Date.valueOf(visitDateString);
    Date visitDate = null;
    if (!String.isBlank(visitDateString)) {
        visitDate = Date.valueOf(visitDateString);
    }


    System.debug('visitDate in date format::' + visitDate);

    // Create a new Medical_Record__c record
    Medical_Record__c medicalRecord = new Medical_Record__c();
   
    // Assign the values
    medicalRecord.Patient_id__c = patientId;
   // medicalRecord.Height__c = Height; // Assuming it's a lookup to Patient_Registration__c
    //medicalRecord.Prescription__c = Prescription;
    medicalRecord.Weight__c = Weight;
    medicalRecord.BP__c = bp;
    medicalRecord.Temperature__c = Temperature;
    medicalRecord.hCG_test__c = hcg;
    medicalRecord.HbA1c_test__c = hba1c;
    medicalRecord.Blood_test__c = bloodtest;
    medicalRecord.Urine_examination__c = Urineexamination;
    medicalRecord.Admit__c = admit;
    medicalRecord.Visit_Date__c = visitDate;
    medicalRecord.Remarks__c = Remarks;
   
   
   
   
   
   
   
 

    try {
        // Insert the medical record
        System.debug('before inserting medicalRecord::' + medicalRecord);
        insert medicalRecord;
        System.debug('Medical Record inserted successfully:::' + medicalRecord);

        // for removing from doctorDashboard::
        List<Appointment__c> appToBeRemoved = [select Id, Name, CreatedDate,appointment_checkbox__c, (Select Id from Medical_Records__r where CreatedDate >= TODAY and Id =: medicalRecord.Id)
                                                 from Appointment__c where CreatedDate >= Today limit 1];
        System.debug('appToBeRemoved::' + appToBeRemoved);

       

        // create checkbox -- MedicationDone bydefault false
        // if **medicalRecord** created then make Appointment checkbiox as checked
        // appToBeRemoved[0]._______ = true;
        // update appToBeRemoved[0];

        // Check if there is at least one related medical record
        if (!appToBeRemoved.isEmpty() && !appToBeRemoved[0].Medical_Records__r.isEmpty()) {
        // Set the checkbox appointment_checkbox__c to true
        appToBeRemoved[0].appointment_checkbox__c = true;

        System.debug('appToBeRemoved[0]'+appToBeRemoved[0]);
        // Update the appointment record
        update appToBeRemoved[0];
        }


    } catch (DmlException e) {
        throw new AuraHandledException('Error inserting medical record: ' + e.getMessage()  + '\nget line number::' + e.getLineNumber());
    }
}



// @AuraEnabled(cacheable=true)
// public static Integer getAdmittedPatientsCount() {
//     // Query the count of patients where Status is 'Admitted'
//     Integer count = [SELECT COUNT() FROM Medical_Record__c WHERE Admit__c = true];
    
//     // Return the count, if there are no records, it will naturally return 0
//     return count;
// }





public class AdmittedPatientsWrapper {
    @AuraEnabled public Integer admittedPatientsCount;
}

@AuraEnabled(cacheable=true)
public static AdmittedPatientsWrapper getAdmittedPatientsCount() {
    // Create a wrapper to store the count
    AdmittedPatientsWrapper result = new AdmittedPatientsWrapper();
    result.admittedPatientsCount = 0;  // Initialize count to 0

    // Query to get the count of admitted patients
    Integer count = [SELECT COUNT() 
                     FROM Medical_Record__c 
                     WHERE Admit__c = true];
    
    // Set the admitted patients count
    result.admittedPatientsCount = count;

    // Return the wrapper object with the count
    return result;
}

    
    
    @AuraEnabled
    public static Id cancelAppointment(Id patientCheckId) {
        try {
            // Log the received patient ID
            System.debug('Cancel Appointment - Patient ID: ' + patientCheckId);
            
            // Query the patient registration record
            Patient_Registration__c patientRegistration = [SELECT Id, Show_Patient__c 
                                                           FROM Patient_Registration__c 
                                                           WHERE Id = :patientCheckId LIMIT 1];
            
            // Log the patient registration record details before updating
            System.debug('Patient Registration Record before update: ' + patientRegistration);
            
            // Uncheck the checkbox
            patientRegistration.Show_Patient__c = false; 
            
            // Update the record
            System.debug('patientRegistration:::' + patientRegistration);
            update patientRegistration;
            
            // Log after the update
            System.debug('Patient Registration Record updated successfully for ID: ' + patientRegistration.Id);
            Appointment__c appointmentRecord = [
                SELECT Id, appointment_checkbox__c 
                FROM Appointment__c 
                WHERE Patient__c = :patientCheckId 
                LIMIT 1
            ];
            
            // Set the appointment_checkbox__c to true
            appointmentRecord.appointment_checkbox__c = true;
    
            // Update the appointment record
            update appointmentRecord;
            
            // Log after the appointment update
            System.debug('Appointment Record updated successfully for ID: ' + appointmentRecord.Id);
    
            return patientRegistration.Id;
        } catch (Exception e) {
            // Log the error before throwing an exception
            System.debug('Error in cancelAppointment: ' + e.getMessage());
            throw new AuraHandledException('Error canceling appointment: ' + e.getMessage());
        }
    }


    
    /////////////Add Details/////////
   /* @AuraEnabled
    public static void saveDiagnosisRecords(Id patientId,List<String> complaints, List<String> observations, List<String> diagnoses,List<String> notes) {
        List<Diagonisis__c> diagnosisRecords = new List<Diagonisis__c>();
        
        Integer maxRecords = Math.max(Math.max(complaints.size(), observations.size()), diagnoses.size());

        for (Integer i = 0; i < maxRecords; i++) {
            Diagonisis__c record = new Diagonisis__c();
            
            record.Patient_Name__c = patientId;
            
            if (i < complaints.size()) {
                record.Complaints__c = complaints[i];
            }
            
            if (i < observations.size()) {
                record.Observations__c = observations[i];
            }
            
            if (i < diagnoses.size()) {
                record.Diagnosis__c = diagnoses[i];
            }
            
             if (!notes.isEmpty()) {
                record.Notes__c = notes[0]; // Apply the first note to all records
            }
            
            diagnosisRecords.add(record);
        }

        try {
            // Insert all records at once
            insert diagnosisRecords;
        } catch (Exception e) {
            throw new AuraHandledException('Error saving Diagnosis records: ' + e.getMessage());
        }
    }*/
    @AuraEnabled
public static void saveDiagnosisRecords(Id patientId, List<String> complaints, List<String> observations, List<String> diagnoses, List<String> notes) {
    // Create a single Diagnosis record
    Diagonisis__c record = new Diagonisis__c();
    record.Patient_Name__c = patientId;
    
    // Combine the lists into single strings and assign them to the fields
    if (!complaints.isEmpty()) {
        record.Complaints__c = String.join(complaints, ', '); // Combine complaints into a comma-separated string
    }
    if (!observations.isEmpty()) {
        record.Observations__c = String.join(observations, ', '); // Combine observations into a comma-separated string
    }
    if (!diagnoses.isEmpty()) {
        record.Diagnosis__c = String.join(diagnoses, ', '); // Combine diagnoses into a comma-separated string
    }
    if (!notes.isEmpty()) {
        record.Notes__c = notes[0]; // Use the first note for the Notes field
    }

    try {
        // Insert the single record
        insert record;
    } catch (Exception e) {
        throw new AuraHandledException('Error saving Diagnosis record: ' + e.getMessage());
    }
}

    
    
  @AuraEnabled
public static void saveMedicalDetails(List<Map<String, Object>> medicalRecordsData) {
    List<Medical_Record__c> recordsToInsert = new List<Medical_Record__c>();

    try {
        // Iterate through the medical record data to create Medical_Record__c objects
        for (Map<String, Object> recordData : medicalRecordsData) {
            Medical_Record__c newRecord = new Medical_Record__c(
                Patient_id__c = (Id) recordData.get('Patient_id__c'),
                Height__c = (Decimal) recordData.get('Height__c'),
                Weight__c = (Decimal) recordData.get('Weight__c'),
                Bp__c = (String) recordData.get('Bp__c'),
                Temperature__c = (Decimal) recordData.get('Temperature__c'),
                HCG_Test__c = (Boolean) recordData.get('HCG_Test__c'),
                HbA1c_Test__c = (Boolean) recordData.get('HbA1c_Test__c'),
                Blood_Test__c = (Boolean) recordData.get('Blood_Test__c'),
                Urine_Examination__c = (Boolean) recordData.get('Urine_Examination__c'),
                Admit__c = (Boolean) recordData.get('Admit__c'),
                Visit_Date__c = Date.valueOf((String) recordData.get('Visit_Date__c')),
                Remarks__c = (String) recordData.get('Remarks__c')
            );
            recordsToInsert.add(newRecord);
        }

        // Insert the medical records
        insert recordsToInsert;

    } catch (Exception e) {
        throw new AuraHandledException('Error saving medical records: ' + e.getMessage());
    }
}



    
    
    @AuraEnabled(cacheable=true)
    public static List<Medicine__c> getMedicines() {
        return [SELECT Id, Name FROM Medicine__c];
    }

    
    
     @AuraEnabled(cacheable=true)
    public static Map<String, List<String>> getPicklistValues() {
        Map<String, List<String>> picklistValuesMap = new Map<String, List<String>>();
        
        // Get Frequency__c picklist values
        List<String> frequencyOptions = new List<String>();
        Schema.DescribeFieldResult frequencyField = Prescription__c.Frequency__c.getDescribe();
        for (Schema.PicklistEntry entry : frequencyField.getPicklistValues()) {
            frequencyOptions.add(entry.getLabel());
        }
        
        // Get Intake__c picklist values
        List<String> intakeOptions = new List<String>();
        Schema.DescribeFieldResult intakeField = Prescription__c.Intake__c.getDescribe();
        for (Schema.PicklistEntry entry : intakeField.getPicklistValues()) {
            intakeOptions.add(entry.getLabel());
        }
        
        picklistValuesMap.put('Frequency__c', frequencyOptions);
        picklistValuesMap.put('Intake__c', intakeOptions);
        
        return picklistValuesMap;
    }
    
    
 @AuraEnabled
    public static void savePrescriptionRecords(List<Prescription__c> prescriptions) {
        try {
            insert prescriptions;
        } catch (Exception e) {
            throw new AuraHandledException('Error saving prescriptions: ' + e.getMessage());
        }
    }
}