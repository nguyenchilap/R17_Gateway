const express = require('express');
const router = express.Router();

const meController = require('../app/controllers/MeController')

//define route

router.get('/account/change-password', meController.showChangePassword);
router.get('/account/change-information', meController.showChangeInfo);

module.exports = router;