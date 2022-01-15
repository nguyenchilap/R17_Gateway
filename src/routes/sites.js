const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController')
const {uploadAvatar} = require('../config/multer');

//define route
router.post('/register/upload-avatar', uploadAvatar.single('img'), siteController.uploadAvatar);
router.post('/register/send-otp', siteController.sendOtp);

router.post('/register', siteController.register);
router.post('/login', siteController.login);

router.get('/register', siteController.showRegister);
router.get('/login', siteController.showLogin);

router.get('/', siteController.showHome);
module.exports = router;