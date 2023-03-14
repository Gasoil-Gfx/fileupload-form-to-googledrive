const { google } = require('googleapis');
const express = require('express');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.static('public'));

const GOOGLE_API_FOLDER_ID = process.env.GOOGLE_API_FOLDER_ID;

const upload = multer();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, `form.html`));
});

app.post('/upload', upload.single('presentation'), async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: './googlekey.json',
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const driveService = google.drive({ version: 'v3', auth });

    const media = {
      mimeType: req.file.mimetype,
      body: req.file.stream,
    };

    const fileMetaData = {
      name: req.file.originalname,
      parents: [GOOGLE_API_FOLDER_ID],
    };

    const response = await driveService.files.create({
      resource: fileMetaData,
      media: media,
      fields: 'id',
    });

    res.send('File uploaded successfully');
  } catch (err) {
    console.log('Upload file error', err);
    res.status(500).send('Error uploading file');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));