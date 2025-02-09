const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
  {
    event_id: {type: String, required: true},
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    maxAttendees: { type: Number, required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: String, required: true }, // Store username instead of ObjectId
    documentURLs: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
