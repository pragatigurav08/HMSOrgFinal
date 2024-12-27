import { LightningElement,track } from 'lwc';
import getUserDetails from '@salesforce/apex/HomepageController.getUserCount';
import logo from '@salesforce/resourceUrl/manageravatar';
export default class popover extends LightningElement {
    @track isExpanded = true; 
    @track userCount = 0; 
    @track loggedInUserName = ''; 
    @track userTitle = ''; 
    @track EmployeeID='123';
    @track UName='';
    @track error;
    logoUrl = logo;
    
    renderedCallback(){
        console.log('renderedcallback>>>>of fetchuserdetils');
        this.fetchUserDetails();
    }

   
    handleTogglePanel() {
         
        const popoverCard = this.template.querySelector('[data-id="popoverCards"]');
        const topleftt = this.template.querySelector('[data-id="topleft"]');
        if (popoverCard) {
             console.log('popoverCard>>>');
           this.isExpanded = !this.isExpanded;
            popoverCard.style.width = this.isExpanded ? '23%' : '3%';
            if(topleftt){
                console.log('topleft');
                 topleftt.style.top = this.isExpanded ? '63px' : '50px';
                 topleftt.style.left = this.isExpanded ? '6px' : '14px';
            }else{
                console.error('topleft element not found.');
            }
        } else {
            console.error('Popover card element not found.');
        }
    }

    // Fetch user details from the Apex controller
    fetchUserDetails() {
        getUserDetails()
            .then((result) => {
                this.loggedInUserName = result.loggedInUserName;
                this.userCount = result.userCount;
                // Set title based on profile
                this.userTitle = result.isBankManager ? 'BankManager' : 'Employee';
                this.UName=result.UserName;
               this.EmployeeID=result.EmpID;
                
            })
            .catch((error) => {
                this.error = error;
                console.error('Error fetching user details:', error);
            });
    }
    
      showmorebutton() {
        // Dispatch the custom event
        const showMoreEvent = new CustomEvent('showmore', {
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(showMoreEvent);
    }
}



//  handleOpenRightPanel() {
//     console.log('handleOpenRightPanel>>>>>>>>>>>');
//         // Open the popover panel with animation
//         const popoverCard = this.template.querySelector('[data-id="popoverCards"]');

//         if (popoverCard) {
//             popoverCard.style.transform = 'translateX(0%)';
//             popoverCard.style.width = '21%';
//         } else {
//             console.error('Popover card element not found.');
//         }
//     }

//     handleClosePopover() {
//         // Close the popover panel with animation
//         const popoverCard = this.template.querySelector('[data-id="popoverCards"]');

//         if (popoverCard) {
//             popoverCard.style.transform = 'translateX(-100%)'; // Slide out of view
//             popoverCard.style.width = '0%';
//         } else {
//             console.error('Popover card element not found.');
//         }
//     }

//     handleFilterApply() {
//         alert('Filter Applied');
//     }


// import { LightningElement,track } from 'lwc';
// export default class Popover extends LightningElement {
//  @track isPopoverOpen = false;

//     handlePopover() {
//         this.isPopoverOpen = true;
//     }

//     handleClosePopover() {
//         this.isPopoverOpen = false;
//     }
// }