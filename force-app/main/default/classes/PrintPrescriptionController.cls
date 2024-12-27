public with sharing class PrintPrescriptionController {
    public Id patientId { get; set; }
    public Prescription__c prescription { get; set; }
    public Date nextVisitDate { get; set; }
    public List<Prescription__c> todayPrescriptions { get; set; }
    public Boolean hasRecords { get; set; }
    public String doctorName { get; set; }

    public PrintPrescriptionController() {
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
    List<Medical_Record__c> medicalRecords = [
    SELECT Id, 
           	Visit_Date__c
    FROM Medical_Record__c
    WHERE Patient_id__c = :patientId
         AND CreatedDate = TODAY ];

  public String getFormattedNextVisitDate() {
    if (medicalRecords != null && !medicalRecords.isEmpty()) {
        Date nextVisitDate = medicalRecords[0].Visit_Date__c;
        DateTime nextVisitDateTime = DateTime.newInstance(nextVisitDate, Time.newInstance(0, 0, 0, 0));
        return nextVisitDateTime.format('dd MMM yyyy'); // E.g., "27 Nov 2024"
    }
    return '';
}
  // Method to format the CreatedDate
    public String getFormattedCreatedDate() {
        if (todayPrescriptions != null && !todayPrescriptions.isEmpty()) {
            DateTime createdDate = todayPrescriptions[0].CreatedDate;
            return createdDate.format('dd MMM yyyy'); // E.g., "27 Nov 2024"
        }
        return 'Date not available';
    }

}