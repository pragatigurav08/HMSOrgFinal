import { LightningElement } from 'lwc';

export default class TemplateSaver extends LightningElement {
    // ... other properties and methods

    handleLoadTemplate(event) {
        const templateId = event.currentTarget.dataset.templateId;
        // You can now use the templateId to load the corresponding template
        // Implement your logic to handle loading the template
        // For example, you can emit an event to notify the parent component
        // that the user wants to load a specific template
        const loadEvent = new CustomEvent('load', {
            detail: {
                templateId
            }
        });
        this.dispatchEvent(loadEvent);
    }
}