public with sharing class PrintPrescriptionController {
    public Id patientId { get; set; }
    public Prescription__c prescription { get; set; }
    public Date nextVisitDate { get; set; }
     public String formattedNextVisitDate { get; set; }
    public List<Prescription__c> todayPrescriptions { get; set; }
    public Boolean hasRecords { get; set; }
    public String doctorName { get; set; }

    public PrintPrescriptionController() {
         formattedNextVisitDate = getFormattedNextVisitDate();
        patientId = ApexPages.currentPage().getParameters().get('patientId');
        
        todayPrescriptions = [SELECT Id, Patient_Registration__r.Name, Patient_Registration__r.Gender__c, 
                                     Patient_Registration__r.Age__c, Patient_Registration__r.Address__c,
                                     Drug__r.Name, Dosage__c, Duration__c, Frequency__c, Intake__c, CreatedDate,
                                     CreatedBy.Name,Patient_Registration__r.patientID__c
                              FROM Prescription__c
                              WHERE Patient_Registration__c = :patientId
                              AND CreatedDate = TODAY AND Invoice_Created__c=FALSE];
                              
        hasRecords = !todayPrescriptions.isEmpty();
        
        // If there are records, get the doctor's name from the first record's creator
        if (hasRecords) {
            doctorName = todayPrescriptions[0].CreatedBy.Name;
        } else {
            doctorName = 'No Prescriptions Today';
        }
    }
   /*List<Medical_Record__c> medicalRecords = [
    SELECT Id, 
           Visit_Date__c
    FROM Medical_Record__c
    WHERE Patient_Id__c = :patientId
          AND CreatedDate = TODAY
];*/

    
 /* public String getFormattedNextVisitDate() {
       System.debug('GEfdfefjjvfhvdhv ');
    if (medicalRecords != null && !medicalRecords.isEmpty()) {
        System.debug('GEfdfefjjvfhvdhv ');
        Date nextVisitDate = medicalRecords[0].Visit_Date__c;
        DateTime nextVisitDateTime = DateTime.newInstance(nextVisitDate, Time.newInstance(0, 0, 0, 0));
        System.debug('nextVisitDateTime '+nextVisitDateTime );
        return nextVisitDateTime.format('dd MMM yyyy'); // E.g., "27 Nov 2024"
    }
    return 'null';
}*/
    public String getFormattedNextVisitDate() {
        String patientId = ApexPages.currentPage().getParameters().get('patientId');
        System.debug('patientId: ' + patientId);

        List<Medical_Record__c> medicalRecords = [
            SELECT Id, Visit_Date__c
            FROM Medical_Record__c
            WHERE Patient_Id__c = :patientId
                  AND CreatedDate = TODAY
             ORDER BY Visit_Date__c DESC LIMIT 1
        ];

        System.debug('medicalRecords: ' + medicalRecords);

        if (medicalRecords != null && !medicalRecords.isEmpty()) {
            Date nextVisitDate = medicalRecords[0].Visit_Date__c;

            if (nextVisitDate != null) {
                DateTime nextVisitDateTime = DateTime.newInstance(nextVisitDate, Time.newInstance(0, 0, 0, 0));
                return nextVisitDateTime.format('dd MMM yyyy'); // E.g., "27 Nov 2024"
            } else {
                System.debug('Visit_Date__c is null for the first record.');
            }
        } else {
            System.debug('No records found for patientId: ' + patientId);
        }

        return 'No Next Visit Date Found'; // Return a more informative message
    }



    
  // Method to format the CreatedDate
    public String getFormattedCreatedDate() {
        if (todayPrescriptions != null && !todayPrescriptions.isEmpty()) {
            DateTime createdDate = todayPrescriptions[0].CreatedDate;
             System.debug('createdDate '+createdDate );
            return createdDate.format('dd MMM yyyy'); // E.g., "27 Nov 2024"
        }
        return 'Date not available';
    }

}