const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['general', 'word', 'idiom', 'thought'], default: 'general' },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

CollectionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Collection', CollectionSchema);