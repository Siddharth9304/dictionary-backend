const mongoose = require('mongoose');

const SavedEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Entry', required: true },
  collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true },
  savedAt: { type: Date, default: Date.now },
});

SavedEntrySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('SavedEntry', SavedEntrySchema);