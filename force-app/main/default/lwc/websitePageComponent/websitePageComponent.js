/**
 * @description       : 
 * @author            : Saurav Kashyap
 * @group             : SK Group
 * @last modified on  : 17-08-2023
 * @last modified by  : Saurav Kashyap
 * Modifications Log
 * Ver   Date         Author           Modification
 * 1.0   11-08-2023   Saurav Kashyap   Initial Version
**/
import { LightningElement, track } from 'lwc';

export default class WebsitePageComponent extends LightningElement {
    @track leftPanel = true;

    handleLeftSignIn(event) {
        let inputVariable = event.target.value;
        console.log("<<<  : : :  : : :  >>>  handleLeftSignIn : : :  >>>  inputVariable:", inputVariable);
        let leftPanel = this.template.querySelector('.left-panel');
        console.log("<<<  : : :  : : :  >>>  handleLeftSignIn : : :  >>>  leftPanel:", leftPanel);
        let rightPanel = this.template.querySelector('.right-panel');
        console.log("<<<  : : :  : : :  >>>  handleLeftSignIn : : :  >>>  rightPanel:", rightPanel);

        if (leftPanel) {
            this.leftPanel = false;
            console.log("<<<  : : :  : : :  >>>  handleLeftSignIn : : :  >>>  this.leftPanel:", this.leftPanel);
            leftPanel.style.transition = 'transform 0.8s';
            leftPanel.style.transform = 'translateX(100%)';
        }
        if (rightPanel) {
            rightPanel.style.transition = 'transform 0.8s';
            rightPanel.style.transform = 'translateX(-100%)';
        }
    }

    handleRightSignIn(event) {
        let inputVariable = event.target.value;
        console.log("<<<  : : :  : : :  >>>  handleLeftSignIn : : :  >>>  inputVariable:", inputVariable);
        let leftPanel = this.template.querySelector('.left-panel');
        console.log("<<<  : : :  : : :  >>>  handleLeftSignIn : : :  >>>  leftPanel:", leftPanel);
        let rightPanel = this.template.querySelector('.right-panel');
        console.log("<<<  : : :  : : :  >>>  handleLeftSignIn : : :  >>>  rightPanel:", rightPanel);

        if (leftPanel) {
            this.leftPanel = true;
            console.log("<<<  : : :  : : :  >>>  handleLeftSignIn : : :  >>>   this.leftPanel:", this.leftPanel);
            leftPanel.style.transition = 'transform 0.8s';
            leftPanel.style.transform = 'translateX(-0%)';
        }
        if (rightPanel) {
            rightPanel.style.transition = 'transform 0.8s';
            rightPanel.style.transform = 'translateX(0%)';
        }
    }

    handleUserSignIn(event) {
        //get user Sign In Details
    }
    handleUserSignUp(event) {
        //get user Sign Up Details
    }
}