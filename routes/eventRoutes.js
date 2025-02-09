const express = require('express');
const { createEvent, getEvents, upload, fetchEventsByEmail, deleteEvent } = require('../controllers/eventController');
const router = express.Router();

router.post('/createEvent', upload.array('files', 5), createEvent);
router.get('/getEvents', getEvents);
router.post('/getEventsByEmail', fetchEventsByEmail);
router.delete('/deleteEvent/:event_id', deleteEvent)

module.exports = router;