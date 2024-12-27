import { LightningElement, track } from 'lwc';
import saveFile from '@salesforce/apex/FileUploadController.saveFile';
import createRecord from '@salesforce/apex/FileUploadController.createRecord';
const imageUrl = `/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=${this.contentDocumentId}&operationContext=CHATTER`;


export default class FileUploadComponent2 extends LightningElement {
    @track isFileSelected = false;
    @track fileName = '';
    @track base64FileData = '';
    @track uploadedFileUrl = '';
    @track contentDocumentId = ''; // Store ContentDocumentId
    @track errorMessage = '';
    @track successMessage = ''; // New property for success message

    handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            this.isFileSelected = true;
            this.fileName = file.name;

            const fileExtension = this.fileName.split('.').pop().toLowerCase();
            const allowedFileTypes = ['png', 'jpg', 'jpeg', 'pdf'];

            if (!allowedFileTypes.includes(fileExtension)) {
                this.errorMessage = 'Invalid file type. Please upload a PDF or image file.';
                this.isFileSelected = false;
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                this.base64FileData = base64;
            };
            reader.readAsDataURL(file);
        }
    }

   uploadFile() {
    saveFile({
        fileName: this.fileName,
        base64Data: this.base64FileData
    })
        .then((contentDocumentId) => {
            this.contentDocumentId = contentDocumentId; // Store ContentDocumentId
            this.uploadedFileUrl = `/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=${contentDocumentId}&operationContext=CHATTER`;
            this.errorMessage = '';
            this.successMessage = 'File uploaded successfully!'; // Add success message for upload
            
            // After uploading the file, save the record
            this.saveRecord(); // Call saveRecord to store the ContentDocumentId
        })
        .catch((error) => {
            this.errorMessage = 'File upload failed. ' + error.body.message;
        });
}

saveRecord() {
    if (this.contentDocumentId) {
        createRecord({
            contentDocumentId: this.contentDocumentId // Pass ContentDocumentId instead
        })
        .then((recordId) => {
            this.errorMessage = ''; // Clear any previous error messages
            this.successMessage = 'Record created successfully!'; // Set success message on successful creation
            // Optionally reset fields after a successful save
            this.resetFields();
            console.log('Record created with Id: ' + recordId);
        })
        .catch((error) => {
            this.errorMessage = 'Record creation failed. ' + error.body.message;
        });
    } else {
        this.errorMessage = 'No file uploaded to save.';
    }
}


    resetFields() {
        this.isFileSelected = false;
        this.fileName = '';
        this.base64FileData = '';
        this.uploadedFileUrl = '';
        this.contentDocumentId = '';
        this.successMessage = ''; // Reset success message
    }
}