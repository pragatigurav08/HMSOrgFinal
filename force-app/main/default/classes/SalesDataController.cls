/**
* @File Name : SalesDataController.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : December 13, 2024
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | December 13, 2024 |   | Initial Version
**/

public with sharing class SalesDataController {
    @AuraEnabled(cacheable=true)
    public static Map<String, Decimal> getSalesData() {
        // Map to store sales data
        Map<String, Decimal> salesData = new Map<String, Decimal>();

        // Daily Sales
        List<AggregateResult> dailySalesResult = [
            SELECT SUM(Total__c) total 
            FROM Billing__c 
            WHERE CreatedDate = TODAY
        ];
        Decimal dailySales = dailySalesResult.isEmpty() || dailySalesResult[0].get('total') == null 
            ? 0 
            : (Decimal) dailySalesResult[0].get('total');
        salesData.put('DailySales', dailySales);

        // Weekly Sales
        List<AggregateResult> weeklySalesResult = [
            SELECT SUM(Total__c) total 
            FROM Billing__c 
            WHERE CreatedDate = LAST_N_DAYS:7
        ];
        Decimal weeklySales = weeklySalesResult.isEmpty() || weeklySalesResult[0].get('total') == null 
            ? 0 
            : (Decimal) weeklySalesResult[0].get('total');
        salesData.put('WeeklySales', weeklySales);

        // Monthly Sales
        List<AggregateResult> monthlySalesResult = [
            SELECT SUM(Total__c) total 
            FROM Billing__c 
            WHERE CreatedDate = THIS_MONTH
        ];
        Decimal monthlySales = monthlySalesResult.isEmpty() || monthlySalesResult[0].get('total') == null 
            ? 0 
            : (Decimal) monthlySalesResult[0].get('total');
        salesData.put('MonthlySales', monthlySales);

        return salesData;
    }
}