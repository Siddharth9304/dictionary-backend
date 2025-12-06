const express = require('express');
const router = express.Router();
const { GoogleGenAI, Type, Modality } = require('@google/genai');

// Initialize Gemini Client
const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Vocab Generation
router.post('/vocab', async (req, res) => {
  try {
    const { word } = req.body;
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide meaning, 3 synonyms, 3 antonyms, and one example sentence for the word: "${word}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meaning: { type: Type.STRING },
            synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
            antonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
            example: { type: Type.STRING },
          },
          required: ["meaning", "synonyms", "antonyms", "example"]
        }
      }
    });
    // The SDK returns text, parsing handled here or frontend. Let's return the object.
    const text = response.text;
    res.json(JSON.parse(text));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Idiom Generation
router.post('/idiom', async (req, res) => {
  try {
    const { phrase } = req.body;
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide the meaning and a usage example for the idiom: "${phrase}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meaning: { type: Type.STRING },
            example: { type: Type.STRING },
          },
          required: ["meaning", "example"]
        }
      }
    });
    const text = response.text;
    res.json(JSON.parse(text));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TTS Generation
router.post('/speech', async (req, res) => {
    try {
        const { text } = req.body;
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        res.json({ audioData: base64Audio });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;