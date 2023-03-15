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

app.post('/upload', upload.fields([{ name: 'proposal', maxCount: 1 }, { name: 'presentation', maxCount: 1 }]), async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: './googlekey.json',
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const driveService = google.drive({ version: 'v3', auth });
    const { Readable } = require('stream');
    const files = Object.values(req.files);
    const fileIds = [];

    for (let file of files) {
      const media = {
        mimeType: file[0].mimetype,
        body: Readable.from(file[0].buffer),
      };

      const firstName = req.body.firstName;
      const lastName = req.body.lastName;

      const proposalName = `${firstName}${lastName}proposal`;
      const presentationName = `${firstName}${lastName}presentation`;

      const fileMetaData = {
        name: file[0].fieldname.includes('proposal') ? proposalName : presentationName,
        parents: [GOOGLE_API_FOLDER_ID],
      };

      const response = await driveService.files.create({
        resource: fileMetaData,
        media: media,
        fields: 'id',
      });

      if (response && response.data && response.data.id) {
        fileIds.push(response.data.id);
      }
    }

    const links = fileIds.map((id, index) => `<a href="https://drive.google.com/file/d/${id}" target="_blank">${index === 0 ? 'Proposal' : 'Presentation'} link</a>`);
    res.send(`Files uploaded successfully: ${links.join(', ')}`);
  } catch (err) {
    console.error('Upload file error', err);
    res.status(500).send('Error uploading file');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
