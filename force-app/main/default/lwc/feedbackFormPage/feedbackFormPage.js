/**
 * @description       : 
 * @author            : Saurav Kashyap
 * @group             : SK Group
 * @last modified on  : 17-08-2023
 * @last modified by  : Saurav Kashyap
 * Modifications Log
 * Ver   Date         Author           Modification
 * 1.0   16-08-2023   Saurav Kashyap   Initial Version
**/
import { LightningElement, track } from 'lwc';
// import submitFeedback from '@salesforce/apex/FeedbackController.submitFeedback';

export default class FeedbackFormPage extends LightningElement {
    @track name = '';
    @track email = '';
    @track rating = '';
    @track performanceRating = '';
    @track comfortRating = '';
    @track rangeRating = '';
    @track designRating = '';
    @track informationRating = '';
    @track bookingConvenienceRating = '';
    @track customerServiceRating = '';
    @track standoutFeatures = '';
    @track improvementSuggestions = '';
    @track considerPurchase = '';
    @track recommendationLikelihood = '';

    @track feedbackSubmitted = false;
    @track feedbackError = '';

    // Define options and values for combobox questions
    satisfactionOptions = [
        { label: 'Very Satisfied', value: 'Very Satisfied' },
        { label: 'Satisfied', value: 'Satisfied' },
        { label: 'Neutral', value: 'Neutral' },
        { label: 'Unsatisfied', value: 'Unsatisfied' },
        { label: 'Very Unsatisfied', value: 'Very Unsatisfied' }
    ];

    performanceOptions = [
        { label: 'Excellent', value: 'Excellent' },
        { label: 'Good', value: 'Good' },
        { label: 'Average', value: 'Average' },
        { label: 'Below Average', value: 'Below Average' },
        { label: 'Poor', value: 'Poor' }
    ];

    rangeOptions = [
        { label: 'Extremely Satisfied', value: 'Extremely Satisfied' },
        { label: 'Satisfied', value: 'Satisfied' },
        { label: 'Neutral', value: 'Neutral' },
        { label: 'Unsatisfied', value: 'Unsatisfied' },
        { label: 'Extremely Unsatisfied', value: 'Extremely Unsatisfied' }
    ];

    comfortOptions = [
        { label: 'Exceeded Expectations', value: 'Exceeded Expectations' },
        { label: 'Met Expectations', value: 'Met Expectations' },
        { label: 'Somewhat Met Expectations', value: 'Somewhat Met Expectations' },
        { label: 'Did Not Meet Expectations', value: 'Did Not Meet Expectations' },
        { label: 'Fell Far Below Expectations', value: 'Fell Far Below Expectations' }
    ];

    designOptions = [
        { label: 'Loved It', value: 'Loved It' },
        { label: 'Liked It', value: 'Liked It' },
        { label: 'Neutral', value: 'Neutral' },
        { label: 'Didn\'t Like It', value: 'Didn\'t Like It' },
        { label: 'Disliked It', value: 'Disliked It' }
    ];

    informationOptions = [
        { label: 'Yes, very informed', value: 'Yes, very informed' },
        { label: 'Somewhat informed', value: 'Somewhat informed' },
        { label: 'Not well informed', value: 'Not well informed' },
        { label: 'No information provided', value: 'No information provided' }
    ];

    bookingConvenienceOptions = [
        { label: 'Extremely Convenient', value: 'Extremely Convenient' },
        { label: 'Convenient', value: 'Convenient' },
        { label: 'Neutral', value: 'Neutral' },
        { label: 'Inconvenient', value: 'Inconvenient' },
        { label: 'Extremely Inconvenient', value: 'Extremely Inconvenient' }
    ];

    customerServiceOptions = [
        { label: 'Exceptional', value: 'Exceptional' },
        { label: 'Good', value: 'Good' },
        { label: 'Average', value: 'Average' },
        { label: 'Below Average', value: 'Below Average' },
        { label: 'Poor', value: 'Poor' }
    ];
/**start */
    standoutOptions = [
        { label: 'Very Satisfied', value: 'Very Satisfied' },
        { label: 'Satisfied', value: 'Satisfied' },
        { label: 'Neutral', value: 'Neutral' },
        { label: 'Unsatisfied', value: 'Unsatisfied' },
        { label: 'Very Unsatisfied', value: 'Very Unsatisfied' }
    ];

    improvementOptions = [
        { label: 'Excellent', value: 'Excellent' },
        { label: 'Good', value: 'Good' },
        { label: 'Average', value: 'Average' },
        { label: 'Below Average', value: 'Below Average' },
        { label: 'Poor', value: 'Poor' }
    ];

    /**end */

    considerPurchaseOptions = [
        { label: 'Definitely Yes', value: 'Definitely Yes' },
        { label: 'Likely Yes', value: 'Likely Yes' },
        { label: 'Unsure', value: 'Unsure' },
        { label: 'Unlikely', value: 'Unlikely' },
        { label: 'Definitely No', value: 'Definitely No' }
    ];

    recommendationLikeOptions = [
        { label: 'Very Likely', value: 'Very Likely' },
        { label: 'Likely', value: 'Likely' },
        { label: 'Neutral', value: 'Neutral' },
        { label: 'Unlikely', value: 'Unlikely' },
        { label: 'Very Unlikely', value: 'Very Unlikely' }
    ];

    handleNameChange(event) {
        this.name = event.target.value;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    handleRatingChange(event) {
        this.rating = event.target.value;
    }

    handlePerformanceRatingChange(event) {
        this.performanceRating = event.target.value;
    }

    handleComfortRatingChange(event) {
        this.comfortRating = event.target.value;
    }

    handleRangeRatingChange(event) {
        this.rangeRating = event.target.value;
    }

    handleDesignRatingChange(event) {
        this.designRating = event.target.value;
    }

    handleInformationRatingChange(event) {
        this.informationRating = event.target.value;
    }

    handleBookingConvenienceRatingChange(event) {
        this.bookingConvenienceRating = event.target.value;
    }

    handleCustomerServiceRatingChange(event) {
        this.customerServiceRating = event.target.value;
    }

    handleStandoutFeaturesChange(event) {
        this.standoutFeatures = event.target.value;
    }

    handleImprovementSuggestionsChange(event) {
        this.improvementSuggestions = event.target.value;
    }

    handleConsiderPurchaseChange(event) {
        this.considerPurchase = event.target.value;
    }

    handleRecommendationLikelihoodChange(event) {
        this.recommendationLikelihood = event.target.value;
    }

    handleSubmit() {
        this.feedbackSubmitted = false;
        this.feedbackError = '';

        if (
            this.name &&
            this.email &&
            this.rating &&
            this.performanceRating &&
            this.comfortRating &&
            this.rangeRating &&
            this.designRating &&
            this.informationRating &&
            this.bookingConvenienceRating &&
            this.customerServiceRating &&
            this.improvementSuggestions &&
            this.considerPurchase &&
            this.recommendationLikelihood
        ) {
            const feedbackData = {
                name: this.name,
                email: this.email,
                rating: this.rating,
                performanceRating: this.performanceRating,
                comfortRating: this.comfortRating,
                rangeRating: this.rangeRating,
                designRating: this.designRating,
                informationRating: this.informationRating,
                bookingConvenienceRating: this.bookingConvenienceRating,
                customerServiceRating: this.customerServiceRating,
                standoutFeatures: this.standoutFeatures,
                improvementSuggestions: this.improvementSuggestions,
                considerPurchase: this.considerPurchase,
                recommendationLikelihood: this.recommendationLikelihood
            };

            // submitFeedback({ feedbackData })
            //     .then(result => {
            //         this.feedbackSubmitted = true;
            //     })
            //     .catch(error => {
            //         this.feedbackError = 'An error occurred while submitting feedback.';
            //     });
        } else {
            this.feedbackError = 'Please fill in all required fields.';
        }
    }
}