const express = require('express');
const router = express.Router();
const creditController = require('../controllers/creditController');
const auth = require('../middleware/auth');

router.get('/', auth, creditController.list);
router.put('/:id/pay', auth, creditController.pay);

module.exports = router;
