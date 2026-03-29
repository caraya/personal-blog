import { Handler, HandlerEvent } from "@netlify/functions";

/**
 * Netlify Function: google-search
 * Path: netlify/functions/google-search.ts
 */
export const handler: Handler = async (event: HandlerEvent) => {
  // 1. Grab environment variables from Netlify settings
  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;

  // 2. Extract and validate query parameters
  const query = event.queryStringParameters?.q;
  const start = event.queryStringParameters?.start || '1';

  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Search query parameter "q" is required.' }),
    };
  }

  // Ensure keys are present before attempting the fetch
  if (!apiKey || !cx) {
    console.error('[google-search] Missing GOOGLE_API_KEY or GOOGLE_CX in environment.');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Search service is not properly configured on the server.' }),
    };
  }

  // 3. Construct the Google Custom Search JSON API URL
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&start=${start}`;

  try {
    // 4. Perform the fetch request
    // Note: Global fetch is available in Node.js 18+ on Netlify
    const response = await fetch(url);
    const searchData = await response.json() as any;

    // 5. Handle non-200 responses from Google (e.g., 403 Forbidden)
    if (!response.ok) {
      console.error('[google-search] Google API returned an error:', searchData.error);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: 'Google API Error',
          message: searchData.error?.message || 'Unknown error from Google',
          code: response.status
        }),
      };
    }

    // 6. Return successful search results
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        // Optional: Add CORS if you're calling this from a different subdomain
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(searchData),
    };

  } catch (error: any) {
    // 7. Handle network or runtime crashes
    console.error('[google-search] Runtime Exception:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message
      }),
    };
  }
};
