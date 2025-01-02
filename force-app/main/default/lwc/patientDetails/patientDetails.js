import { LightningElement, wire, track, api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getAppointments from '@salesforce/apex/ReceptionistDashboard.getUpAppointments';

export default class PatientDetails extends LightningElement {
    @api recordId; // Patient's record ID
    @track calendarDays = [];
    @track appointments = [];
    @track selectedDate;
    @track currentMonth;
    @track error;

    @wire(CurrentPageReference)
    getPageReference(pageRef) {
        if (pageRef && pageRef.attributes) {
            this.recordId = pageRef.attributes.recordId;
            console.log('Record ID from page reference:', this.recordId);
        }
    }

    connectedCallback() {
        console.log('Connected Callback: Initializing calendar');
        this.initializeCalendar(new Date());
    }

    renderedCallback() {
        console.log('Rendered Callback: Updating day classes');
        this.updateDayClasses();
    }

    initializeCalendar(date) {
        console.log('Initializing calendar for date:', date);
        this.currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        this.updateCalendarDays();
    }

    // updateCalendarDays() {
    //     console.log('Updating calendar days for current month:', this.currentMonth);
    //     const days = [];
    //     const monthStart = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    //     const monthEnd = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);

    //     for (let day = new Date(monthStart); day <= monthEnd; day.setDate(day.getDate() + 1)) {
    //         days.push({ 
    //             date: day.toISOString().split('T')[0], 
    //             dateLabel: day.getDate() 
    //         });
    //     }

    //     this.calendarDays = days;
    //     console.log('Calendar days updated:', this.calendarDays);
    // }


    updateCalendarDays() {
        console.log('Updating calendar days for current month:', this.currentMonth);
        const days = [];
        const monthStart = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
        const monthEnd = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    
        for (let day = new Date(monthStart); day <= monthEnd; day.setDate(day.getDate() + 1)) {
            // Use local date format instead of UTC to avoid time zone issues
            const formattedDate = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
            days.push({ 
                date: formattedDate, 
                dateLabel: day.getDate() 
            });
        }
    
        this.calendarDays = days;
        console.log('Calendar days updated:', this.calendarDays);
    }
    

    handlePreviousMonth() {
        console.log('Navigating to the previous month');
        this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
        this.updateCalendarDays();
    }

    handleNextMonth() {
        console.log('Navigating to the next month');
        this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
        this.updateCalendarDays();
    }

    handleDateClick(event) {
        const clickedDate = event.currentTarget.dataset.date;
        console.log('Date clicked:', clickedDate);
        this.selectedDate = clickedDate;
        this.fetchAppointments(clickedDate);
    }

   
    
    fetchAppointments(date) {
        if (!this.recordId) {
            console.error("Patient ID is not available.");
            return;
        }
    
        console.log('Fetching appointments for date:', date, 'and patient ID:', this.recordId);
    
        getAppointments({ patientId: this.recordId, selectedDate: date })
            .then((result) => {
                console.log('Appointments fetched successfully:', result);
    
                // Map the result to add formatted start and end times
                this.appointments = result.map(appointment => ({
                    ...appointment,
                    formattedStartTime: this.formatTime(appointment.Start_Time__c),
                    formattedEndTime: this.formatTime(appointment.End_Time__c),
                }));
    
                console.log('Formatted Appointments:', this.appointments);
                this.error = undefined;
            })
            .catch((error) => {
                console.error('Error fetching appointments:', error);
                this.appointments = [];
                this.error = error;
            });
    }
    

    formatTime(milliseconds) {
        const date = new Date(milliseconds);
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert to 12-hour format
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }
    updateDayClasses() {
        const days = this.template.querySelectorAll('.calendar-day');
        days.forEach((dayElement) => {
            const dayDate = dayElement.dataset.date;
            if (dayDate === this.selectedDate) {
                dayElement.classList.add('selected-day');
            } else {
                dayElement.classList.remove('selected-day');
            }
        });
    }

    get formattedMonth() {
        return this.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    get hasAppointments() {
        return this.appointments && this.appointments.length > 0;
    }
}