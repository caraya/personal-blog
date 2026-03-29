import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // --- Environment Variables ---
  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;

  // --- Get Search Query and Start Index ---
  const query = event.queryStringParameters?.q;
  const start = event.queryStringParameters?.start || '1';

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

  // --- Construct API URL ---
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&start=${start}`;

  try {
    // Using native fetch (available in Node 18+)
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google API responded with status: ${response.status}`);
    }

    const searchData = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchData),
    };
  } catch (error) {
    console.error('[google-search function] Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch search results.' }),
    };
  }
};
