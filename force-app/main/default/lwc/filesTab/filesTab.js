import { LightningElement, wire, track } from 'lwc';
import getFiles from '@salesforce/apex/FileController.getFiles'; // Apex method to fetch files
import uploadFileToRecord from '@salesforce/apex/FileController.saveFiles';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FilesTab extends LightningElement {
    recordId;
    files = [];
    filesToShow = []; // Holds currently displayed files
    showViewAll = false; // Whether to show "View All" link
    expanded = false; // Whether the files list is expanded or collapsed
    error;
    fileUrl;
    isModalOpen = false;
    @track fileName = '';         // File name
    @track fileUrl = '';          // File URL for preview
    @track fileSize = '';         // File size
    @track isModalOpen = false;
    @track isImage = false;
    @track isPdf = false;
    @track isUnsupportedFile = false;
    @track isFileUploaded = false;
    @track uploadedFileNames = [];
    @track uploadedFileData = [];

    // Called when the component is inserted into the DOM
    connectedCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        this.recordId = urlParams.get('recordId'); // Get recordId from URL

        console.log('RecordId from URL:', this.recordId);
    }

    @wire(getFiles, { accountId: '$recordId' })
    wiredFiles({ error, data }) {
        if (data) {
            this.files = data.map(file => ({
                Id: file.Id,
                Title: file.Title,
                ContentSize: (file.ContentSize).toFixed(2),
                FileExtension: file.FileExtension.toUpperCase(),
                Url: `/sfc/servlet.shepherd/document/${file.Id}/view`
                //Url: `/sfc/servlet.shepherd/document/download/${file.Id}`
            }));

            this.filesToShow = this.files.slice(0, 2);
            this.foilescount = this.files.length;

            this.showViewAll = this.files.length > 2;
            this.error = undefined;
        } else if (error) {
            this.files = undefined;
            this.filesToShow = [];
            this.error = error;
            this.showViewAll = false;
            console.error('Error fetching files:', error);

            // Show error message in a toast
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading files',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        }
    }

    // Handle View All/Show Less button click
    handleToggleView() {
        if (this.expanded) {
            // If expanded, collapse back to 2 files
            this.filesToShow = this.files.slice(0, 2);
        } else {
            // If not expanded, show all files
            this.filesToShow = this.files;
        }
        this.expanded = !this.expanded;
    }

    handleFileClick(event) {
        const fileId = event.target.dataset.fileId;
        const file = this.files.find(f => f.Id === fileId);
        if (file) {
            this.selectedFileUrl = file.Url; // Set the selected file URL
            this.isModalOpen = true;

            // Insert image into the DOM using LWC DOM manual
            const container = this.template.querySelector('.image-container');
            if (file.FileExtension === 'JPG' || file.FileExtension === 'PNG') {
                container.innerHTML = `<img src="${this.selectedFileUrl}" alt="File Preview" style="max-width: 100%; max-height: 100%;">`;
            } else {
                container.innerHTML = `<p>File format not supported for preview.</p>`;
            }
        }
    }

    closeModal() {
        this.isModalOpen = false;
        this.selectedFileUrl = '';
        const container = this.template.querySelector('.image-container');
        container.innerHTML = ''; // Clear the modal content
    }

    get toggleButtonLabel() {
        return this.expanded ? 'Show Less' : 'View All';
    }


    // File size formatter (e.g., KB, MB)
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            
            console.log('File selected:', file.name);
            this.fileName = file.name;
            this.fileSize = this.formatBytes(file.size);
            console.log('file Size::'+file.size)
            if (file.size > 10 * 1024 * 1024) {
                // Handle the error (you can display a message to the user or log the error)
                this.showToast('File size exceeds 10 MB limit.Try Again!','Size Error', 'error');
                //this.showToast('Record Saved', 'Success', 'success');
               // alert('File size exceeds 10 MB limit.');
            }else{
                this.openfileUpload(event);
                this.isFileUploaded = true;
            }
        }
    }


    handlePreviewClick() {
        if (this.fileUrl) {
            this.isModalOpen = true;
        }
    }

    filesUploaded=[];
    openfileUpload(event) {
        let fileData = {};
        const file = event.target.files[0];
        let reader = new FileReader();
        let base64;
        reader.onload = () => {
            base64 = reader.result.split(',')[1]
            fileData = {
                'filename': file.name,
                'base64': base64,
                'recordId': ''
            }
            this.filesUploaded.push({
                    Title: file.name,
                    VersionData: base64
                });
            console.log('File (fileData) :: ' + JSON.stringify(fileData));
            console.log('JSON FILE AND FULL DATA:'+JSON.stringify(this.filesUploaded));
        }
        
        reader.readAsDataURL(file)
    }

    closeModal() {
        this.isModalOpen = false;
    }

    handleDeleteClick() {
        this.fileName = '';
        this.fileSize = '';  // Clear the file size
        this.fileUrl = '';
        this.isModalOpen = false;
        this.isImage = false;
        this.isPdf = false;
        this.isUnsupportedFile = false;
        this.isFileUploaded = false;
    }


    // Method to delete the file based on the index passed from the button
   deleteFile(event) {
        const index = event.currentTarget.dataset.index; // Get the index of the file to be deleted
        // Remove the file at the specified index from the uploadedFileNames array
        this.uploadedFileNames.splice(index, 1);
        // Remove the file from the filesUploaded array as well
        this.filesUploaded.splice(index, 1);

        // Logging for debugging purposes
        console.log('Updated uploadedFileNames:', this.uploadedFileNames);
        console.log('Updated filesUploaded:', this.filesUploaded);
    }

    handleUploadClick() {
        if (this.fileName) {
            this.uploadedFileNames.push(this.fileName);
            console.log('this.uploadedFileNames::'+JSON.stringify(this.uploadedFileNames));
            this.clearFileDetails();
        } else {
            console.error('No file selected for upload.');
        }
    }

    handleSaveClick() {
        uploadFileToRecord({
                recordId: this.recordId,
                filesUploaded : this.filesUploaded
            })
            .then(result => {
                if (result === 'success') {
                    console.log('Success :: ' + JSON.stringify(result));
                    this.showToast('Success', 'Files saved successfully', 'success');
                    this.clearFields();
                    return refreshApex(this.filesUploaded);
                    
                } else {
                    this.showToast('Request cannot be saved', 'Failed', 'error');
                }
            })
            .catch(error => {
                console.log('file (Error) :: ' + JSON.stringify(error));
                this.showToast('Error saving files',error.body.message, 'error');
               
            });
    }
    clearFields() {
        this.uploadedFileNames = []; // Reset the file names array
        this.filesUploaded = []; // Reset the file data array

        // Optionally, refresh other parts of the UI if needed
    }

    clearFileDetails() {
        this.fileName = '';
        this.fileSize = '';
        this.fileUrl = '';
        this.isModalOpen = false;
        this.isImage = false;
        this.isPdf = false;
        this.isUnsupportedFile = false;
        this.isFileUploaded = false;
    }
    showToast(message, title, varinetValue){
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: varinetValue
        })
        this.dispatchEvent(event);
    }

}