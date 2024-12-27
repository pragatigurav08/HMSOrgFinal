import { LightningElement,track,api,wire } from 'lwc';

export default class ProgressStepComponent extends LightningElement {
    @track one;
    @track two;
    @track three;
    @track four;
    @track five;

    connectedCallback(){
        console.log('Connected Callback Called --->')
       // this.classDeclaration();
    }

    classDeclaration(){
        this.one = this.template.querySelector(".one");
        console.log("🚀 ~ file: progressStepComponent.js:16 ~ this.one:", this.one);
        this.two = this.template.querySelector(".two");
        console.log("🚀 ~ file: progressStepComponent.js:18 ~ this.two:", this.two);
        this.three = this.template.querySelector(".three");
        console.log("🚀 ~ file: progressStepComponent.js:20 ~ this.three:", this.three);
        this.four = this.template.querySelector(".four");
        console.log("🚀 ~ file: progressStepComponent.js:22 ~ this.four:", this.four);
        this.five = this.template.querySelector(".five");
        console.log("🚀 ~ file: progressStepComponent.js:24 ~ this.five:", this.five);
    }

    /*activeProgressLogic(event){
        let dataName = event.target.dataset.name;
        console.log("🚀 ~ file: progressStepComponent.js:30 ~ dataName:", dataName);
        switch(dataName) {
            case 'one':
                console.log("🚀 ~ file: progressStepComponent.js:30 ~ dataName:", dataName);
                this.oneFxn();
                break;
            case 'two':
                console.log("🚀 ~ file: progressStepComponent.js:30 ~ dataName:", dataName);
                this.twoFxn();
                break;
            case 'three':
                console.log("🚀 ~ file: progressStepComponent.js:30 ~ dataName:", dataName);
                this.threeFxn();
                break;            
            case 'four':
                console.log("🚀 ~ file: progressStepComponent.js:30 ~ dataName:", dataName);
                this.fourFxn();
                break;            
            case 'five':
                console.log("🚀 ~ file: progressStepComponent.js:30 ~ dataName:", dataName);
                this.fiveFxn();
                break;
            default:
                break;
        }

    }*/
    
    oneFxn(){
        this.one.classList.add("active");
        this.two.classList.remove("active");
        this.three.classList.remove("active");
        this.four.classList.remove("active");
        this.five.classList.remove("active");
    }

    twoFxn(){
        this.one.classList.add("active");
        this.two.classList.add("active");
        this.three.classList.remove("active");
        this.four.classList.remove("active");
        this.five.classList.remove("active");
    }

    threeFxn(){
        this.one.classList.add("active");
        this.two.classList.add("active");
        this.three.classList.add("active");
        this.four.classList.remove("active");
        this.five.classList.remove("active");
    }

    fourFxn(){
        this.one.classList.add("active");
        this.two.classList.add("active");
        this.three.classList.add("active");
        this.four.classList.add("active");
        this.five.classList.remove("active");
    }

    fiveFxn(){
        this.one.classList.add("active");
        this.two.classList.add("active");
        this.three.classList.add("active");
        this.four.classList.add("active");
        this.five.classList.add("active");
    }
}