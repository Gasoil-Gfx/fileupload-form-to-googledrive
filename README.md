# fileupload-form-to-googledrive
This is a sort of form that uploads files to Google Drive using the Google Drive API and Node.js.

<strong>IMPORTANT: You need to download the googlekey.json file from the Google Developers Console and place it in the root directory of this project.</strong>

This repository contains an example of how to upload files to Google Drive using the Google Drive API and Node.js.

Create a new project in the Google Cloud Console.

Enable the Google Drive API for your project.

Create credentials for a service account with the following steps:

  <ul>
      <li>In the Google Cloud Console, navigate to the APIs & Services > Credentials page.</li>
      <li>Click Create credentials > Service account key.</li>
      <li>Select JSON as the key type and click Create.</li>
      <li>Save the generated JSON file to your local machine.</li>
  </ul>

Share the desired Google Drive folder with the email address of the service account that you just created. The email address can be found in the downloaded JSON file.

Create a new file named .env in the root directory of the project and add the variable: GOOGLE_API_FOLDER_ID=`YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE`.
