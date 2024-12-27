import { api, LightningElement } from 'lwc';
import getVisits from '@salesforce/apex/VisitsProgressBarController.getVisits';
import radicaljs from "@salesforce/resourceUrl/radicalbar";
import apexchartjs from "@salesforce/resourceUrl/apexchart";
import { loadScript } from "lightning/platformResourceLoader";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import FORM_FACTOR from '@salesforce/client/formFactor';
import DesktopView from './visitsProgressBar.html';
import MobileView from './visitsProgressBarMobile.html';
export default class VisitsProgressBar extends LightningElement {
@api recordId;
load=false;
totalVisits;
completedVisits;
completedVisitswidth;
render(){
    return FORM_FACTOR==='Large' ? DesktopView : MobileView;
}
connectedCallback() {
    Promise.all([
      loadScript(this, radicaljs),
      loadScript(this, apexchartjs + '/apexcharts.js'),
    ])
      .then(() => {
        this.loadChartsData();
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error loading ChartJS",
            message: error,
            variant: "error"
          })
        );
      });
  
}
loadChartsData(){
    this.load=true;
    getVisits({recordId:this.recordId})
    .then(result=>{
        console.log('getVisitsFunc result::',result);
        this.totalVisits = result.totalVisits;
        this.completedVisits = result.completedVisits;
        console.log('totalVisits::',this.totalVisits);
        console.log('completedVisits::',this.completedVisits);
  
        this.loadVisitWidth();
        this.load=false;
    })
    .catch(error=>{
        console.log('error:::'+JSON.stringify(error));
        this.load=false;
    });
}
loadVisitWidth(){
    try{
        this.completedVisitswidth= Math.round((this.completedVisits/this.totalVisits)* 100);
        console.log('completedVisitswidth::',this.completedVisitswidth);
        const progress1 = this.template.querySelector(".progress-done1");
        progress1.style.width = this.completedVisitswidth+ "%";//progress1.getAttribute("data-done") 
        progress1.style.opacity = 1;    
    }
    catch(error){
        console.log('error:::'+JSON.stringify(error));
    };
}

}