const express = require('express');
const path = require('path');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Serve static files from the React build in production
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// TTS endpoint — streams neural speech audio back to the client
app.post('/api/tts', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text is required' });
  }

  try {
    const tts = new MsEdgeTTS();
    // en-GB-RyanNeural — British male, warm and storyteller-like
    await tts.setMetadata('en-GB-RyanNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    // Build SSML for a wise old storyteller
    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
             xmlns:mstts="http://www.w3.org/2001/mstts"
             xml:lang="en-GB">
        <voice name="en-GB-RyanNeural">
          <mstts:express-as style="sad">
            <prosody rate="-30%" pitch="-15%" volume="soft">
              ${escapeXml(text)}
            </prosody>
          </mstts:express-as>
        </voice>
      </speak>`;

    const { audioStream } = tts.rawToStream(ssml);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Transfer-Encoding', 'chunked');

    audioStream.on('data', (chunk) => {
      res.write(chunk);
    });

    audioStream.on('end', () => {
      res.end();
    });

    audioStream.on('error', (err) => {
      console.error('TTS stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'TTS generation failed' });
      } else {
        res.end();
      }
    });
  } catch (err) {
    console.error('TTS error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'TTS generation failed' });
    }
  }
});

// Serve React app for all other routes (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
