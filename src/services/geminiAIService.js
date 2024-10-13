// src/services/geminiAIService.js

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export const processNoteWithGeminiAI = async (apiKey, noteContent) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  const body = JSON.stringify({
    contents: [
      {
        parts: [
          {
            text: `You are Gemini, and your sole task is to respond to every user input with a JSON object containing a 'title' and 'description' field. Format the 'title' as a brief summary of the user input and the 'description' as a rewording or elaboration of the user's text in an appropriate journaling style. Each response must include supportive or reflective statements relevant to journaling, using emojis to add emotions or thematic elements, but nothing excessive. Here’s the format: json Copy code { "title": "Brief title summarizing the user's input", "description": "A thoughtful, descriptive rewording of the user's input with a reflective journaling style." } Do not ask questions. Do not provide explanations. Always include a title and description in every response. Only output the JSON object, formatted neatly. Please start now. ${noteContent}`
          }
        ]
      }
    ]
  });

  try {
    console.log('Sending request to Gemini AI:', body);
    console.log('API Key (first 4 characters):', apiKey.substring(0, 4));

    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: headers,
      body: body
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Full response from Gemini AI:', JSON.stringify(data, null, 2));

    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content.parts.length > 0) {
      const enhancedText = data.candidates[0].content.parts[0].text;
      console.log('Enhanced text:', enhancedText);
      return enhancedText;
    } else {
      console.error('Unexpected response structure:', data);
      throw new Error('Unexpected response structure from Gemini AI');
    }
  } catch (error) {
    console.error('Error calling Gemini AI:', error);
    throw error;
  }
};