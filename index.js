const express = require('express');
const app = express();
app.use(express.json());

const GROQ_KEY = process.env.GROQ_KEY || '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';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.post('/generate', async (req, res) => {
  const { messages } = req.body;
  
  console.log('📨 Получен запрос');
  
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        max_tokens: 4096,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Ответ получен');
    res.json(data);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('🤖 Groq AI Bot is running! ⚡');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', groq_key_set: !!GROQ_KEY && GROQ_KEY !== 'your-key-here' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
