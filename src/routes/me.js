const express = require('express');
const router = express.Router();

const meController = require('../app/controllers/MeController')
const {uploadAvatar} = require('../config/multer');

//define route

router.post('/account/change-avatar', uploadAvatar.single('img'), meController.changeAvatar);

router.get('/account/change-password', meController.showChangePassword);
router.get('/account/change-information', meController.showChangeInfo);

module.exports = router;