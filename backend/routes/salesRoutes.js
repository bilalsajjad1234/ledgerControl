const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const auth = require('../middleware/auth');

router.post('/', auth, salesController.create);
router.get('/', auth, salesController.list);
router.put('/:id/return', auth, salesController.returnSale);

module.exports = router;
