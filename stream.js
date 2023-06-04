const openai_token = "<TU_TOKEN_DE_OPENAI>";
const textContainer = document.getElementById('text-container');

// Function to handle new text received from the stream
function handleNewText(text) {
  textContainer.innerHTML += text; // + '<br>';
}

// Function to fetch the streamed text from the OpenAI API
async function pepe() {
  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openai_token}`, // Replace with your OpenAI API key
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: 'Generar un cuento corto para niños',
      max_tokens: 1500, // Adjust as needed
      temperature: 0.7, // Adjust as needed
      top_p: 1,
      n: 1,
      stream: true,
    }),
  });

  const reader = response.body.getReader();
  let partialText = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        // Stream has ended
        break;
      }

      // Convert the received chunk (Uint8Array) to a string
      const chunk = new TextDecoder('utf-8').decode(value);

      if (chunk.includes('[DONE]')) {
        break;
      }

      const cleanedChunk = chunk.replace(/^data: /, '');

      // Check if the chunk is valid JSON
      let json;
      try {
        console.log(cleanedChunk);
        json = JSON.parse(cleanedChunk.slice(0,-2));
      } catch (error) {
        console.error(error + '-' + cleanedChunk);
        continue; // Skip processing this chunk and move to the next one
      }

      const pepe = json.choices[0].text;
      partialText += pepe;

      // Split the received text by newline character to handle each line separately
      const lines = partialText.split('\n');

      // Process each line except the last one (in case it's incomplete)
      for (let i = 0; i < lines.length - 1; i++) {
        handleNewText(lines[i]);
      }

      // Store the last incomplete line for the next chunk
      partialText = lines[lines.length - 1];
    }
  } catch (error) {
    console.error('Error reading streamed text:', error);
  }
}

pepe()

