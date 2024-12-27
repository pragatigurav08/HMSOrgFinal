public with sharing class MedicineDataController {
    @AuraEnabled(cacheable=true)
    public static Map<String, Integer> getMedicineTypeCounts() {
        Map<String, Integer> medicineTypeCounts = new Map<String, Integer>();

        try {
            // Aggregate query for Medicine Type counts
            List<AggregateResult> results = [
                SELECT Medicine_Type__c, COUNT(Id)
                FROM Medicine__c
                GROUP BY Medicine_Type__c
            ];

            // Process results
            for (AggregateResult ar : results) {
                String type = (String) ar.get('Medicine_Type__c');
                Integer count = Integer.valueOf(ar.get('expr0')); // COUNT(Id) is returned as 'expr0'

                if (type == null) {
                    type = 'Unknown'; // Handle null Medicine_Type__c
                }

                medicineTypeCounts.put(type, count);
            }
        } catch (Exception e) {
            System.debug('Error in MedicineDataController: ' + e.getMessage());
            throw new AuraHandledException('Unable to fetch medicine type counts. ' + e.getMessage());
        }

        return medicineTypeCounts;
    }
}