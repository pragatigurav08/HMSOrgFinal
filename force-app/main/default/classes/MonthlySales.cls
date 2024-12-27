public with sharing class MonthlySales {
    @AuraEnabled(cacheable=true)
    public static Map<String, Decimal> getMonthlySales() {
        Map<String, Decimal> monthlySales = new Map<String, Decimal>();

        // Aggregate monthly sales using CALENDAR_MONTH()
        List<AggregateResult> results = [
            SELECT CALENDAR_MONTH(CreatedDate) monthNum, SUM(Total__c) totalSales
            FROM Billing__c
            WHERE CreatedDate = THIS_YEAR
            GROUP BY CALENDAR_MONTH(CreatedDate)
            ORDER BY CALENDAR_MONTH(CreatedDate)
        ];

        // Map numeric month values to month names
        Map<String, String> monthNames = new Map<String, String>{
            '1' => 'January',
            '2' => 'February',
            '3' => 'March',
            '4' => 'April',
            '5' => 'May',
            '6' => 'June',
            '7' => 'July',
            '8' => 'August',
            '9' => 'September',
            '10' => 'October',
            '11' => 'November',
            '12' => 'December'
        };

        for (AggregateResult ar : results) {
            // Access the alias "monthNum" correctly
            String monthNum = String.valueOf(ar.get('monthNum')); 
            Decimal totalSales = (Decimal) ar.get('totalSales'); 
            
            // Use month name instead of numeric value
            monthlySales.put(monthNames.get(monthNum), totalSales);
        }

        return monthlySales;
    }
}