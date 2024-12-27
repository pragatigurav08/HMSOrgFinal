import { LightningElement,api,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import { loadStyle } from 'lightning/platformResourceLoader';
//import fileSelectorStyle from '@salesforce/resourceUrl/fileSelectorStyle';

export default class LicenceUploadComponent extends LightningElement {

    @api recordId;
    @track showLoadingSpinner = false;
    @track importButtonDisable = true;
    @track spinnerOn = false;
    @track acceptedFormats = ['.xls', '.xlsx'];

    MAX_FILE_SIZE = 2000000; //Max file size 2.0 MB
    filename;
    finalData=[];

    connectedCallback() {
        Promise.all([
            //loadStyle(this, fileSelectorStyle)
        ]);
    }

    handleUploadFinished(event) {
        // Get the number of uploaded files
        const uploadedFiles = event.detail.files.length;
         if(uploadedFiles.length > 0) {  
                    this.filename = event.detail.files[0].name;
                    console.log(this.filename);
                        this.importButtonDisable = false;
                        this.ExcelToJSON(uploadedFiles[0])
                    } else{
                        this.filename = 'File Size is to long to process';
                        this.importButtonDisable = true;
                        //this.readFiles();
                    } 
        // Create and dispatch a ShowToastEvent event with title, message and variant
        const evt = new ShowToastEvent({
            title: 'SUCCESS',
            message: uploadedFiles + ' File(s) uploaded successfully',
            variant: 'success',
        });
        this.dispatchEvent(evt);  
       }

        cancel(){
        this.filename = null;
    }
    insertRecordsFunction(){
        this.spinnerOn = true;
        this.importButtonDisable = true;
        // console.log('finalData',this.finalData);
        // let temp = JSON.parse(this.finalData);
        // console.log('temp before-'+temp);
        // for(let i=0;i<temp.length;i++){
        //     console.log('this.finalData[i].Width_in_mm__c + ' + temp[i].Width_in_mm__c);
        //     temp[i].Width_in_mm__c = ''+temp[i].Width_in_mm__c;
        //     temp[i].Height__c = ''+temp[i].Height__c;
        //     temp[i].Description__c =  ''+temp[i].Description__c;
        //     temp[i].Location__c =  ''+temp[i].Location__c;
            
        // }
        // console.log('temp-'+JSON.stringify(temp));
        // console.log('recordId'+this.recordId);
        // insertquoteProducts({quoteProductList: JSON.stringify(temp), recordId : this.recordId})
        // .then(result => {
        //     console.log('Result :: '+result);
        //     this.spinnerOn = false;
        //      this.importButtonDisable = false;
        //     this.showToastMessage('Success','Imported Successfully','success');
        //     this.cancel();
        // })
        // .catch(error => {
        //     console.log('Error1:::' + JSON.stringify(error));
        //     console.log('Error2:::' ,error);
        //     this.showToastMessage('Error',error.body.fieldErrors,'error');
        // });
    }
}