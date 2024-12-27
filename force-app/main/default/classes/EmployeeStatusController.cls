public with sharing class EmployeeStatusController {
  @AuraEnabled(cacheable=true)
  public static List<Employee__c> getEmployeeStatuses() {
    return [SELECT Id, Employee_Name__c, Status__c,Gender__c FROM Employee__c];
  }
}