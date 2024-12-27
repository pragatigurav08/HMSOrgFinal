import { LightningElement, track } from 'lwc';

export default class FormBuilder extends LightningElement {
    @track formElements = [];
    @track undoStack = [];

    handleDragStart(event) {
        event.dataTransfer.setData('text', event.target.dataset.type || event.target.innerText);
    }

    allowDrop(event) {
        event.preventDefault();
    }

    handleDropDataType(event) {
        event.preventDefault();
        const fieldType = event.dataTransfer.getData('text');
        this.undoStack.push([...this.formElements]); // Save a copy for undo
        this.formElements.push({ id: Date.now(), type: fieldType, label: `${fieldType} Label` });
    }

    handleDrop(event) {
        event.preventDefault();
        const fieldId = event.dataTransfer.getData('text');
        const droppedField = this.formElements.find((element) => element.id === parseInt(fieldId, 10));
        if (droppedField) {
            droppedField.inputValue = ''; // Initialize input value
        }
    }

    handleUndo() {
        if (this.undoStack.length > 0) {
            this.formElements = this.undoStack.pop();
        }
    }

    handleSave() {
        // Emit a custom event to notify the parent component (or another component) to save the template
        const saveEvent = new CustomEvent('save', {
            detail: {
                template: this.formElements
            }
        });
        this.dispatchEvent(saveEvent);
    }
}