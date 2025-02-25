// functions/ai.js
export async function onRequest({ request, env }) {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*", // Adjust as needed
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  
  // Only allow POST requests
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // Parse JSON from the POST request
    const { prompt } = await request.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing 'prompt' field" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Call OpenAI Image Generation API
    const apiResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: "1024x1024",
      }),
    });

    // Parse the JSON response from OpenAI
    const data = await apiResponse.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
