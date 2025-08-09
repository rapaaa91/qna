import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Pesan kosong!' });
    }

    const filePath = path.join(process.cwd(), 'messages.json');
    let messages = [];

    // Baca data lama
    if (fs.existsSync(filePath)) {
      messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    // Tambahkan pesan baru
    messages.push({
      id: Date.now(),
      text: message,
      date: new Date().toISOString()
    });

    // Simpan ke file
    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}