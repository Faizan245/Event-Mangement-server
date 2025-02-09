const express = require('express');
const { registerUser, loginUser, logoutUser, deleteUser, upload } = require('../controllers/authController');
const router = express.Router();

router.post('/register', upload.single('profile'), registerUser);
router.post('/login', loginUser);
router.post('logout', logoutUser);
router.delete('/delete', deleteUser)

module.exports = router;