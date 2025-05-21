import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/chatbot', async (req, res) => {
  const { prompt } = req.body;

  try {
    // Send the prompt to the Flask API
    const response = await axios.post(
      'http://localhost:11434/api/generate',  // Flask API endpoint
      { prompt: prompt }
    );

    // Get the response from the Flask API and send it back to the frontend
    const reply = response.data.response;
    res.json({ reply });
  } catch (err) {
    console.error('Error while contacting the model API:', err.message);
    res.status(500).json({ reply: 'Something went wrong while contacting the medical AI.' });
  }
});

export default router;
