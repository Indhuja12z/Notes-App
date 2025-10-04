// server.js
require('dotenv').config(); // load .env variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const notesRoutes = require('./routes/noteRoutes');
app.use('/api/notes', notesRoutes);

// Read MongoDB URI and PORT from .env
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Check if MONGO_URI exists
if (!MONGO_URI) {
  console.error('MONGO_URI missing in .env');
  process.exit(1);
}

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log(✅ MongoDB connected to database: ${mongoose.connection.name}))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Start server
app.listen(PORT, () => {
  console.log(🚀 Server running on port ${PORT});
});