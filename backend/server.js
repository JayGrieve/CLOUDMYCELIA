const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3001;

// Require route handlers
const userJsonRouter = require('./routes/full-user-json'); // Rename this route handler to avoid conflict

// Apply middleware (if any)

// Mount route handlers
app.use('/read-json', userJsonRouter); // Use the correct route handler

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
