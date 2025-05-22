import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(cors());

// ======= ЗАПОЛНИ СВОИ ДАННЫЕ =======
const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';

app.use(express.static(path.join(__dirname, '../public')));

app.post('/send-message', async (req, res) => {
  const { name, email, telegram, message } = req.body;

  let msg = `<b>Новая заявка с сайта Sekta.media</b>%0A`;
  msg += `<b>Имя:</b> ${name || '-'}%0A`;
  msg += `<b>Email:</b> ${email || '-'}%0A`;
  msg += `<b>Telegram:</b> ${telegram || '-'}%0A`;
  msg += `<b>Сообщение:</b> ${message || '-'}`;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&parse_mode=HTML&text=${msg}`;
  try {
    const tgRes = await fetch(url);
    if (tgRes.ok) {
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false });
    }
  } catch {
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Backend started on port', PORT));
