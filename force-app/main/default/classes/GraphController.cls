public class GraphController {
 @AuraEnabled(cacheable=true)
    public static List<DataSet> getHealthMetrics() {
        List<DataSet> dataSet = new List<DataSet>();

        try {
            // Fetch Total Doctors
            List<AggregateResult> totalDoctorsResult = [
                SELECT COUNT(Id) total 
                FROM User 
                WHERE Name LIKE '%Dr%'
            ];
            Integer totalDoctors = (Integer) totalDoctorsResult[0].get('total');
            dataSet.add(new DataSet('Total Doctors', totalDoctors));

            // Fetch Total Patients
            List<AggregateResult> totalPatientsResult = [
                SELECT COUNT(Id) total 
                FROM Patient_Registration__c
            ];
            Integer totalPatients = (Integer) totalPatientsResult[0].get('total');
            dataSet.add(new DataSet('Total Patients', totalPatients));

            // Fetch New Patients Today
            List<AggregateResult> newPatientsTodayResult = [
                SELECT COUNT(Id) total 
                FROM Patient_Registration__c 
                WHERE CreatedDate = TODAY
            ];
            Integer newPatientsToday = (Integer) newPatientsTodayResult[0].get('total');
            dataSet.add(new DataSet('New Patients Today', newPatientsToday));

            // Fetch Appointments Today
            List<AggregateResult> appointmentsTodayResult = [
                SELECT COUNT(Id) total 
                FROM Appointment__c 
                WHERE Date__c = TODAY
            ];
            Integer appointmentsToday = (Integer) appointmentsTodayResult[0].get('total');
            dataSet.add(new DataSet('Appointments Today', appointmentsToday));

        } catch (Exception ex) {
            System.debug('Error fetching health metrics: ' + ex.getMessage());
            throw new AuraHandledException('Error fetching health metrics: ' + ex.getMessage());
        }

        System.debug('Health Metrics Data: ' + dataSet);
        return dataSet;
    }

    public class DataSet {
        public DataSet(String label, Integer count) {
            this.label = label;
            this.count = count;
        }

        @AuraEnabled
        public String label { get; set; }

        @AuraEnabled
        public Integer count { get; set; }
    }
    
    @AuraEnabled(cacheable=true)
public static Map<String, Integer> getAppointmentCounts() {
    Map<String, Integer> appointmentCounts = new Map<String, Integer>();

    try {
        // Fetch appointments for today
        Integer todayAppointments = [
            SELECT COUNT() 
            FROM Appointment__c 
            WHERE CreatedDate = TODAY
        ];
        appointmentCounts.put('Today', todayAppointments);

        // Fetch appointments for the current week
        Integer weekAppointments = [
            SELECT COUNT() 
            FROM Appointment__c 
            WHERE CreatedDate = THIS_WEEK
        ];
        appointmentCounts.put('This Week', weekAppointments);

        // Fetch appointments for the current month
        Integer monthAppointments = [
            SELECT COUNT() 
            FROM Appointment__c 
            WHERE CreatedDate = THIS_MONTH
        ];
        appointmentCounts.put('This Month', monthAppointments);

    } catch (Exception ex) {
        System.debug('Error fetching appointment counts: ' + ex.getMessage());
        throw new AuraHandledException('Error fetching appointment counts: ' + ex.getMessage());
    }

    return appointmentCounts;
}

    
}