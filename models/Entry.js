const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  vocabulary: {
    word: String,
    meaning: String,
    synonyms: [String],
    antonyms: [String],
    example: String,
  },
  idiom: {
    phrase: String,
    meaning: String,
    example: String,
  },
  thought: {
    thought: String,
    meaning: String,
    example: String,
  },
});

EntrySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Entry', EntrySchema);