import { LightningElement, track } from 'lwc';
import saveFile from '@salesforce/apex/FileUploadController.saveFile';
import createRecord from '@salesforce/apex/FileUploadController.createRecord';

export default class FileUploadComponent extends LightningElement {
    @track isFileSelected = false;
    @track fileName = '';
    @track base64FileData = '';
    @track uploadedFileUrl = '';
    @track contentDocumentId = '';
    @track errorMessage = '';
    @track successMessage = '';

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
        console.log('Uploading file...');
        saveFile({
            fileName: this.fileName,
            base64Data: this.base64FileData
        })
            .then((contentDocumentId) => {
                console.log('File uploaded successfully, ContentDocumentId:', contentDocumentId);
                this.contentDocumentId = contentDocumentId;
                this.uploadedFileUrl = `/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=${contentDocumentId}&operationContext=CHATTER`;
                this.errorMessage = '';
                this.successMessage = 'File uploaded successfully!';

                // Call saveRecord to store the ContentDocumentId
                return this.saveRecord();
            })
            .catch((error) => {
                console.error('Error in uploadFile:', error);
                this.errorMessage = 'File upload failed. ' + error.body.message;
            });
    }

    saveRecord() {
        console.log('Saving record with ContentDocumentId:', this.contentDocumentId);
        if (this.contentDocumentId) {
            createRecord({
                contentDocumentId: this.contentDocumentId
            })
                .then((recordId) => {
                    console.log('Record created with Id:', recordId);
                    this.errorMessage = '';
                    this.successMessage = 'Record created successfully!';
                    this.resetFields();
                })
                .catch((error) => {
                    console.error('Error in saveRecord:', error);
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
        this.successMessage = '';
    }
}