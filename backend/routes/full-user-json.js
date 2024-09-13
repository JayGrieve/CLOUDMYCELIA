require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage'); // Import Upload from lib-storage
const router = express.Router();

const awsConfig = {
  region: process.env.AWS_REGION, // Region from environment variables
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Access key from environment variables
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Secret access key from environment variables
  },
};

const client = new S3Client(awsConfig);
const bucketName = 'user-info-with-history';
const jsonFileName = 'user_demo.json';

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });

// GET JSON from S3
router.get('/', async (req, res) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: jsonFileName,
    };

    const command = new GetObjectCommand(params);
    const data = await client.send(command);

    const jsonString = await streamToString(data.Body);
    const jsonData = JSON.parse(jsonString);

    res.json(jsonData);
  } catch (error) {
    console.error('Error reading JSON file from S3:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT to update JSON on S3
router.put('/', async (req, res) => {
  try {
    const updatedJson = req.body; // Get the updated JSON from the request body
    const jsonString = JSON.stringify(updatedJson); // Convert JSON to string
    const buffer = Buffer.from(jsonString); // Convert string to buffer

    const upload = new Upload({
      client,
      params: {
        Bucket: bucketName,
        Key: jsonFileName,
        Body: buffer, // Use buffer for the Body
        ContentType: 'application/json', // Ensure content type is JSON
      },
    });

    // Execute the upload
    await upload.done();

    res.json({ message: 'JSON updated successfully in S3' });
  } catch (error) {
    console.error('Error updating JSON file in S3:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
