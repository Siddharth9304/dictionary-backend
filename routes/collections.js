const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const SavedEntry = require('../models/SavedEntry');

// --- Collections ---

// Get all collections
router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find();
    res.json(collections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create collection
router.post('/', async (req, res) => {
  try {
    const { id, ...data } = req.body;
    const newColl = new Collection(data);
    await newColl.save();
    res.json(newColl);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Saved Entries ---

// Get all saved entries
router.get('/saved', async (req, res) => {
    try {
        const saved = await SavedEntry.find();
        res.json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add saved entry
router.post('/saved', async (req, res) => {
    try {
        const { userId, entryId, collectionId } = req.body;
        // Check for duplicate
        const exists = await SavedEntry.findOne({ userId, entryId, collectionId });
        if (exists) return res.json(exists);

        const newSaved = new SavedEntry({ userId, entryId, collectionId });
        await newSaved.save();
        res.json(newSaved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Remove saved entry
router.delete('/saved/:id', async (req, res) => {
    try {
        await SavedEntry.findByIdAndDelete(req.params.id);
        res.json({ message: 'Removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;