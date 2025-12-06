const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');

// Get all entries
router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find().sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create entry
router.post('/', async (req, res) => {
  try {
    // Remove client-generated ID if present, let Mongo generate _id
    const { id, ...entryData } = req.body;
    const newEntry = new Entry(entryData);
    await newEntry.save();
    res.json(newEntry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update entry
router.put('/:id', async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const updated = await Entry.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete entry
router.delete('/:id', async (req, res) => {
  try {
    await Entry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle Like
router.post('/:id/like', async (req, res) => {
    try {
        const { userId } = req.body;
        const entry = await Entry.findById(req.params.id);
        if (!entry) return res.status(404).json({message: 'Not found'});

        // Mongoose arrays usually have .addToSet or .pull, but we toggle manually to check state
        const index = entry.likes.indexOf(userId);
        if (index === -1) {
            entry.likes.push(userId);
        } else {
            entry.likes.splice(index, 1);
        }
        await entry.save();
        res.json(entry);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;