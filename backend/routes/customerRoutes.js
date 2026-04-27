const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middleware/auth');

router.get('/', auth, customerController.list);
router.post('/', auth, customerController.create);
router.put('/:id', auth, customerController.update);
router.delete('/:id', auth, customerController.remove);

module.exports = router;
