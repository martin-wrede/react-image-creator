import { useState } from "react";
import "./App.css";

// const OPENAI_API_KEY = VITE_OPENAI_API_KEY; // import.meta.env.VITE_OPENAI_API_KEY;

function App() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt) {
      alert("Please enter a prompt!");
      return;
    }

    setLoading(true);
    setImageUrl(null);

    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPEN_AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "dall-e-3", // You can also try "dall-e-2" if needed
          prompt: prompt,
          n: 1,
          size: "1024x1024",
        }),
      });

      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setImageUrl(data.data[0].url);
      } else {
        alert("Failed to generate image!");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>DALL·E Image Generator</h1>
      <input
        type="text"
        placeholder="Enter your prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ padding: "10px", width: "60%", marginRight: "10px" }}
      />
      <button onClick={generateImage} style={{ padding: "10px 15px", cursor: "pointer" }}>
        Generate
      </button>
      {loading && <p>Generating image...</p>}
      {imageUrl && <img src={imageUrl} alt="Generated" style={{ marginTop: "20px", maxWidth: "100%", borderRadius: "8px" }} />}
    </div>
  );
}

export default App;

