// Simple test script to verify the API integration
// Run this with: node test-api.js

const testApiCall = async () => {
  const testPayload = {
    message: "what is a good crop to grow in this season",
    languageCode: "en", 
    latitude: 28.6139,
    longitude: 77.2090
  };

  console.log('Testing API call to http://localhost:8080/api/chatbot');
  console.log('Payload:', JSON.stringify(testPayload, null, 2));

  try {
    const response = await fetch('http://localhost:8080/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    console.log('\nResponse status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('\nSuccess! Response data:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('\nError:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n🔴 This might be because:');
      console.log('1. The API server is not running on localhost:8080');
      console.log('2. CORS issues (if testing from browser)');
      console.log('3. Network connectivity issues');
      console.log('\n💡 Make sure your API server is running and accessible at http://localhost:8080');
    }
  }
};

// Run the test
testApiCall();
