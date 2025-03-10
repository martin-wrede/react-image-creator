import React, { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);

  const generateImage = async () => {
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  return (
    <div>
      <h1>Generate an Image with NEW AI</h1>
      <input
        type="text"
        placeholder="Enter your prompt"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      />
      <button onClick={generateImage}>Generate</button>
      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}

export default App;
