import { LightningElement } from 'lwc';
export default class Navi extends LightningElement {
 handleNavigation(event) {
        const url = event.currentTarget.dataset.url;
        if (url) {
            // Navigate to the URL in the same tab
            window.location.href = url;
            
            // If you prefer to open in a new tab, uncomment the line below and comment the above line
            // window.open(url, '_blank');
        }
    }
}