import { LightningElement, wire, track } from 'lwc';
// import getCategorizedEmployees from '@salesforce/apex/EmployeeManagementController.getCategorizedEmployees';
import femalePic from '@salesforce/resourceUrl/femalePic';
import malePic from '@salesforce/resourceUrl/malePic';
import sunsIcon from '@salesforce/resourceUrl/sunsIcon';
import sunsetIcon from '@salesforce/resourceUrl/sunsetIcon';
import moonIcon from '@salesforce/resourceUrl/moonIcon';
import getUsers from '@salesforce/apex/UserController.getUsers';
import getEmployeeActivity from '@salesforce/apex/EmployeeActivityController.getEmployeeActivity';
import getUserLoginStatus from '@salesforce/apex/HomepageController.getUserLoginStatus';
// import getEmployeesWithBirthdays from '@salesforce/apex/EmployeeManagementController.getEmployeesWithBirthdays';
// import getEmployeeStatuses from '@salesforce/apex/EmployeeStatusController.getEmployeeStatuses';


export default class EmployeeManagement extends LightningElement {
    // @track newEmployees = [];
    // @track existingEmployees = [];
    // @track error;
    femalePicUrl = femalePic;
    malePicUrl = malePic;
     @track greetingMessage = 'Good Morning'; // Default message
  @track iconUrl = ''; // Default icon
  @track formattedDate = ''; // Placeholder for date
  @track formattedTime = ''; // Placeholder for time
  tickIcon = 'utility:error'; // Default red icon for inactive users
  iconClass = ''; // Default class, you can add this if needed



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

   @track newEmployees = [];
    @track existingEmployees = [];
    @track isLoading = true;

    connectedCallback() {
        this.fetchUsers();
        this.loadEmployeeActivity();
    }

    async fetchUsers() {
        try {
            const userData = await getUsers();
            this.newEmployees = userData.newUsers.map(user => ({
                Id: user.Id,
                Employee_Name__c: user.LastName,
                Date_of_Joining__c: new Date(user.CreatedDate).toLocaleDateString(),
                tickIcon: 'utility:error', // Default red icon
                iconClass: 'red-icon' // Default class
            }));

            this.existingEmployees = userData.existingUsers.map(user => ({
                Id: user.Id,
                Employee_Name__c: user.LastName,
                tickIcon: 'utility:error', // Default red icon
                iconClass: 'red-icon' // Default class
            }));

            await this.checkLoginStatusForUsers();

        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            this.isLoading = false;
        }
    }

     // Call Apex to check the login status for each user
     async checkLoginStatusForUsers() {
      try {
          const allUsers = [...this.newEmployees, ...this.existingEmployees];
          for (let user of allUsers) {
              const status = await getUserLoginStatus({ userId: user.Id });

              if (status === 'green') {
                  user.tickIcon = 'utility:success'; // Green icon
                  user.iconClass = 'green-icon'; // Green icon class
              } else if (status === 'yellow') {
                  user.tickIcon = 'utility:expired'; // Yellow icon
                  user.iconClass = 'yellow-icon'; // Yellow icon class
              } else {
                  user.tickIcon = 'utility:expired'; // Red icon
                  user.iconClass = 'red-icon'; // Red icon class
              }
          }
          this.newEmployees = [...this.newEmployees];  // Trigger a re-render (if needed)
          this.existingEmployees = [...this.existingEmployees];  // Trigger a re-render (if needed)
          
      } catch (error) {
          console.error('Error checking login status:', error);
      }
  }

     @track checkedInEmployees = [];
    @track onLeaveEmployees = [];
    @track isLoading = true;


 

    async loadEmployeeActivity() {
        try {
            const data = await getEmployeeActivity();
            this.checkedInEmployees = data.checkedInUsers.map(user => ({
                Id: user.Id,
                EmployeeName: user.LastName,
            }));
            this.onLeaveEmployees = data.onLeaveUsers.map(user => ({
                Id: user.Id,
                EmployeeName: user.LastName,
            }));
        } catch (error) {
            console.error('Error fetching employee activity:', error);
        } finally {
            this.isLoading = false;
        }
    }

//     // Fetch categorized employees on component load
//     @wire(getCategorizedEmployees)
//     wiredEmployees({ data, error }) {
//         if (data) {
//             // Add image URL dynamically based on gender
//             this.newEmployees = data.newEmployees.map(employee => ({
//                 ...employee,
//                 profilePic: employee.Gender__c === 'Male' ? this.malePicUrl : this.femalePicUrl
//             }));

//             this.existingEmployees = data.existingEmployees.map(employee => ({
//                 ...employee,
//                 profilePic: employee.Gender__c === 'Male' ? this.malePicUrl : this.femalePicUrl
//             }));

//             this.error = undefined;
//         } else if (error) {
//             this.error = error.body.message;
//             this.newEmployees = [];
//             this.existingEmployees = [];
//         }
//     }
//       todaysBirthdays = [];

//   @wire(getEmployeesWithBirthdays)
//   wiredBirthdays({ error, data }) {
//     if (data) {
//       this.todaysBirthdays = data.filter((employee) => {
//         const today = new Date();
//         const dob = new Date(employee.Date_of_Birth__c);
//         return dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate();
//       });
//     } else if (error) {
//       console.error('Error fetching birthdays:', error);
//     }
//   }
//   checkedInEmployees = [];
//   onLeaveEmployees = [];

// @wire(getEmployeeStatuses)
// wiredEmplo({ error, data }) {
//     if (data) {
//         // Define the profile picture URLs
//         const malePicUrl = '/resource/malePic'; // Replace with actual static resource path
//         const femalePicUrl = '/resource/femalePic'; // Replace with actual static resource path

//         // Filter and map employees with profile pictures
//         this.checkedInEmployees = data
//             .filter((emp) => emp.Status__c === 'Active')
//             .map((employee) => ({
//                 ...employee,
//                 profilePic: employee.Gender__c === 'Male' ? malePicUrl : femalePicUrl,
//             }));

//         this.onLeaveEmployees = data
//             .filter((emp) => emp.Status__c === 'On Leave')
//             .map((employee) => ({
//                 ...employee,
//                 profilePic: employee.Gender__c === 'Male' ? malePicUrl : femalePicUrl,
//             }));

//         this.error = undefined;
//     } else if (error) {
//         console.error('Error fetching employees:', error);
//         this.error = error;
//     }
// }


}