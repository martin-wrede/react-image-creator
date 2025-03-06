export async function onRequest({ request, env }) {
  console.log("Received request:", request.method);

  // Handle OPTIONS preflight for CORS
  if (request.method === "OPTIONS") {
    console.log("Handling OPTIONS request for CORS");
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // Accept only POST requests
  if (request.method !== "POST") {
    console.log("Method not allowed:", request.method);
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { prompt } = await request.json();
    if (!prompt) {
      console.log("Missing 'prompt' field in request body");
      return new Response(
        JSON.stringify({ error: "Missing 'prompt' field" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Call the OpenAI API for image generation
    const apiResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      }),
    });

    const data = await apiResponse.json();
    console.log("OpenAI API response:", data);

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
}