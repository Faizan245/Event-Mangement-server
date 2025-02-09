const Event = require('../models/Event');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Configure Multer for handling multiple files
const storage = multer.diskStorage({});
const upload = multer({ storage });

// @desc    Create a new event with multiple image uploads
// @route   POST /api/events
const createEvent = async (req, res) => {
  const { email, name, description, date, location, category, maxAttendees } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let uploadedImageUrls = [];
    
    // Upload multiple images to Cloudinary if provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'event_images',
          public_id: uuidv4(),
        });
        uploadedImageUrls.push(result.secure_url);
      }
    }
     // Generate unique event ID
     const eventId = uuidv4();

    const event = await Event.create({
      event_id: eventId,
      name,
      description,
      date,
      location,
      category,
      maxAttendees,
      createdBy: user.email,
      documentURLs: uploadedImageUrls,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get all events
// @route   GET /api/events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'username');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Fetch events by email
// @route   POST /api/events/by-email
const fetchEventsByEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email parameter is required' });
  }

  try {
    // Validate the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const events = await Event.find({ createdBy: email });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Delete an event by ID
// @route   DELETE /api/events/:id
const deleteEvent = async (req, res) => {
  const { event_id } = req.params;

  try {
    const event = await Event.findOne({ event_id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.deleteOne({ event_id });
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createEvent, getEvents, fetchEventsByEmail, deleteEvent, upload };
