require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Speichere die Codes temporär (in Produktion würde man eine Datenbank verwenden)
const verificationCodes = new Map();

app.post('/api/send-verification', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Speichere den Code mit Ablaufzeit (15 Minuten)
    verificationCodes.set(phoneNumber, {
      code: verificationCode,
      expires: Date.now() + 15 * 60 * 1000
    });

    // Sende SMS via Twilio
    await twilioClient.messages.create({
      body: `Ihr Verifizierungscode lautet: ${verificationCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    res.json({ success: true });
  } catch (error) {
    console.error('SMS sending error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send verification code' 
    });
  }
});

app.post('/api/verify-code', (req, res) => {
  const { phoneNumber, code } = req.body;
  const storedData = verificationCodes.get(phoneNumber);

  if (!storedData) {
    return res.status(400).json({ 
      success: false, 
      error: 'No verification code found' 
    });
  }

  if (Date.now() > storedData.expires) {
    verificationCodes.delete(phoneNumber);
    return res.status(400).json({ 
      success: false, 
      error: 'Verification code expired' 
    });
  }

  if (storedData.code !== code) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid verification code' 
    });
  }

  // Code ist korrekt - lösche es
  verificationCodes.delete(phoneNumber);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
