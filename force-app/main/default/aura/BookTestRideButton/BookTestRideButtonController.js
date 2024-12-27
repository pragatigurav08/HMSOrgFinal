/**
 * @description       : 
 * @author            : Saurav Kashyap
 * @group             : SK Group
 * @last modified on  : 21-08-2023
 * @last modified by  : Saurav Kashyap 
 * Modifications Log
 * Ver   Date         Author           Modification
 * 1.0   21-08-2023   Saurav Kashyap   Initial Version
**/
({
    myAction : function(component, event, helper) {

    },
    closeQA : function(component, event, helper) {
		$A.get("e.force:closeQuickAction").fire();
	}
})