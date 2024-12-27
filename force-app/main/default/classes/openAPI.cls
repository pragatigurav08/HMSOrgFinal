public with sharing class openAPI {
    @AuraEnabled(cacheable=true)
    public static List<String> getAIPredictions(Map<String, Object> userData) {
        List<String> suggestions = new List<String>();
        
        // Fetch the API key from the custom metadata
        API_Settings__mdt apiSettings = API_Settings__mdt.getInstance('OpenAI_API'); // Use the correct record name here
        String apiKey = apiSettings.OpenAI_API_Key__c; // Access the API key
        
        // Prepare the HTTP request to call the ChatGPT API
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://api.openai.com/v1/chat/completions'); // ChatGPT API endpoint
        req.setMethod('POST');
        
        // Set the required headers
        req.setHeader('Content-Type', 'application/json');
        req.setHeader('Authorization', 'Bearer ' + apiKey); // Use the retrieved API key
        
        // Construct the body of the request
        Map<String, Object> requestBody = new Map<String, Object>();
        requestBody.put('model', 'gpt-3.5-turbo'); // Specify the model
        requestBody.put('messages', new List<Map<String, String>>{
            new Map<String, String>{
                'role' => 'user', 
                'content' => 'Provide suggestions based on this user data: ' + JSON.serialize(userData)
            }
        });

        req.setBody(JSON.serialize(requestBody));

        // Make the HTTP callout
        Http http = new Http();
        HttpResponse res = http.send(req);

        // Check the response status
        if (res.getStatusCode() == 200) {
            // Parse the response
			System.debug('AI response: ' + res.getBody());
            Map<String, Object> responseBody = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get('choices');

            // Extract suggestions from the response
            for (Map<String, Object> choice : choices) {
                // Make sure to cast correctly
                Map<String, Object> message = (Map<String, Object>) choice.get('message');
                suggestions.add((String) message.get('content')); // Access 'content' from the 'message' map
            }
        } else {
            // Handle error response
            System.debug('Error response from AI service: ' + res.getBody());
        }

        return suggestions;
    }
}