const express = require('express');
const router = express.Router();
const Note = require('../models/note');

// @route   POST /api/notes
// @desc    Create a new note
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;

    const newNote = new Note({ title, content });
    const savedNote = await newNote.save();

    res.status(201).json(savedNote);
  } catch (err) {
    res.status(500).json({ error: 'Error creating note' });
  }
});

// @route   GET /api/notes
// @desc    Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching notes' });
  }
});

module.exports = router;
