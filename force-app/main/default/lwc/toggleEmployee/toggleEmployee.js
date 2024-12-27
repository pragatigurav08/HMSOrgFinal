import { LightningElement,track,wire } from 'lwc';
import getCategorizedEmployees from '@salesforce/apex/EmployeeManagementController.getCategorizedEmployees';
import femalePic from '@salesforce/resourceUrl/femalePic';
import malePic from '@salesforce/resourceUrl/malePic';
import sunsIcon from '@salesforce/resourceUrl/sunsIcon';
import sunsetIcon from '@salesforce/resourceUrl/sunsetIcon';
import moonIcon from '@salesforce/resourceUrl/moonIcon';
import getEmployeesWithBirthdays from '@salesforce/apex/EmployeeManagementController.getEmployeesWithBirthdays';
import getEmployeeStatuses from '@salesforce/apex/EmployeeStatusController.getEmployeeStatuses';

export default class ToggleEmployee extends LightningElement {
 @track newEmployees = [];
    @track existingEmployees = [];
    @track error;
    femalePicUrl = femalePic;
    malePicUrl = malePic;
     @track greetingMessage = 'Good Morning'; // Default message
  @track iconUrl = ''; // Default icon
  @track formattedDate = ''; // Placeholder for date
  @track formattedTime = ''; // Placeholder for time
  

  connectedCallback() {
    this.updateGreeting(); // Set initial greeting when component loads
    this.startClock(); // Start the clock to update time dynamically
  }

  // Method to update greeting message, icon, and formatted date
  updateGreeting() {
    const now = new Date();
    const hour = now.getHours();

    // Determine greeting and icon based on time
    if (hour >= 6 && hour < 12) {
      this.greetingMessage = 'Good Morning';
      this.iconUrl = sunsIcon;
    } else if (hour >= 12 && hour < 16) {
      this.greetingMessage = 'Good Afternoon';
      this.iconUrl = sunsetIcon;
    } else {
      this.greetingMessage = 'Good Evening';
      this.iconUrl = moonIcon;
    }

    // Format date
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    this.formattedDate = now.toLocaleDateString('en-US', options);
  }

  // Method to update time dynamically every second
  startClock() {
    setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      this.formattedTime = `${hours}:${minutes}:${seconds}`;
    }, 1000);
  }

   @track thisYearHolidays = [
    { Id: '1', Name: 'Christmas', Date__c: '25 Dec 2024' },
    
  ];

  // Holidays for next year
  @track nextYearHolidays = [
    { Id: '2', Name: 'New Year\'s Day', Date__c: '1 Jan 2025' },
    { Id: '3', Name: 'Republic Day', Date__c: '26 Jan 2025' },
    { Id: '4', Name: 'Independence Day', Date__c: '15 Aug 2025' },
    { Id: '5', Name: 'Diwali', Date__c: '12 Nov 2025' }
  ];

    // Fetch categorized employees on component load
    @wire(getCategorizedEmployees)
    wiredEmployees({ data, error }) {
        if (data) {
            // Add image URL dynamically based on gender
            this.newEmployees = data.newEmployees.map(employee => ({
                ...employee,
                profilePic: employee.Gender__c === 'Male' ? this.malePicUrl : this.femalePicUrl
            }));

            this.existingEmployees = data.existingEmployees.map(employee => ({
                ...employee,
                profilePic: employee.Gender__c === 'Male' ? this.malePicUrl : this.femalePicUrl
            }));

            this.error = undefined;
        } else if (error) {
            this.error = error.body.message;
            this.newEmployees = [];
            this.existingEmployees = [];
        }
    }
      todaysBirthdays = [];

  @wire(getEmployeesWithBirthdays)
  wiredBirthdays({ error, data }) {
    if (data) {
      this.todaysBirthdays = data.filter((employee) => {
        const today = new Date();
        const dob = new Date(employee.Date_of_Birth__c);
        return dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate();
      });
    } else if (error) {
      console.error('Error fetching birthdays:', error);
    }
  }
  checkedInEmployees = [];
  onLeaveEmployees = [];

@wire(getEmployeeStatuses)
wiredEmplo({ error, data }) {
    if (data) {
        // Define the profile picture URLs
        const malePicUrl = '/resource/malePic'; // Replace with actual static resource path
        const femalePicUrl = '/resource/femalePic'; // Replace with actual static resource path

        // Filter and map employees with profile pictures
        this.checkedInEmployees = data
            .filter((emp) => emp.Status__c === 'Active')
            .map((employee) => ({
                ...employee,
                profilePic: employee.Gender__c === 'Male' ? malePicUrl : femalePicUrl,
            }));

        this.onLeaveEmployees = data
            .filter((emp) => emp.Status__c === 'On Leave')
            .map((employee) => ({
                ...employee,
                profilePic: employee.Gender__c === 'Male' ? malePicUrl : femalePicUrl,
            }));

        this.error = undefined;
    } else if (error) {
        console.error('Error fetching employees:', error);
        this.error = error;
    }

}
newEmployees = [];
existingEmployees = [];
thisYearHolidays = [];
nextYearHolidays = [];
todaysBirthdays = [];
checkedInEmployees = [];
onLeaveEmployees = [];

   @track openEmployee = false; // Tracks whether the Employee section is open

    // Getter for dynamic button text
    get toggleButtonText() {
        return this.openEmployee ? 'Hide Employee' : 'Show Employee';
    }

   
  get drawerClass() {
    return this.openEmployee ? 'side-panel-drawer is-open' : 'side-panel-drawer';
  }

  get overlayClass() {
    return this.openEmployee ? 'overlay is-visible' : 'overlay';
  }

  toggleEmployeeTemplate() {
    this.openEmployee = !this.openEmployee;
  }

}