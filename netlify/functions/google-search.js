// netlify/functions/google-search.js
// 
// This function handles Google Custom Search API requests.
// It expects a query parameter 'q' for the search term.
//
// Make sure to set the environment variables GOOGLE_API_KEY and GOOGLE_CX in your Netlify settings.
// You can use this function in your Netlify site to perform Google searches.
// The function returns the search results in JSON format.
//
// Environment Variables:
// - GOOGLE_API_KEY: Your Google API key for Custom Search
// - GOOGLE_CX: Your Custom Search Engine ID (CX)
// Register your API keys in the Netlify dashboard under Site settings > Build & deploy > Environment > Environment variables.
//
// Requirements
// - Node.js environment
// - 'node-fetch' package for making HTTP requests


exports.handler = async function(event) {
  // --- Environment Variables ---
  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;

  // --- Get Search Query and Start Index ---
  const query = event.queryStringParameters.q;
  const start = event.queryStringParameters.start || '1';

  // --- Validate Input ---
  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Search query is required.' }),
    };
  }

  if (!apiKey || !cx) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key or CX is not configured on the server.' }),
    };
  }

  // --- Construct API URL with start parameter ---
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&start=${start}`;
  
  // --- DIAGNOSTIC LOGGING (Commented Out) ---
  // console.log(`[google-search function] Fetching URL: ${url}`);

  try {
    // --- Fetch Search Results ---
    const fetch = (await import('node-fetch')).default;
    const searchResponse = await fetch(url);
    const searchData = await searchResponse.json();

    // --- Return Results ---
    return {
      statusCode: 200,
      body: JSON.stringify(searchData),
    };
  } catch (error) {
    // --- Handle Errors ---
    console.error('[google-search function] Error fetching search results:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch search results.' }),
    };
  }
};
