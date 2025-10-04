const express = require('express');
const router = express.Router();
const Note = require('../models/note');

// @route   POST /api/notes
// @desc    Create a new note
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const newNote = new Note({ title, content });
    const savedNote = await newNote.save();

    res.status(201).json(savedNote);
  } catch (err) {
    console.error("Error creating note:", err);
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
    console.error("Error fetching notes:", err); // 👈 this will show the actual reason
    res.status(500).json({ error: 'Error fetching notes' });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update a note by ID
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title && !content) {
      return res.status(400).json({ error: 'At least one field (title or content) is required' });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(updatedNote);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ error: 'Error updating note' });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ error: 'Error deleting note' });
  }
});

// @route   GET /api/notes/search
// @desc    Search notes by title
router.get('/search', async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ error: 'Title query param is required' });
    }

    const notes = await Note.find({ title: { $regex: title, $options: 'i' } });
    res.json(notes);
  } catch (err) {
    console.error("Error searching notes:", err);
    res.status(500).json({ error: 'Error searching notes' });
  }
});

module.exports = router;