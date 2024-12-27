import { LightningElement, track } from 'lwc';

import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';  // Import for Toast messages
import uploadFile from '@salesforce/apex/CustomerOnboardingNewAccount.uploadFile';

export default class LoanComponent extends NavigationMixin(LightningElement) {
    @track uploadedFile = '';
    @track fileName = '';         // File name
    @track fileUrl = '';          // File URL for preview
    @track fileSize = '';
    @track isUnsupportedFile = false;
    @track isFileUploaded = false;
    @track isModalOpen = false;  // For handling modal

    handleFileUpload(event) {
        const uploadedFiles = event.target.files;
        if (uploadedFiles.length > 0) {
            const file = uploadedFiles[0];

            // Validate file size (3 MB limit)
            const fileSizeLimit = 3 * 1024 * 1024; // 3 MB in bytes
            if (file.size > fileSizeLimit) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'File Size Error',
                        message: 'The file size limit exceeded. Please upload a smaller file.',
                        variant: 'error'
                    })
                );
                return; // Prevent further execution if file size exceeds the limit
            }

            this.fileName = file.name;
            this.fileSize = this.formatBytes(file.size);

            // Call readFile to set the fileUrl and file type flags
            this.readFile(file);
            this.isFileUploaded = true;
        }
    }

    readFile(file) {
        const reader = new FileReader();
        reader.onload = () => {
            const fileType = file.type;
            this.fileUrl = reader.result; // Base64 encoded file content

            // Set file type flags
            if (fileType.startsWith('image/')) {
                this.isImage = true;
                this.isPdf = false;
                this.isUnsupportedFile = false;

                // Add the proper Base64 MIME type prefix for images
                this.fileUrl = `data:${fileType};base64,${reader.result.split(',')[1]}`;
            } else if (fileType === 'application/pdf') {
                this.isImage = false;
                this.isPdf = true;
                this.isUnsupportedFile = false;

                // Add the proper Base64 MIME type prefix for PDFs
                this.fileUrl = `data:application/pdf;base64,${reader.result.split(',')[1]}`;
            } else {
                this.isImage = false;
                this.isPdf = false;
                this.isUnsupportedFile = true;
            }

            // Store Base64 encoded file data without the MIME type prefix
            this.uploadedFile = reader.result.split(',')[1]; // Extract Base64 part
        };
        reader.readAsDataURL(file);
    }

    handlePreviewClick() {
        if (this.fileUrl) {
            this.isModalOpen = true;
        }
    }

    handleDeleteClick() {
        this.fileName = '';
        this.fileSize = '';  // Clear the file size
        this.fileUrl = '';
        this.isUnsupportedFile = false;
        this.isFileUploaded = false;
    }

    uploadFileToAccount(accountId, base64Data, fileName) {
        // Call the Apex method to upload the file to ContentVersion
        uploadFile({
            base64Data: base64Data,
            fileName: fileName,
            recordId: accountId
        })
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'File uploaded successfully',
                    variant: 'success'
                })
            );
            // Navigate to account details page after file upload is successful
            this.handlenavigation(accountId);
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error uploading file',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }

    clearFields() {
        this.uploadedFile = '';
        this.searchK = '';
        this.AadharCardno = '';
    }

    // Method to handle navigation after file upload
   

    handleFileUploadAction(accountId) {
        if (this.uploadedFile) {  // Ensure file data exists before upload
            this.uploadFileToAccount(accountId, this.uploadedFile, this.fileName);
        } else {
            // If no file is uploaded, navigate directly to the account details page
            this.handlenavigation(accountId);
        }
    }

    // Utility to format bytes for display
    formatBytes(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    }
}